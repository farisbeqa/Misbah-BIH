import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getRequestUser } from '@/lib/userAuth'
import { containsProfanity, PROFANITY_ERROR } from '@/lib/moderation'

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
  const user = await getRequestUser(request)

  if (!user) {
    return NextResponse.json({ error: 'Morate biti prijavljeni' }, { status: 401 })
  }

  const { content } = await request.json()
  if (!content?.trim()) {
    return NextResponse.json({ error: 'Komentar ne može biti prazan' }, { status: 400 })
  }
  if (content.length > 1000) {
    return NextResponse.json({ error: 'Komentar je predugačak (maks. 1000 karaktera)' }, { status: 400 })
  }
  if (containsProfanity(content)) {
    return NextResponse.json({ error: PROFANITY_ERROR }, { status: 400 })
  }

  const comment = await prisma.comment.create({
    data: { userId: user.userId, blogPostId, content: content.trim() },
    include: { user: { select: { username: true } } },
  })

  return NextResponse.json(comment, { status: 201 })
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const blogPostId = parseInt(params.id)
  const user = await getRequestUser(request)
  if (!user) return NextResponse.json({ error: 'Nije autorizovano' }, { status: 401 })

  const { commentId } = await request.json()
  const comment = await prisma.comment.findUnique({ where: { id: commentId } })
  if (!comment || comment.userId !== user.userId || comment.blogPostId !== blogPostId) {
    return NextResponse.json({ error: 'Nije pronađeno' }, { status: 404 })
  }

  await prisma.comment.delete({ where: { id: commentId } })
  return NextResponse.json({ success: true })
}
