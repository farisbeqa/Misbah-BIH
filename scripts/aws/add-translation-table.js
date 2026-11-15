// Creates the "Translation" table (website languages) in Aurora DSQL and lets the
// translator worker use the database. Only adds things; safe to run again.
//
//   AWS_PROFILE=AdministratorAccess-770324276704 node scripts/aws/add-translation-table.js
const { DsqlSigner } = require('@aws-sdk/dsql-signer')
const { Client } = require('pg')

const HOST = process.env.DSQL_HOST ?? '2nuhddmmzudvhgj2wsbw5k52ze.dsql.eu-central-1.on.aws'
const REGION = process.env.DSQL_REGION ?? 'eu-central-1'
const APP_USER = 'misbah_app'
const TRANSLATOR_ROLE_ARN = 'arn:aws:iam::770324276704:role/misbah-translator'

async function main() {
  const signer = new DsqlSigner({ hostname: HOST, region: REGION })
  const pg = new Client({ host: HOST, port: 5432, database: 'postgres', user: 'admin', password: await signer.getDbConnectAdminAuthToken(), ssl: { rejectUnauthorized: true } })
  await pg.connect()

  const exists = (await pg.query(`SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'Translation'`)).rowCount > 0
  if (!exists) {
    console.log('Creating table "Translation"...')
    await pg.query(`CREATE SEQUENCE IF NOT EXISTS "Translation_id_seq" START WITH 1 CACHE 1`)
    await pg.query(`
      CREATE TABLE "Translation" (
        "id"         INTEGER NOT NULL DEFAULT nextval('"Translation_id_seq"'),
        "entity"     TEXT NOT NULL,
        "entityId"   INTEGER NOT NULL,
        "locale"     TEXT NOT NULL,
        "fields"     TEXT NOT NULL,
        "sourceHash" TEXT NOT NULL,
        "status"     TEXT NOT NULL DEFAULT 'done',
        "manual"     BOOLEAN NOT NULL DEFAULT false,
        "model"      TEXT,
        "error"      TEXT,
        "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt"  TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Translation_pkey" PRIMARY KEY ("id")
      )`)
  } else {
    console.log('Table "Translation" already exists.')
  }

  // Indexes are built asynchronously in DSQL; wait for each one
  const indexes = (await pg.query(`SELECT indexname FROM pg_indexes WHERE tablename = 'Translation'`)).rows.map(r => r.indexname)
  for (const [name, sql] of [
    ['Translation_entity_entityId_locale_key', `CREATE UNIQUE INDEX ASYNC "Translation_entity_entityId_locale_key" ON "Translation"("entity", "entityId", "locale")`],
    ['Translation_entity_locale_idx', `CREATE INDEX ASYNC "Translation_entity_locale_idx" ON "Translation"("entity", "locale")`],
  ]) {
    if (indexes.includes(name)) continue
    console.log(`Creating index ${name}...`)
    const res = await pg.query(sql)
    const job = res.rows?.[0]?.job_id
    if (job) await pg.query('CALL sys.wait_for_job($1)', [job])
  }

  // The website (Amplify) and the translator worker both use the misbah_app role
  await pg.query(`GRANT SELECT, INSERT, UPDATE, DELETE ON "Translation" TO ${APP_USER}`)
  await pg.query(`GRANT USAGE ON SEQUENCE "Translation_id_seq" TO ${APP_USER}`)
  await pg.query(`AWS IAM GRANT ${APP_USER} TO '${TRANSLATOR_ROLE_ARN}'`).catch(e => { if (!/already/i.test(e.message)) throw e })

  const n = (await pg.query(`SELECT COUNT(*) AS n FROM "Translation"`)).rows[0].n
  console.log(`Done. "Translation" has ${n} rows; ${APP_USER} can use it; the translator role is mapped to ${APP_USER}.`)
  await pg.end()
}

main().catch(e => { console.error(e); process.exit(1) })
