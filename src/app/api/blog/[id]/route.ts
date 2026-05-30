import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { id: parseInt(params.id) },
    })

    if (!post || !post.published) {
      return NextResponse.json({ error: 'Post nije pronađen' }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch {
    return NextResponse.json({ error: 'Greška servera' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth()
    if (!session) {
      return NextResponse.json({ error: 'Nije autorizovano' }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, imageUrl, published } = body

    const post = await prisma.blogPost.update({
      where: { id: parseInt(params.id) },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(published !== undefined && { published }),
      },
    })

    return NextResponse.json(post)
  } catch {
    return NextResponse.json({ error: 'Greška pri ažuriranju' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth()
    if (!session) {
      return NextResponse.json({ error: 'Nije autorizovano' }, { status: 401 })
    }

    await prisma.blogPost.delete({
      where: { id: parseInt(params.id) },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Greška pri brisanju' }, { status: 500 })
  }
}
