import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const prica = await prisma.prica.findUnique({ where: { id: parseInt(params.id) } })
    if (!prica) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(prica)
  } catch { return NextResponse.json({ error: 'Greška' }, { status: 500 }) }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAuth()
  if (!session) return NextResponse.json({ error: 'Nije autorizovano' }, { status: 401 })
  try {
    const { title, content, author, imageUrl, published } = await req.json()
    if (!title?.trim() || !content?.trim())
      return NextResponse.json({ error: 'Naslov i sadržaj su obavezni' }, { status: 400 })
    const prica = await prisma.prica.update({
      where: { id: parseInt(params.id) },
      data: {
        title: title.trim(),
        content: content.trim(),
        author: author?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        published: published ?? true,
      },
    })
    return NextResponse.json(prica)
  } catch { return NextResponse.json({ error: 'Greška pri snimanju' }, { status: 500 }) }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAuth()
  if (!session) return NextResponse.json({ error: 'Nije autorizovano' }, { status: 401 })
  try {
    await prisma.prica.delete({ where: { id: parseInt(params.id) } })
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: 'Greška' }, { status: 500 }) }
}
