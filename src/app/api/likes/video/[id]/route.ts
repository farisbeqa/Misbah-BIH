import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getRequestUser } from '@/lib/userAuth'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const videoId = parseInt(params.id)
  const user = await getRequestUser(request)

  const count = await prisma.like.count({ where: { videoId } })
  const liked = user
    ? !!(await prisma.like.findUnique({ where: { userId_videoId: { userId: user.userId, videoId } } }))
    : false

  return NextResponse.json({ count, liked })
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const videoId = parseInt(params.id)
  const user = await getRequestUser(request)

  if (!user) {
    return NextResponse.json({ error: 'Morate biti prijavljeni' }, { status: 401 })
  }

  const userId = user.userId
  const existing = await prisma.like.findUnique({
    where: { userId_videoId: { userId, videoId } },
  })

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } })
  } else {
    await prisma.like.create({ data: { userId, videoId } })
  }

  const count = await prisma.like.count({ where: { videoId } })
  return NextResponse.json({ count, liked: !existing })
}
