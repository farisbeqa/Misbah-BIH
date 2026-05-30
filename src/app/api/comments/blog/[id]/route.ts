import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { prisma } from '@/lib/db'
import { userSessionOptions, UserSessionData } from '@/lib/userAuth'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const blogPostId = parseInt(params.id)
  const comments = await prisma.comment.findMany({
    where: { blogPostId },
    include: { user: { select: { username: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(comments)
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const blogPostId = parseInt(params.id)
  const res = NextResponse.next()
  const session = await getIronSession<UserSessionData>(request, res, userSessionOptions)

  if (!session.isLoggedIn || !session.userId) {
    return NextResponse.json({ error: 'Morate biti prijavljeni' }, { status: 401 })
  }

  const { content } = await request.json()
  if (!content?.trim()) {
    return NextResponse.json({ error: 'Komentar ne može biti prazan' }, { status: 400 })
  }
  if (content.length > 1000) {
    return NextResponse.json({ error: 'Komentar je predugačak (maks. 1000 karaktera)' }, { status: 400 })
  }

  const comment = await prisma.comment.create({
    data: { userId: session.userId, blogPostId, content: content.trim() },
    include: { user: { select: { username: true } } },
  })

  return NextResponse.json(comment, { status: 201 })
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const blogPostId = parseInt(params.id)
  const res = NextResponse.next()
  const session = await getIronSession<UserSessionData>(request, res, userSessionOptions)
  if (!session.userId) return NextResponse.json({ error: 'Nije autorizovano' }, { status: 401 })

  const { commentId } = await request.json()
  const comment = await prisma.comment.findUnique({ where: { id: commentId } })
  if (!comment || comment.userId !== session.userId || comment.blogPostId !== blogPostId) {
    return NextResponse.json({ error: 'Nije pronađeno' }, { status: 404 })
  }

  await prisma.comment.delete({ where: { id: commentId } })
  return NextResponse.json({ success: true })
}
