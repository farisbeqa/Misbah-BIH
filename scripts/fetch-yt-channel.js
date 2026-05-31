// Fetches all videos from a YouTube channel via InnerTube API
const https = require('https')

const CHANNEL_ID = 'UCnILeQtxHgNzSzDRzpwOakg'

function post(url, body, headers) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body)
    const opts = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        ...headers,
      },
    }
    const req = https.request(url, opts, (res) => {
      let buf = ''
      res.on('data', c => buf += c)
      res.on('end', () => resolve(buf))
    })
    req.on('error', reject)
    req.write(data)
    req.end()
  })
}

async function fetchVideos(params, label) {
  const body = {
    context: {
      client: {
        hl: 'en', gl: 'US',
        clientName: 'WEB',
        clientVersion: '2.20240101.00.00',
      },
    },
    browseId: CHANNEL_ID,
    params,
  }
  const raw = await post('https://www.youtube.com/youtubei/v1/browse', body)

  // Extract videoId+title pairs from the response
  const videoIdPattern = /"videoId":"([A-Za-z0-9_-]{11})"/g
  const titlePattern = /"text":"((?:[^"\\]|\\.)*)"/g

  const videoIds = []
  let m
  while ((m = videoIdPattern.exec(raw)) !== null) videoIds.push(m[1])
  const unique = [...new Set(videoIds)]

  // Extract all text values and try to pair with videoIds
  const allTexts = []
  while ((m = titlePattern.exec(raw)) !== null) allTexts.push(m[1])

  console.log(`${label}: found ${unique.length} unique video IDs`)
  return unique
}

async function main() {
  // params for Videos tab
  const videoParams = 'EgZ2aWRlb3PyBgQKAjoA'
  // params for Shorts tab
  const shortsParams = 'EgZzaG9ydHPyBgUKA5oBAA=='

  const videoIds = await fetchVideos(videoParams, 'Videos')
  const shortIds = await fetchVideos(shortsParams, 'Shorts')

  const allIds = [...new Set([...videoIds, ...shortIds])]
  console.log('\nAll unique IDs:', allIds.length)
  console.log(JSON.stringify(allIds))
}

main().catch(console.error)
