require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@libsql/client')

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

async function main() {
  console.log('Creating DailyPost table...')
  await client.execute(`
    CREATE TABLE IF NOT EXISTS "DailyPost" (
      "id"        INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "rubric"    TEXT    NOT NULL,
      "date"      TEXT    NOT NULL,
      "title"     TEXT    NOT NULL,
      "teaser"    TEXT,
      "body"      TEXT    NOT NULL DEFAULT '',
      "source"    TEXT,
      "videoUrl"  TEXT,
      "link"      TEXT,
      "quiz"      TEXT,
      "published" INTEGER NOT NULL DEFAULT 1,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)
  await client.execute(`CREATE INDEX IF NOT EXISTS "DailyPost_date_idx" ON "DailyPost"("date")`)
  console.log('Done.')
  process.exit(0)
}

main().catch(e => { console.error(e); process.exit(1) })
