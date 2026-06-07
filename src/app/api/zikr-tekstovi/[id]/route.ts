import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const tekst = await prisma.zikrText.findUnique({ where: { id: parseInt(params.id) } })
    if (!tekst) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(tekst)
  } catch { return NextResponse.json({ error: 'Greška' }, { status: 500 }) }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAuth()
  if (!session) return NextResponse.json({ error: 'Nije autorizovano' }, { status: 401 })
  try {
    const { title, content, author, audioUrl, thumbnailUrl, published } = await req.json()
    if (!title?.trim()) return NextResponse.json({ error: 'Naslov je obavezan' }, { status: 400 })
    const tekst = await prisma.zikrText.update({
      where: { id: parseInt(params.id) },
      data: {
        title: title.trim(),
        content: content?.trim() || null,
        author: author?.trim() || null,
        audioUrl: audioUrl?.trim() || null,
        thumbnailUrl: thumbnailUrl?.trim() || null,
        published: published ?? true,
      },
    })
    return NextResponse.json(tekst)
  } catch { return NextResponse.json({ error: 'Greška pri snimanju' }, { status: 500 }) }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAuth()
  if (!session) return NextResponse.json({ error: 'Nije autorizovano' }, { status: 401 })
  try {
    await prisma.zikrText.delete({ where: { id: parseInt(params.id) } })
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: 'Greška' }, { status: 500 }) }
}
