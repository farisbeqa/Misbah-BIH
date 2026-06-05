import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const activities = await prisma.activity.findMany({
      where: { published: true },
      orderBy: { date: 'desc' },
    })
    return NextResponse.json(activities)
  } catch { return NextResponse.json({ error: 'Greška' }, { status: 500 }) }
}

export async function POST(request: NextRequest) {
  const session = await requireAuth()
  if (!session) return NextResponse.json({ error: 'Nije autorizovano' }, { status: 401 })

  try {
    const { title, content, imageUrl, date, tag } = await request.json()
    if (!title?.trim() || !content?.trim())
      return NextResponse.json({ error: 'Naslov i sadržaj su obavezni' }, { status: 400 })

    const activity = await prisma.activity.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        imageUrl: imageUrl?.trim() || null,
        date: date ? new Date(date) : new Date(),
        tag: tag || 'aktivnosti',
        published: true,
      },
    })
    return NextResponse.json(activity, { status: 201 })
  } catch { return NextResponse.json({ error: 'Greška servera' }, { status: 500 }) }
}
