'use strict'
// Inserts all YouTube videos from the Misbah EDU channel into Turso
// Run: node scripts/seed-yt-videos.js

const { createClient } = require('@libsql/client')

const turso = createClient({
  url: 'libsql://misbah-bih-farisbeqa.aws-eu-west-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODAxNTU5MDAsImlkIjoiMDE5ZTc5OGYtMDgwMS03MGIxLThlZGUtM2M5MDVmYjlhNjFmIiwicmlkIjoiOWMyNGJiOGItMjUwZS00ZTkyLTlmY2MtNWRmNjgzZWIyMGViIn0.4ZPadtE3it_efJL5DXi5dZVSndxaa9mhsp6f8txiOO4Y3HeNgioHVGRKPzNL9AoysFsB_1QsPHMeD3-ceJPyDA',
})

// IDs from /videos page (regular, long-form)
const REGULAR_IDS = [
  'YdIpSUh-ILE','eWFV55OVSus','ZpCrmmhHw8I','US-slHJ_q1c','0TKnUvzFuOo',
  '95mMXOMuo64','YAXzsYlSCl0','59wSIca4L90','dIawwCls0tI','PyLxh8jqR7s',
  '5xRjsUwvfyM','4fBjh65pvBk','isOxd7b7jog','j51zmAYcMFY','255_UbVUHYM',
  '82EvbZdsa0M','EgZ-gmGBjM0','L49cl-Vl0mk','PH4Dr7L80I4','Tk8CvzlXVR0',
  'XMHmZvBPOfQ','cpFTGWB2R1A','dOSqIxoxxjU','dWVRdLHZzfM','fRfT1wW-ikA',
  'kSkZsLZKcuA','lFIpUiAHD5U','pZ0oRBFwyEU','rMtqTlKvd_A','y1WZhXIcanI',
  'Aelrqpzz8y0', // already in DB but handle gracefully
]

// IDs from /shorts page
const SHORTS_IDS = [
  '8MrxV4MBWt0', // already in DB
  '-D_pBOWNEBM','1VlCNKIA7f4','2BN_92waqOk','5LnHW--4ygc','5kuva4jd5dg',
  '6jJxXKeycu0','9Z9GdQPtWWU','Abg1s7d29xc','CShMXDViyy4','DFGOvieB_vc',
  'FxMY_M4gOGE','IKAggF9Getk','KmkF2xWOGUo','N8l-yAdzsas','NXtrQ7QIE8E',
  'PGil2J9L3eA','PgR001SLFfo','QQ7p9oIUopQ','QXudwQp1WVw','RQKSjPHV6cg',
  'SRSWJ_un4Cc','UBKWidNYXo0','UWnaFuha9FQ','UllAcJaXUCs','VXM894JTmek',
  'W8aVGZ4MjlU','XisA5Nx189I','_9rvzh2mka4','_yDeLeid9E4','_zFql47fKjY',
  'dqPnY_X-FNo','eGbLkPcS0IY','hcyDRkz5IL0','jKfQHxG_IYU','jW0zF0ZWbvY',
  'jYRPYcQUNg8','ksIO3mkxatU','lUJArZUp4jk','ltxj9D_lERg','mRIS8df4tvA',
  'nVuIi8w8-6E','oAQ0OaAkpgQ','qT1MLD5u6oY','v63opJym7lk','wKaz_YYfKro',
  'wbONTcVTiy0','yo45jQVW0ig',
]

async function getOEmbed(videoId) {
  try {
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    const r = await fetch(url)
    if (!r.ok) return null
    const d = await r.json()
    return { title: d.title, thumbnail: d.thumbnail_url }
  } catch { return null }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function main() {
  // Get existing video URLs
  const existing = new Set(
    (await turso.execute('SELECT url FROM Video')).rows.map(r => r.url)
  )
  console.log('Existing videos in DB:', existing.size)

  let added = 0, skipped = 0, failed = 0
  const now = new Date().toISOString()

  // Process regular videos
  for (const id of REGULAR_IDS) {
    const url = `https://www.youtube.com/watch?v=${id}`
    if (existing.has(url)) { process.stdout.write('.'); skipped++; continue }

    const oembed = await getOEmbed(id)
    if (!oembed) {
      console.log(`\nFAIL (no oembed): ${id}`)
      failed++
      continue
    }

    await turso.execute({
      sql: 'INSERT OR IGNORE INTO Video (title,description,url,platform,embedUrl,thumbnailUrl,isShortForm,published,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?)',
      args: [oembed.title, null, url, 'youtube', `https://www.youtube.com/embed/${id}`, oembed.thumbnail, 0, 1, now, now]
    })
    console.log(`\n+ ${oembed.title}`)
    added++
    await sleep(80) // small delay to avoid rate limit
  }

  // Process Shorts
  for (const id of SHORTS_IDS) {
    const url = `https://www.youtube.com/shorts/${id}`
    const watchUrl = `https://www.youtube.com/watch?v=${id}` // also check watch URL
    if (existing.has(url) || existing.has(watchUrl)) { process.stdout.write('.'); skipped++; continue }

    const oembed = await getOEmbed(id)
    if (!oembed) {
      console.log(`\nFAIL (no oembed): ${id}`)
      failed++
      continue
    }

    await turso.execute({
      sql: 'INSERT OR IGNORE INTO Video (title,description,url,platform,embedUrl,thumbnailUrl,isShortForm,published,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?)',
      args: [oembed.title, null, url, 'youtube', `https://www.youtube.com/embed/${id}`, oembed.thumbnail, 1, 1, now, now]
    })
    console.log(`\n+ [SHORT] ${oembed.title}`)
    added++
    await sleep(80)
  }

  const total = (await turso.execute('SELECT COUNT(*) as c FROM Video WHERE platform="youtube"')).rows[0].c
  console.log(`\n\nDone! Added: ${added} | Skipped: ${skipped} | Failed: ${failed}`)
  console.log(`Total YouTube videos in DB: ${total}`)
  turso.close()
}

main().catch(e => { console.error(e); process.exit(1) })
