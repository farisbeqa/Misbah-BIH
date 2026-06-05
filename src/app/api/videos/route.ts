import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { parseVideoUrl } from '@/lib/videoUtils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const platform    = searchParams.get('platform')
    const category    = searchParams.get('category')
    const topic       = searchParams.get('topic')
    const isShortFormParam = searchParams.get('isShortForm')
    const limit       = parseInt(searchParams.get('limit') || '200')

    const videos = await prisma.video.findMany({
      where: {
        published: true,
        ...(platform && platform !== 'all' ? { platform } : {}),
        ...(category && category !== 'all' ? { category } : {}),
        ...(topic && topic !== 'all' ? { topic } : {}),
        ...(isShortFormParam !== null ? { isShortForm: isShortFormParam === 'true' } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return NextResponse.json(videos)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Greška pri učitavanju videa' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth()
    if (!session) return NextResponse.json({ error: 'Nije autorizovano' }, { status: 401 })

    const body = await request.json()
    const { title, description, author, url, category, topic } = body

    if (!url) return NextResponse.json({ error: 'URL je obavezan' }, { status: 400 })

    const videoInfo = parseVideoUrl(url)
    if (videoInfo.platform === 'unknown')
      return NextResponse.json({ error: 'Nepodržana platforma. Koristite YouTube, TikTok ili Facebook.' }, { status: 400 })

    const validCategories = ['predavanja', 'kuran', 'podcast', 'ilahije', 'zikrovi']
    const resolvedCategory = validCategories.includes(category) ? category : 'predavanja'

    const video = await prisma.video.create({
      data: {
        title: title || 'Bez naslova',
        description: description || null,
        author: author?.trim() || session.fullName || session.username,
        url,
        platform: videoInfo.platform,
        embedUrl: videoInfo.embedUrl,
        thumbnailUrl: videoInfo.thumbnailUrl,
        isShortForm: videoInfo.isShortForm,
        category: resolvedCategory,
        topic: topic || null,
        published: true,
      },
    })

    return NextResponse.json(video, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Greška pri kreiranju videa' }, { status: 500 })
  }
}
