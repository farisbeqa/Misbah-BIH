import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const images = await prisma.galleryImage.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(images)
  } catch { return NextResponse.json({ error: 'Greška' }, { status: 500 }) }
}

export async function POST(request: NextRequest) {
  const session = await requireAuth()
  if (!session) return NextResponse.json({ error: 'Nije autorizovano' }, { status: 401 })
  try {
    const { title, imageUrl, description } = await request.json()
    if (!imageUrl?.trim()) return NextResponse.json({ error: 'URL slike je obavezan' }, { status: 400 })
    const image = await prisma.galleryImage.create({
      data: { title: title?.trim() || null, imageUrl: imageUrl.trim(), description: description?.trim() || null },
    })
    return NextResponse.json(image, { status: 201 })
  } catch { return NextResponse.json({ error: 'Greška servera' }, { status: 500 }) }
}
