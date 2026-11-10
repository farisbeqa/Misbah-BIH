// Copies media files referenced in the production Turso database from
// Cloudflare R2 (and the old phototourl host) into the S3 media bucket, keeping
// the same keys. Files that are already in S3 are skipped, so it can be re-run
// right before the final database copy (migrate-from-turso.js).
//
//   AWS_PROFILE=AdministratorAccess-770324276704 node scripts/aws/copy-media-from-r2.js
require('dotenv').config({ path: '.env.local', quiet: true })
const { createClient } = require('@libsql/client')
const { S3Client, HeadObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3')

const BUCKET = 'misbah-edu-media-770324276704'
const RE = /https:\/\/(pub-5a2e25aa30fa42b992c300ed064005dc\.r2\.dev|cdn\.phototourl\.com)\/[^\s"'<>)\]]+/g

/** Same key layout as the URL rewrite in migrate-from-turso.js */
function keyFor(u) {
  const url = new URL(u)
  const path = decodeURIComponent(url.pathname.replace(/^\//, ''))
  return url.hostname.endsWith('r2.dev') ? path : `external/phototourl/${path}`
}

async function main() {
  const turso = createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN })
  const s3 = new S3Client({ region: 'eu-central-1' })

  const tables = (await turso.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma%'")).rows.map(r => r.name)
  const urls = new Set()
  for (const t of tables) {
    for (const row of (await turso.execute(`SELECT * FROM "${t}"`)).rows) {
      for (const v of Object.values(row)) if (typeof v === 'string') for (const m of v.match(RE) ?? []) urls.add(m)
    }
  }

  let copied = 0, present = 0
  const missing = []
  for (const u of urls) {
    const Key = keyFor(u)
    try {
      await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key }))
      present++
      continue
    } catch {}
    const res = await fetch(u)
    if (!res.ok) { missing.push(`${res.status} ${u}`); continue }
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET, Key, Body: Buffer.from(await res.arrayBuffer()),
      ContentType: res.headers.get('content-type') ?? undefined,
    }))
    copied++
    console.log('copied', Key)
  }
  console.log(`${urls.size} files referenced · ${present} already in S3 · ${copied} copied · ${missing.length} unreachable`)
  for (const m of missing) console.log('  unreachable:', m)
}

main().catch(e => { console.error(e); process.exit(1) })
