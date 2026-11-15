// Exports the Bosnian content the translator works on (published items, the
// same fields and source fingerprints as lambda/translator), so it can be
// translated outside the Lambda, e.g. the first full translation of the site in
// a Claude Code session. Read-only. The result goes back in with
// scripts/i18n/content-import.ts.
//
//   AWS_PROFILE=AdministratorAccess-770324276704 node scripts/run-ts.mjs scripts/i18n/content-export.ts <out.json>
import { writeFileSync } from 'node:fs'
import { Client } from 'pg'
import { DsqlSigner } from '@aws-sdk/dsql-signer'
import { ENTITIES, ENTITY_NAMES, sourceFields, sourceHash } from '../../src/lib/translation-spec'

const HOST = process.env.DSQL_HOST ?? '2nuhddmmzudvhgj2wsbw5k52ze.dsql.eu-central-1.on.aws'
const REGION = process.env.DSQL_REGION ?? 'eu-central-1'
const USER = process.env.DSQL_USER ?? 'admin'

async function main() {
  const out = process.argv[2]
  if (!out) throw new Error('Usage: content-export.ts <out.json>')
  const signer = new DsqlSigner({ hostname: HOST, region: REGION })
  const password = USER === 'admin' ? await signer.getDbConnectAdminAuthToken() : await signer.getDbConnectAuthToken()
  const db = new Client({ host: HOST, port: 5432, database: 'postgres', user: USER, password, ssl: { rejectUnauthorized: true } })
  await db.connect()
  await db.query('BEGIN READ ONLY')
  const rows: { entity: string; id: number; hash: string; fields: Record<string, string> }[] = []
  for (const entity of ENTITY_NAMES) {
    const { table, fields } = ENTITIES[entity]
    const columns = ['id', ...fields].map(c => `"${c}"`).join(', ')
    const r = await db.query(`SELECT ${columns} FROM "${table}" WHERE published = true ORDER BY id`)
    for (const row of r.rows) {
      const f = sourceFields(entity, row)
      if (Object.keys(f).length) rows.push({ entity, id: row.id, hash: sourceHash(f), fields: f })
    }
  }
  await db.query('ROLLBACK')
  await db.end()
  writeFileSync(out, JSON.stringify({ exportedAt: new Date().toISOString(), rows }, null, 1))
  const chars = rows.reduce((n, r) => n + Object.values(r.fields).reduce((m, v) => m + v.length, 0), 0)
  console.log(`Exported ${rows.length} items (${chars} characters) to ${out}`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
