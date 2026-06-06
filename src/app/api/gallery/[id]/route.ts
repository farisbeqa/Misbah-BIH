import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const image = await prisma.galleryImage.findUnique({ where: { id: parseInt(params.id) } })
    if (!image) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(image)
  } catch { return NextResponse.json({ error: 'Greška' }, { status: 500 }) }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAuth()
  if (!session) return NextResponse.json({ error: 'Nije autorizovano' }, { status: 401 })
  try {
    const { title } = await req.json()
    const image = await prisma.galleryImage.update({
      where: { id: parseInt(params.id) },
      data: { title: title?.trim() || null },
    })
    return NextResponse.json(image)
  } catch { return NextResponse.json({ error: 'Greška' }, { status: 500 }) }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAuth()
  if (!session) return NextResponse.json({ error: 'Nije autorizovano' }, { status: 401 })
  try {
    await prisma.galleryImage.delete({ where: { id: parseInt(params.id) } })
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: 'Greška' }, { status: 500 }) }
}
