import { Pool } from 'pg'
import { DsqlSigner } from '@aws-sdk/dsql-signer'
import { ENTITIES, ENTITY_NAMES, isEntity, sourceFields, sourceHash, type Entity } from '../../src/lib/translation-spec'
import { MODEL, TARGET_LOCALES, TranslationRefusedError, mapLimit, translateSegments, usage, usageReport, type TargetLocale } from './claude'

// AWS Lambda "misbah-translator": translates website content from Bosnian into
// English, Arabic, German and Turkish and stores it in the "Translation" table.
// Each text is translated once and saved; visitors only read the saved
// translations, so Claude is paid per translated text, never per visit.
//
// Events:
//   { entity, id }                     – an admin created/edited an item (sent by the website)
//   { entity, id, locale, force: true } – "Prevedi ponovo" in /admin/prijevodi (overrides hand edits)
//   { sweep: true }                    – daily (EventBridge rule misbah-translator-daily) and the
//                                        button in /admin/prijevodi: everything missing or outdated
//
// Every invocation that called Claude logs "claude usage" with tokens and the
// estimated cost in USD (CloudWatch log group /aws/lambda/misbah-translator).
//
// Deploy: npm run translator:deploy (scripts/aws/translator.ts)

const HOST = process.env.DSQL_HOST ?? '2nuhddmmzudvhgj2wsbw5k52ze.dsql.eu-central-1.on.aws'
const REGION = process.env.DSQL_REGION ?? 'eu-central-1'
const USER = process.env.DSQL_USER ?? 'misbah_app'

let pool: Pool | null = null
function db(): Pool {
  if (!pool) {
    const signer = new DsqlSigner({ hostname: HOST, region: REGION })
    pool = new Pool({
      host: HOST,
      port: 5432,
      database: 'postgres',
      user: USER,
      password: () => (USER === 'admin' ? signer.getDbConnectAdminAuthToken() : signer.getDbConnectAuthToken()),
      ssl: { rejectUnauthorized: true },
      max: 4,
      idleTimeoutMillis: 30_000,
      maxLifetimeSeconds: 50 * 60,
    })
  }
  return pool
}

type Existing = { locale: string; sourceHash: string; manual: boolean; status: string; error: string | null }

const log = (msg: string, data: Record<string, unknown> = {}) => console.log(JSON.stringify({ msg, ...data }))

/** Aurora DSQL uses optimistic concurrency: retry a statement that lost a race */
async function query<T = Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<{ rows: T[]; rowCount: number }> {
  for (let attempt = 0; ; attempt++) {
    try {
      const r = await db().query(sql, params)
      return { rows: r.rows as T[], rowCount: r.rowCount ?? 0 }
    } catch (err) {
      const code = (err as { code?: string }).code
      if (attempt < 4 && (code === '40001' || code === 'OC000' || code === 'OC001')) {
        await new Promise(r => setTimeout(r, 100 * 2 ** attempt))
        continue
      }
      throw err
    }
  }
}

async function saveTranslation(entity: Entity, id: number, locale: string, fields: Record<string, string>, hash: string) {
  const json = JSON.stringify(fields)
  const updated = await query(
    `UPDATE "Translation" SET fields = $4, "sourceHash" = $5, status = 'done', manual = false, model = $6, error = NULL, "updatedAt" = now()
     WHERE entity = $1 AND "entityId" = $2 AND locale = $3`,
    [entity, id, locale, json, hash, MODEL],
  )
  if (updated.rowCount > 0) return
  try {
    await query(
      `INSERT INTO "Translation" (entity, "entityId", locale, fields, "sourceHash", status, manual, model, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, 'done', false, $6, now(), now())`,
      [entity, id, locale, json, hash, MODEL],
    )
  } catch (err) {
    // Another invocation inserted it meanwhile: update that row instead
    if ((err as { code?: string }).code === '23505') {
      await query(
        `UPDATE "Translation" SET fields = $4, "sourceHash" = $5, status = 'done', manual = false, model = $6, error = NULL, "updatedAt" = now()
         WHERE entity = $1 AND "entityId" = $2 AND locale = $3`,
        [entity, id, locale, json, hash, MODEL],
      )
    } else throw err
  }
}

async function markExisting(entity: Entity, id: number, locale: string, status: 'stale' | 'error', error: string | null) {
  await query(
    `UPDATE "Translation" SET status = $4, error = $5, "updatedAt" = now() WHERE entity = $1 AND "entityId" = $2 AND locale = $3`,
    [entity, id, locale, status, error],
  )
}

