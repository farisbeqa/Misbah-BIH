import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { readDailyInput, serializeDailyPost } from '@/lib/daily'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const post = await prisma.dailyPost.findUnique({ where: { id: parseInt(params.id) } })
    if (!post || (!post.published && !(await requireAuth()))) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(serializeDailyPost(post))
  } catch { return NextResponse.json({ error: 'Greška' }, { status: 500 }) }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAuth()
  if (!session) return NextResponse.json({ error: 'Nije autorizovano' }, { status: 401 })
  try {
    const input = readDailyInput(await req.json())
    if ('error' in input) return NextResponse.json({ error: input.error }, { status: 400 })
    const post = await prisma.dailyPost.update({ where: { id: parseInt(params.id) }, data: input.data })
    return NextResponse.json(post)
  } catch { return NextResponse.json({ error: 'Greška pri snimanju' }, { status: 500 }) }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAuth()
  if (!session) return NextResponse.json({ error: 'Nije autorizovano' }, { status: 401 })
  try {
    await prisma.dailyPost.delete({ where: { id: parseInt(params.id) } })
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: 'Greška' }, { status: 500 }) }
}
