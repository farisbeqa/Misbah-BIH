require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@libsql/client')

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

async function main() {
  console.log('Creating CommentReport table...')
  await client.execute(`
    CREATE TABLE IF NOT EXISTS "CommentReport" (
      "id"        INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "commentId" INTEGER NOT NULL,
      "reason"    TEXT,
      "reporter"  TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)
  console.log('Done.')
  process.exit(0)
}

main().catch(e => { console.error(e); process.exit(1) })
