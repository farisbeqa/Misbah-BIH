// Adds videoUrl to Activity table + creates MektebPost table on Turso
// Run: node prisma/add-activity-video-mekteb.js
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
  console.log('Adding videoUrl column to Activity...')
  try {
    await turso.execute(`ALTER TABLE "Activity" ADD COLUMN "videoUrl" TEXT`)
    console.log('videoUrl column added.')
  } catch (e) {
    if (String(e).includes('duplicate column')) console.log('videoUrl column already exists.')
    else throw e
  }

  console.log('Creating MektebPost table...')
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS "MektebPost" (
      "id"        INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "title"     TEXT NOT NULL,
      "content"   TEXT NOT NULL,
      "author"    TEXT,
      "imageUrl"  TEXT,
      "category"  TEXT NOT NULL DEFAULT 'opste',
      "published" INTEGER NOT NULL DEFAULT 1,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)
  console.log('MektebPost table created.')
  turso.close()
}

main().catch(e => { console.error(e); process.exit(1) })
