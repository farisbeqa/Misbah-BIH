require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@libsql/client')

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

async function main() {
  console.log('Creating Prica table...')
  await client.execute(`
    CREATE TABLE IF NOT EXISTS "Prica" (
      "id"        INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "title"     TEXT    NOT NULL,
      "content"   TEXT    NOT NULL,
      "author"    TEXT,
      "imageUrl"  TEXT,
      "published" INTEGER NOT NULL DEFAULT 1,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)
  console.log('Done.')
  process.exit(0)
}

main().catch(e => { console.error(e); process.exit(1) })
