// Migrates schema + data from local SQLite to Turso
// Run: node prisma/migrate-to-turso.js
'use strict'

const { createClient } = require('@libsql/client')
const { DatabaseSync } = require('node:sqlite')

const TURSO_URL   = process.env.TURSO_DATABASE_URL
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN

if (!TURSO_URL || !TURSO_TOKEN) {
  console.error('Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN env vars')
  process.exit(1)
}

const turso = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN })
const local = new DatabaseSync('./prisma/dev.db')

const SCHEMA = `
CREATE TABLE IF NOT EXISTS "Video" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "url" TEXT NOT NULL,
  "platform" TEXT NOT NULL,
  "embedUrl" TEXT NOT NULL,
  "thumbnailUrl" TEXT,
  "isShortForm" INTEGER NOT NULL DEFAULT 0,
  "published" INTEGER NOT NULL DEFAULT 1,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS "BlogPost" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "imageUrl" TEXT,
  "published" INTEGER NOT NULL DEFAULT 1,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS "User" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "username" TEXT NOT NULL UNIQUE,
  "passwordHash" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Like" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "userId" INTEGER NOT NULL,
  "videoId" INTEGER,
  "blogPostId" INTEGER,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("userId", "videoId"),
  UNIQUE("userId", "blogPostId"),
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
  FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE CASCADE,
  FOREIGN KEY ("blogPostId") REFERENCES "BlogPost"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "Comment" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "userId" INTEGER NOT NULL,
  "content" TEXT NOT NULL,
  "videoId" INTEGER,
  "blogPostId" INTEGER,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
  FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE CASCADE,
  FOREIGN KEY ("blogPostId") REFERENCES "BlogPost"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "AdminUser" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "username" TEXT NOT NULL UNIQUE,
  "passwordHash" TEXT NOT NULL,
  "isSuperAdmin" INTEGER NOT NULL DEFAULT 0,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`

async function main() {
  console.log('Creating schema on Turso...')
  for (const stmt of SCHEMA.split(';').map(s => s.trim()).filter(Boolean)) {
    await turso.execute(stmt)
  }
  console.log('Schema created.')

  // Helper to insert rows
  async function migrate(table, rows, buildStmt) {
    if (!rows.length) { console.log(`${table}: 0 rows`); return }
    for (const row of rows) {
      const { sql, args } = buildStmt(row)
      await turso.execute({ sql, args })
    }
    console.log(`${table}: ${rows.length} rows migrated`)
  }

  const videos = local.prepare('SELECT * FROM Video').all()
  await migrate('Video', videos, r => ({
    sql: `INSERT OR IGNORE INTO Video (id,title,description,url,platform,embedUrl,thumbnailUrl,isShortForm,published,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
    args: [r.id,r.title,r.description,r.url,r.platform,r.embedUrl,r.thumbnailUrl,r.isShortForm,r.published,r.createdAt,r.updatedAt]
  }))

  const blogs = local.prepare('SELECT * FROM BlogPost').all()
  await migrate('BlogPost', blogs, r => ({
    sql: `INSERT OR IGNORE INTO BlogPost (id,title,content,imageUrl,published,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?)`,
    args: [r.id,r.title,r.content,r.imageUrl,r.published,r.createdAt,r.updatedAt]
  }))

  const users = local.prepare('SELECT * FROM User').all()
  await migrate('User', users, r => ({
    sql: `INSERT OR IGNORE INTO User (id,username,passwordHash,createdAt) VALUES (?,?,?,?)`,
    args: [r.id,r.username,r.passwordHash,r.createdAt]
  }))

  const admins = local.prepare('SELECT * FROM AdminUser').all()
  await migrate('AdminUser', admins, r => ({
    sql: `INSERT OR IGNORE INTO AdminUser (id,username,passwordHash,isSuperAdmin,createdAt) VALUES (?,?,?,?,?)`,
    args: [r.id,r.username,r.passwordHash,r.isSuperAdmin,r.createdAt]
  }))

  console.log('\nMigration complete!')
  local.close()
  turso.close()
}

main().catch(e => { console.error(e); process.exit(1) })
