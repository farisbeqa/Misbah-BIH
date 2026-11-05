import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { addDays, DATE_RE, readDailyInput, serializeDailyPost, todayKey } from '@/lib/daily'

export const dynamic = 'force-dynamic'

// GET ?from=YYYY-MM-DD&days=N → published posts in that window (the app
//     schedules its notifications from it, so upcoming days are included)
// GET → archive: published posts up to today, newest first
export async function GET(req: NextRequest) {
  try {
    const from = req.nextUrl.searchParams.get('from')
    if (from) {
      if (!DATE_RE.test(from)) return NextResponse.json({ error: 'Neispravan datum' }, { status: 400 })
      const days = Math.min(Math.max(parseInt(req.nextUrl.searchParams.get('days') ?? '7') || 7, 1), 31)
      if (from > addDays(todayKey(), 31)) return NextResponse.json([])
      const posts = await prisma.dailyPost.findMany({
        where: { published: true, date: { gte: from, lt: addDays(from, days) } },
        orderBy: [{ date: 'asc' }, { id: 'asc' }],
      })
      return NextResponse.json(posts.map(serializeDailyPost))
    }
    const posts = await prisma.dailyPost.findMany({
      where: { published: true, date: { lte: todayKey() } },
      orderBy: [{ date: 'desc' }, { id: 'desc' }],
      take: 120,
    })
    return NextResponse.json(posts.map(serializeDailyPost))
  } catch { return NextResponse.json({ error: 'Greška' }, { status: 500 }) }
}

export async function POST(req: NextRequest) {
  const session = await requireAuth()
  if (!session) return NextResponse.json({ error: 'Nije autorizovano' }, { status: 401 })
  try {
    const input = readDailyInput(await req.json())
    if ('error' in input) return NextResponse.json({ error: input.error }, { status: 400 })
    const post = await prisma.dailyPost.create({ data: input.data })
    return NextResponse.json(post, { status: 201 })
  } catch { return NextResponse.json({ error: 'Greška pri snimanju' }, { status: 500 }) }
}
