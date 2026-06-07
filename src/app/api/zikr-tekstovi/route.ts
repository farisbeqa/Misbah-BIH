import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const tekstovi = await prisma.zikrText.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(tekstovi)
  } catch { return NextResponse.json({ error: 'Greška' }, { status: 500 }) }
}

export async function POST(req: NextRequest) {
  const session = await requireAuth()
  if (!session) return NextResponse.json({ error: 'Nije autorizovano' }, { status: 401 })
  try {
    const { title, content, author, audioUrl, thumbnailUrl, published } = await req.json()
    if (!title?.trim()) return NextResponse.json({ error: 'Naslov je obavezan' }, { status: 400 })
    const tekst = await prisma.zikrText.create({
      data: {
        title: title.trim(),
        content: content?.trim() || null,
        author: author?.trim() || null,
        audioUrl: audioUrl?.trim() || null,
        thumbnailUrl: thumbnailUrl?.trim() || null,
        published: published ?? true,
      },
    })
    return NextResponse.json(tekst, { status: 201 })
  } catch { return NextResponse.json({ error: 'Greška pri snimanju' }, { status: 500 }) }
}