// Failed translations are written to the error column, so a text that keeps
// failing cannot keep costing money: failures after Claude answered (refusal,
// answer too long or broken, saving failed) are counted there per version of
// the Bosnian text ("[attempt 2 1a2b3c4d] …"), and the daily sweep stops after
// MAX_PAID_ATTEMPTS; a refusal is not retried automatically at all. Errors
// before Claude answered (no access, throttling, outage) cost nothing and are
// not counted. An admin action (saving the item, "Prevedi ponovo") always
// tries again.
const MAX_PAID_ATTEMPTS = 3

function errorTag(attempts: number, hash: string): string {
  return Number.isFinite(attempts) ? `[attempt ${attempts} ${hash.slice(0, 8)}]` : `[no retry ${hash.slice(0, 8)}]`
}

/** Paid failed attempts on this version of the Bosnian text (0 once the text has changed) */
function paidAttempts(error: string | null, hash: string): number {
  const m = (error ?? '').match(/^\[(?:attempt (\d+)|no retry) ([0-9a-f]{8})\]/)
  if (!m || m[2] !== hash.slice(0, 8)) return 0
  return m[1] === undefined ? Infinity : Number(m[1])
}

/** True for errors raised before Claude produced anything (nothing billed) */
function unbilled(err: unknown): boolean {
  const e = err as { status?: unknown; name?: string }
  return typeof e.status === 'number' || e.name === 'APIConnectionError' || e.name === 'APIConnectionTimeoutError'
}

/** Records a failed translation; an earlier translation of the item stays visible */
async function saveError(entity: Entity, id: number, locale: string, hash: string, message: string, hadRow: boolean) {
  if (hadRow) return markExisting(entity, id, locale, 'error', message)
  try {
    // No translation yet: an empty row keeps the error (the page shows Bosnian)
    await query(
      `INSERT INTO "Translation" (entity, "entityId", locale, fields, "sourceHash", status, manual, model, error, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, '{}', $4, 'error', false, $5, $6, now(), now())`,
      [entity, id, locale, hash, MODEL, message],
    )
  } catch (err) {
    if ((err as { code?: string }).code === '23505') await markExisting(entity, id, locale, 'error', message)
    else throw err
  }
}

type Row = Record<string, unknown> & { id: number }

/** Which languages of an item need (re)translating; marks hand-edited ones whose source changed as stale */
async function plan(entity: Entity, id: number, hash: string, existing: Existing[], opts: { locale?: string; force?: boolean; adminAction?: boolean }): Promise<TargetLocale[]> {
  const todo: TargetLocale[] = []
  for (const locale of TARGET_LOCALES) {
    if (opts.locale && opts.locale !== locale) continue
    const ex = existing.find(e => e.locale === locale)
    if (opts.force || !ex) { todo.push(locale); continue }
    if (ex.manual) {
      if (ex.sourceHash !== hash && ex.status !== 'stale') await markExisting(entity, id, locale, 'stale', null)
      continue
    }
    if (ex.status === 'error') {
      if (opts.adminAction || paidAttempts(ex.error, hash) < MAX_PAID_ATTEMPTS) todo.push(locale)
      continue
    }
    if (ex.sourceHash !== hash) todo.push(locale)
  }
  return todo
}

async function translateRow(entity: Entity, row: Row, locales: TargetLocale[], hash: string, existing: Existing[]) {
  const fields = sourceFields(entity, row)
  const keys = Object.keys(fields)
  const notes = ENTITIES[entity].notes
  await Promise.all(locales.map(async locale => {
    const t0 = Date.now()
    try {
      const out = await translateSegments(keys.map(k => fields[k]), locale, { kind: 'content', notes })
      await saveTranslation(entity, row.id, locale, Object.fromEntries(keys.map((k, i) => [k, out[i]])), hash)
      log('translated', { entity, id: row.id, locale, ms: Date.now() - t0 })
    } catch (err) {
      const ex = existing.find(e => e.locale === locale)
      const before = ex?.status === 'error' ? paidAttempts(ex.error, hash) : 0
      const refused = err instanceof TranslationRefusedError
      const attempts = refused ? Infinity : unbilled(err) ? before : before + 1
      const message = `${errorTag(attempts, hash)} ${refused ? 'refusal: ' : ''}${(err as Error).message ?? String(err)}`.slice(0, 500)
      log('translation failed', { entity, id: row.id, locale, error: message })
      try {
        await saveError(entity, row.id, locale, hash, message, !!ex)
      } catch (saveErr) {
        log('could not record the failure', { entity, id: row.id, locale, error: String((saveErr as Error).message ?? saveErr) })
      }
    }
  }))
}

