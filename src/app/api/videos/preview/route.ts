import { NextRequest, NextResponse } from 'next/server'
import { parseVideoUrl, fetchYouTubeOEmbed, fetchTikTokOEmbed } from '@/lib/videoUtils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url } = body

    if (!url) {
      return NextResponse.json({ error: 'URL je obavezan' }, { status: 400 })
    }

    const videoInfo = parseVideoUrl(url)

    let title = ''
    let thumbnailUrl = videoInfo.thumbnailUrl

    if (videoInfo.platform === 'youtube') {
      const oembed = await fetchYouTubeOEmbed(url)
      if (oembed) {
        title = oembed.title || ''
        thumbnailUrl = oembed.thumbnailUrl || thumbnailUrl
      }
    } else if (videoInfo.platform === 'tiktok') {
      const oembed = await fetchTikTokOEmbed(url)
      if (oembed) {
        title = oembed.title || ''
        thumbnailUrl = oembed.thumbnailUrl || thumbnailUrl
      }
    }

    return NextResponse.json({
      platform: videoInfo.platform,
      embedUrl: videoInfo.embedUrl,
      thumbnailUrl,
      title,
      isShortForm: videoInfo.isShortForm,
      videoId: videoInfo.videoId,
    })
  } catch {
    return NextResponse.json({ error: 'Greška pri preuzimanju podataka' }, { status: 500 })
  }
}
