require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@libsql/client')

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

async function main() {
  console.log('Adding category column to BlogPost...')
  await client.execute(`ALTER TABLE "BlogPost" ADD COLUMN "category" TEXT NOT NULL DEFAULT 'savjeti'`)
  console.log('Done.')
  process.exit(0)
}

main().catch(e => { console.error(e); process.exit(1) })