async function translateOne(entity: Entity, id: number, opts: { locale?: string; force?: boolean }) {
  const { table } = ENTITIES[entity]
  const { rows } = await query<Row>(`SELECT * FROM "${table}" WHERE id = $1`, [id])
  const row = rows[0]
  if (!row) {
    await query(`DELETE FROM "Translation" WHERE entity = $1 AND "entityId" = $2`, [entity, id])
    log('item gone, translations removed', { entity, id })
    return
  }
  const fields = sourceFields(entity, row)
  if (Object.keys(fields).length === 0) return
  const hash = sourceHash(fields)
  const existing = (await query<Existing>(
    `SELECT locale, "sourceHash", manual, status, error FROM "Translation" WHERE entity = $1 AND "entityId" = $2`,
    [entity, id],
  )).rows
  const locales = await plan(entity, id, hash, existing, { ...opts, adminAction: true })
  if (locales.length) await translateRow(entity, row, locales, hash, existing)
}

async function sweep(deadline: number, limit: number) {
  const work: { entity: Entity; row: Row; locales: TargetLocale[]; hash: string; existing: Existing[] }[] = []
  for (const entity of ENTITY_NAMES) {
    const { table, fields } = ENTITIES[entity]
    const columns = ['id', ...fields].map(c => `"${c}"`).join(', ')
    const rows = (await query<Row>(`SELECT ${columns} FROM "${table}" WHERE published = true ORDER BY id DESC`)).rows
    const all = (await query<Existing & { entityId: number }>(
      `SELECT "entityId", locale, "sourceHash", manual, status, error FROM "Translation" WHERE entity = $1`,
      [entity],
    )).rows
    const byItem = new Map<number, Existing[]>()
    for (const t of all) byItem.set(t.entityId, [...(byItem.get(t.entityId) ?? []), t])
    for (const row of rows) {
      const fields = sourceFields(entity, row)
      if (Object.keys(fields).length === 0) continue
      const hash = sourceHash(fields)
      const existing = byItem.get(row.id) ?? []
      const locales = await plan(entity, row.id, hash, existing, {})
      if (locales.length) work.push({ entity, row, locales, hash, existing })
    }
    // Translations of deleted items
    const { rows: everything } = await query<{ id: number }>(`SELECT id FROM "${table}"`)
    const existingIds = new Set(everything.map(r => r.id))
    const orphans = Array.from(byItem.keys()).filter(id => !existingIds.has(id))
    for (const id of orphans) await query(`DELETE FROM "Translation" WHERE entity = $1 AND "entityId" = $2`, [entity, id])
    if (orphans.length) log('removed translations of deleted items', { entity, count: orphans.length })
  }

  log('sweep planned', { items: work.length, translations: work.reduce((n, w) => n + w.locales.length, 0) })
  let done = 0
  await mapLimit(work.slice(0, limit), 3, async w => {
    if (Date.now() > deadline) return
    await translateRow(w.entity, w.row, w.locales, w.hash, w.existing)
    done++
  })
  log('sweep finished', { done, remaining: Math.max(0, work.length - done) })
  return { planned: work.length, done }
}

/** For tests of the retry rules (no database needed) */
export const _test = { paidAttempts, errorTag, unbilled, plan }

type Event = { entity?: string; id?: number | string; locale?: string; force?: boolean; sweep?: boolean; limit?: number }
type Context = { getRemainingTimeInMillis?: () => number }

export async function handler(event: Event, context?: Context) {
  const remaining = context?.getRemainingTimeInMillis?.() ?? 14 * 60_000
  // Leave time to finish the requests already running
  const deadline = Date.now() + remaining - 3 * 60_000
  const usageBefore = { ...usage }

  try {
    if (event.sweep) return await sweep(deadline, event.limit ?? 10_000)

    if (!isEntity(event.entity) || event.id === undefined) {
      log('ignored event', { event })
      return { ok: false }
    }
    await translateOne(event.entity, Number(event.id), { locale: event.locale, force: event.force })
    return { ok: true }
  } finally {
    const report = usageReport(usageBefore)
    if (report.requests) log('claude usage', report)
  }
}
