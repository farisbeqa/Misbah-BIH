import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { parseVideoUrl } from '@/lib/videoUtils'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const video = await prisma.video.findUnique({
      where: { id: parseInt(params.id) },
    })

    if (!video) {
      return NextResponse.json({ error: 'Video nije pronađen' }, { status: 404 })
    }

    return NextResponse.json(video)
  } catch {
    return NextResponse.json({ error: 'Greška servera' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth()
    if (!session) {
      return NextResponse.json({ error: 'Nije autorizovano' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, url, published, thumbnailUrl, category } = body

    const updateData: Record<string, unknown> = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (published !== undefined) updateData.published = published
    if (thumbnailUrl !== undefined) updateData.thumbnailUrl = thumbnailUrl || null
    const validCats = ['predavanja', 'kuran', 'podcast']
    if (category !== undefined && validCats.includes(category)) updateData.category = category

    if (url) {
      const videoInfo = parseVideoUrl(url)
      updateData.url = url
      updateData.platform = videoInfo.platform
      updateData.embedUrl = videoInfo.embedUrl
      updateData.thumbnailUrl = videoInfo.thumbnailUrl
      updateData.isShortForm = videoInfo.isShortForm
    }

    const video = await prisma.video.update({
      where: { id: parseInt(params.id) },
      data: updateData,
    })

    return NextResponse.json(video)
  } catch {
    return NextResponse.json({ error: 'Greška pri ažuriranju' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth()
    if (!session) {
      return NextResponse.json({ error: 'Nije autorizovano' }, { status: 401 })
    }

    await prisma.video.delete({
      where: { id: parseInt(params.id) },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Greška pri brisanju' }, { status: 500 })
  }
}
