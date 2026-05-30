import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { prisma } from '@/lib/db'
import { userSessionOptions, UserSessionData } from '@/lib/userAuth'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const blogPostId = parseInt(params.id)
  const res = NextResponse.next()
  const session = await getIronSession<UserSessionData>(request, res, userSessionOptions)

  const count = await prisma.like.count({ where: { blogPostId } })
  const liked = session.userId
    ? !!(await prisma.like.findUnique({ where: { userId_blogPostId: { userId: session.userId, blogPostId } } }))
    : false

  return NextResponse.json({ count, liked })
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const blogPostId = parseInt(params.id)
  const res = NextResponse.next()
  const session = await getIronSession<UserSessionData>(request, res, userSessionOptions)

  if (!session.isLoggedIn || !session.userId) {
    return NextResponse.json({ error: 'Morate biti prijavljeni' }, { status: 401 })
  }

  const userId = session.userId
  const existing = await prisma.like.findUnique({
    where: { userId_blogPostId: { userId, blogPostId } },
  })

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } })
  } else {
    await prisma.like.create({ data: { userId, blogPostId } })
  }

  const count = await prisma.like.count({ where: { blogPostId } })
  return NextResponse.json({ count, liked: !existing })
}
