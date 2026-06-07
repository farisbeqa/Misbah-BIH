// Adds ZikrText table to Turso
// Run: node prisma/add-zikr-text.js
'use strict'

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@libsql/client')

const TURSO_URL   = process.env.TURSO_DATABASE_URL
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN

if (!TURSO_URL || !TURSO_TOKEN) {
  console.error('Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN env vars')
  process.exit(1)
}

const turso = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN })

async function main() {
  console.log('Adding ZikrText table to Turso...')
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS "ZikrText" (
      "id"           INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "title"        TEXT NOT NULL,
      "content"      TEXT,
      "author"       TEXT,
      "audioUrl"     TEXT,
      "thumbnailUrl" TEXT,
      "published"    INTEGER NOT NULL DEFAULT 1,
      "createdAt"    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt"    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)
  console.log('ZikrText table created successfully.')
  turso.close()
}

main().catch(e => { console.error(e); process.exit(1) })
