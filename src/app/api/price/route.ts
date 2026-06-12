import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const price = await prisma.prica.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(price)
  } catch { return NextResponse.json({ error: 'Greška' }, { status: 500 }) }
}

export async function POST(req: NextRequest) {
  const session = await requireAuth()
  if (!session) return NextResponse.json({ error: 'Nije autorizovano' }, { status: 401 })
  try {
    const { title, content, author, imageUrl, published } = await req.json()
    if (!title?.trim() || !content?.trim())
      return NextResponse.json({ error: 'Naslov i sadržaj su obavezni' }, { status: 400 })
    const prica = await prisma.prica.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        author: author?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        published: published ?? true,
      },
    })
    return NextResponse.json(prica, { status: 201 })
  } catch { return NextResponse.json({ error: 'Greška pri snimanju' }, { status: 500 }) }
}
