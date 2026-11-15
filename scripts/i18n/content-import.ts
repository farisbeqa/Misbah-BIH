// Writes translations made outside the translator worker (e.g. the first full
// translation of the site in a Claude Code session, see content-export.ts)
// into the "Translation" table. Translations corrected by hand in
// /admin/prijevodi are left alone; running it twice changes nothing new.
// Each translation keeps the fingerprint of the Bosnian text it was made from,
// so the translator worker only re-translates items edited after the export.
//
//   AWS_PROFILE=AdministratorAccess-770324276704 node scripts/run-ts.mjs scripts/i18n/content-import.ts <import.json> [--dry-run]
// --dry-run only reads the database and prints what would be written.
import { readFileSync } from 'node:fs'
import { Client } from 'pg'
import { DsqlSigner } from '@aws-sdk/dsql-signer'
import { ENTITIES, ENTITY_NAMES, isEntity, sourceFields, sourceHash } from '../../src/lib/translation-spec'

const HOST = process.env.DSQL_HOST ?? '2nuhddmmzudvhgj2wsbw5k52ze.dsql.eu-central-1.on.aws'
const REGION = process.env.DSQL_REGION ?? 'eu-central-1'
const USER = process.env.DSQL_USER ?? 'admin'
const LOCALES = ['en', 'ar', 'de', 'tr']
const BATCH = 100

type Item = { entity: string; id: number; locale: string; hash: string; fields: Record<string, string> }

async function main() {
  const file = process.argv[2]
  if (!file) throw new Error('Usage: content-import.ts <import.json>')
  const data = JSON.parse(readFileSync(file, 'utf8')) as { model: string; rows: Item[] }
  const model = String(data.model || 'imported').slice(0, 100)
  for (const r of data.rows) {
    const ok = isEntity(r.entity) && LOCALES.includes(r.locale) && Number.isInteger(r.id) && typeof r.hash === 'string'
      && r.fields && typeof r.fields === 'object' && Object.keys(r.fields).length > 0
      && Object.entries(r.fields).every(([k, v]) => (ENTITIES[r.entity as keyof typeof ENTITIES].fields as readonly string[]).includes(k) && typeof v === 'string' && v.trim() !== '')
    if (!ok) throw new Error(`Invalid row in ${file}: ${JSON.stringify(r).slice(0, 200)}`)
  }

  const signer = new DsqlSigner({ hostname: HOST, region: REGION })
  const password = USER === 'admin' ? await signer.getDbConnectAdminAuthToken() : await signer.getDbConnectAuthToken()
  const db = new Client({ host: HOST, port: 5432, database: 'postgres', user: USER, password, ssl: { rejectUnauthorized: true } })
  await db.connect()

  // What is there now: hand-corrected translations stay; items deleted since the export are skipped
  const existing = (await db.query(`SELECT entity, "entityId", locale, manual FROM "Translation"`)).rows
  const present = new Map(existing.map(r => [`${r.entity}/${r.entityId}/${r.locale}`, r.manual as boolean]))
  const current = new Map<string, string>()
  for (const entity of ENTITY_NAMES) {
    const { table, fields } = ENTITIES[entity]
    const columns = ['id', ...fields].map(c => `"${c}"`).join(', ')
    for (const row of (await db.query(`SELECT ${columns} FROM "${table}"`)).rows) {
      current.set(`${entity}/${row.id}`, sourceHash(sourceFields(entity, row)))
    }
  }

  const stats = { inserted: 0, updated: 0, keptManual: 0, itemGone: 0, changedSinceExport: 0 }
  if (process.argv.includes('--dry-run')) {
    for (const r of data.rows) {
      const key = `${r.entity}/${r.id}/${r.locale}`
      const now = current.get(`${r.entity}/${r.id}`)
      if (now === undefined) stats.itemGone++
      else if (present.get(key) === true) stats.keptManual++
      else {
        if (now !== r.hash) stats.changedSinceExport++
        if (present.has(key)) stats.updated++
        else stats.inserted++
      }
    }
    await db.end()
    console.log(`Dry run (nothing written): would add ${stats.inserted}, update ${stats.updated}, keep ${stats.keptManual} hand-corrected, skip ${stats.itemGone} (item deleted); ${stats.changedSinceExport} edited since the export.`)
    return
  }
  for (let i = 0; i < data.rows.length; i += BATCH) {
    const batch = data.rows.slice(i, i + BATCH)
    for (let attempt = 0; ; attempt++) {
      const s = { inserted: 0, updated: 0, keptManual: 0, itemGone: 0, changedSinceExport: 0 }
      try {
        await db.query('BEGIN')
        for (const r of batch) {
          const key = `${r.entity}/${r.id}/${r.locale}`
          const now = current.get(`${r.entity}/${r.id}`)
          if (now === undefined) { s.itemGone++; continue }
          if (present.get(key) === true) { s.keptManual++; continue }
          if (now !== r.hash) s.changedSinceExport++
          const params = [r.entity, r.id, r.locale, JSON.stringify(r.fields), r.hash, model]
          if (present.has(key)) {
            await db.query(
              `UPDATE "Translation" SET fields = $4, "sourceHash" = $5, status = 'done', manual = false, model = $6, error = NULL, "updatedAt" = now()
               WHERE entity = $1 AND "entityId" = $2 AND locale = $3 AND manual = false`,
              params,
            )
            s.updated++
          } else {
            await db.query(
              `INSERT INTO "Translation" (entity, "entityId", locale, fields, "sourceHash", status, manual, model, "createdAt", "updatedAt")
               VALUES ($1, $2, $3, $4, $5, 'done', false, $6, now(), now())`,
              params,
            )
            s.inserted++
          }
        }
        await db.query('COMMIT')
        for (const k of Object.keys(stats) as (keyof typeof stats)[]) stats[k] += s[k]
        for (const r of batch) if (!present.has(`${r.entity}/${r.id}/${r.locale}`) && current.has(`${r.entity}/${r.id}`)) present.set(`${r.entity}/${r.id}/${r.locale}`, false)
        break
      } catch (err) {
        await db.query('ROLLBACK').catch(() => {})
        const code = (err as { code?: string }).code
        // Aurora DSQL optimistic concurrency, or a row inserted meanwhile: try the batch again
        if (attempt < 5 && (code === '40001' || code === 'OC000' || code === 'OC001' || code === '23505')) {
          if (code === '23505') {
            const fresh = (await db.query(`SELECT entity, "entityId", locale, manual FROM "Translation"`)).rows
            for (const r of fresh) present.set(`${r.entity}/${r.entityId}/${r.locale}`, r.manual)
          }
          await new Promise(res => setTimeout(res, 200 * 2 ** attempt))
          continue
        }
        throw err
      }
    }
    process.stdout.write(`\r${Math.min(i + BATCH, data.rows.length)} / ${data.rows.length}`)
  }
  await db.end()
  console.log(`\nDone: ${stats.inserted} added, ${stats.updated} updated, ${stats.keptManual} hand-corrected kept, ${stats.itemGone} skipped (item deleted)` +
    (stats.changedSinceExport ? `; ${stats.changedSinceExport} were edited since the export and will be re-translated by the worker` : '') + '.')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
