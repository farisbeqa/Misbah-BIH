require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@libsql/client')

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

async function main() {
  await client.execute(`ALTER TABLE "DuaText" ADD COLUMN "category" TEXT NOT NULL DEFAULT 'opste'`)
  console.log('Done: added category to DuaText')
}

main().catch(console.error)
