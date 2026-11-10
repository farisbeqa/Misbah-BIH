// Copies the production Turso (SQLite) database into Aurora DSQL.
//
// Every run drops and recreates all tables, so it is safe to repeat — it is run
// once for testing and again for the final copy when the domain switches over.
// Media URLs (Cloudflare R2, phototourl) are rewritten to the S3/CloudFront CDN.
//
//   AWS_PROFILE=AdministratorAccess-770324276704 node scripts/aws/migrate-from-turso.js
//
// Reads Turso from .env.local (read-only) and connects to DSQL as `admin` with an
// IAM token from your AWS login.
require('dotenv').config({ path: '.env.local', quiet: true })
const { execSync } = require('child_process')
const { createClient } = require('@libsql/client')
const { Client } = require('pg')
const { DsqlSigner } = require('@aws-sdk/dsql-signer')

const HOST = process.env.DSQL_HOST || '2nuhddmmzudvhgj2wsbw5k52ze.dsql.eu-central-1.on.aws'
const REGION = 'eu-central-1'
const APP_USER = 'misbah_app'
const APP_ROLE_ARN = 'arn:aws:iam::770324276704:role/misbah-amplify-compute'
const MEDIA = 'https://d39iz2jyquc1uh.cloudfront.net'
const URL_REWRITES = [
  ['https://pub-5a2e25aa30fa42b992c300ed064005dc.r2.dev/', `${MEDIA}/`],
  ['https://cdn.phototourl.com/', `${MEDIA}/external/phototourl/`],
]
const BATCH = 200 // DSQL allows 3,000 changed rows per transaction

/** Prisma's PostgreSQL DDL for the schema, split into statements */
function prismaDdl() {
  const sql = execSync('npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script', { encoding: 'utf8' })
  return sql.split(/;\s*\n/).map(s => s.replace(/^\s*--.*$/gm, '').trim()).filter(Boolean)
}

/** Column name → Postgres type, per table, from the CREATE TABLE statements */
function columnTypes(statements) {
  const tables = {}
  for (const s of statements) {
    const m = s.match(/^CREATE TABLE "(\w+)" \(([\s\S]*)\)$/)
    if (!m) continue
    tables[m[1]] = {}
    for (const line of m[2].split('\n')) {
      const c = line.trim().match(/^"(\w+)" (\w+)/)
      if (c) tables[m[1]][c[1]] = c[2]
    }
  }
  return tables
}

function toTimestamp(v) {
  if (v === null || v === undefined) return null
  if (typeof v === 'number' || typeof v === 'bigint') return new Date(Number(v))
  const s = String(v)
  // SQLite CURRENT_TIMESTAMP ("2026-11-05 10:00:00") is UTC without a zone
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(s)) return new Date(s.replace(' ', 'T') + 'Z')
  return new Date(s)
}

function convert(value, type) {
  if (value === null || value === undefined) return null
  if (type === 'BOOLEAN') return value === true || value === 1 || value === '1' || value === 'true'
  if (type === 'TIMESTAMP') return toTimestamp(value)
  if (type === 'INTEGER') return Number(value)
  if (typeof value === 'string') return URL_REWRITES.reduce((s, [from, to]) => s.split(from).join(to), value)
  return value
}

async function main() {
  const turso = createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN })
  const signer = new DsqlSigner({ hostname: HOST, region: REGION })
  const pg = new Client({ host: HOST, port: 5432, database: 'postgres', user: 'admin', password: await signer.getDbConnectAdminAuthToken(), ssl: { rejectUnauthorized: true } })
  await pg.connect()

  const ddl = prismaDdl().filter(s => !s.startsWith('CREATE SCHEMA'))
  const types = columnTypes(ddl)
  const tables = Object.keys(types)

  // 1. Read everything from Turso
  const data = {}
  for (const t of tables) {
    data[t] = (await turso.execute(`SELECT * FROM "${t}" ORDER BY id`)).rows
    console.log(`read ${t.padEnd(14)} ${String(data[t].length).padStart(4)} rows`)
  }

  // 2. Recreate the tables. DSQL identity columns must be BIGINT, but the app's
  //    ids are Int, so each table gets its own sequence instead of SERIAL; new
  //    ids continue after the highest existing one.
  for (const t of [...tables].reverse()) {
    await pg.query(`DROP TABLE IF EXISTS "${t}"`)
    await pg.query(`DROP SEQUENCE IF EXISTS "${t}_id_seq"`)
  }
  for (const s of ddl.filter(s => s.startsWith('CREATE TABLE'))) {
    const t = s.match(/^CREATE TABLE "(\w+)"/)[1]
    const next = Math.max(0, ...data[t].map(r => Number(r.id))) + 1
    await pg.query(`CREATE SEQUENCE "${t}_id_seq" START WITH ${next} CACHE 1`)
    await pg.query(s.replace('"id" SERIAL NOT NULL', `"id" INTEGER NOT NULL DEFAULT nextval('"${t}_id_seq"')`))
  }

  // 3. Copy the rows
  for (const t of tables) {
    const cols = Object.keys(types[t])
    for (let i = 0; i < data[t].length; i += BATCH) {
      const rows = data[t].slice(i, i + BATCH)
      const values = []
      const tuples = rows.map(r => `(${cols.map(c => { values.push(convert(r[c], types[t][c])); return `$${values.length}` }).join(', ')})`)
      await pg.query(`INSERT INTO "${t}" (${cols.map(c => `"${c}"`).join(', ')}) VALUES ${tuples.join(', ')}`, values)
    }
  }

  // 4. Indexes (DSQL builds them asynchronously; wait for each)
  for (const s of ddl.filter(s => /^CREATE (UNIQUE )?INDEX/.test(s))) {
    const res = await pg.query(s.replace(/^CREATE (UNIQUE )?INDEX/, (m) => `${m} ASYNC`))
    const job = res.rows?.[0]?.job_id
    if (job) await pg.query('CALL sys.wait_for_job($1)', [job])
  }

  // 5. The website's database role, mapped to the Amplify compute role
  await pg.query(`CREATE ROLE ${APP_USER} WITH LOGIN`).catch(e => { if (!/already exists/.test(e.message)) throw e })
  await pg.query(`AWS IAM GRANT ${APP_USER} TO '${APP_ROLE_ARN}'`).catch(e => { if (!/already/.test(e.message)) throw e })
  for (const t of tables) {
    await pg.query(`GRANT SELECT, INSERT, UPDATE, DELETE ON "${t}" TO ${APP_USER}`)
    await pg.query(`GRANT USAGE ON SEQUENCE "${t}_id_seq" TO ${APP_USER}`)
  }

  // 6. Check
  let ok = true
  for (const t of tables) {
    const n = Number((await pg.query(`SELECT COUNT(*) AS n FROM "${t}"`)).rows[0].n)
    const same = n === data[t].length
    ok &&= same
    console.log(`${same ? 'OK ' : 'BAD'} ${t.padEnd(14)} ${n}/${data[t].length}`)
  }
  const left = (await pg.query(`SELECT COUNT(*) AS n FROM "BlogPost" WHERE "imageUrl" LIKE '%r2.dev%'`)).rows[0].n
  console.log(`R2 links left in BlogPost: ${left}`)
  await pg.end()
  if (!ok) process.exit(1)
  console.log('Done.')
}

main().catch(e => { console.error(e); process.exit(1) })
