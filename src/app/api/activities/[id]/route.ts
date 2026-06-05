import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const activity = await prisma.activity.findUnique({ where: { id: parseInt(params.id) } })
    if (!activity) return NextResponse.json({ error: 'Nije pronađeno' }, { status: 404 })
    return NextResponse.json(activity)
  } catch { return NextResponse.json({ error: 'Greška' }, { status: 500 }) }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAuth()
  if (!session) return NextResponse.json({ error: 'Nije autorizovano' }, { status: 401 })

  try {
    const { title, content, imageUrl, date, tag, published } = await request.json()
    const activity = await prisma.activity.update({
      where: { id: parseInt(params.id) },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(content !== undefined && { content: content.trim() }),
        ...(imageUrl !== undefined && { imageUrl: imageUrl?.trim() || null }),
        ...(date !== undefined && { date: new Date(date) }),
        ...(tag !== undefined && { tag }),
        ...(published !== undefined && { published }),
      },
    })
    return NextResponse.json(activity)
  } catch { return NextResponse.json({ error: 'Greška' }, { status: 500 }) }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAuth()
  if (!session) return NextResponse.json({ error: 'Nije autorizovano' }, { status: 401 })

  try {
    await prisma.activity.delete({ where: { id: parseInt(params.id) } })
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: 'Greška' }, { status: 500 }) }
}
