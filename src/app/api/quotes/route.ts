import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const quotes = await prisma.quote.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(quotes)
  } catch { return NextResponse.json({ error: 'Greška' }, { status: 500 }) }
}

export async function POST(request: NextRequest) {
  const session = await requireAuth()
  if (!session) return NextResponse.json({ error: 'Nije autorizovano' }, { status: 401 })
  try {
    const { type, text, source } = await request.json()
    if (!text?.trim()) return NextResponse.json({ error: 'Tekst je obavezan' }, { status: 400 })
    const quote = await prisma.quote.create({
      data: { type: type || 'izreka', text: text.trim(), source: source?.trim() || null },
    })
    return NextResponse.json(quote, { status: 201 })
  } catch { return NextResponse.json({ error: 'Greška servera' }, { status: 500 }) }
}
