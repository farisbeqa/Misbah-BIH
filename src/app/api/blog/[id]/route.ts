import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
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
    const { title, content, author, imageUrl, published } = body

    const post = await prisma.blogPost.update({
      where: { id: parseInt(params.id) },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(author !== undefined && { author: author || null }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(published !== undefined && { published }),
      },
    })

    revalidatePath('/blog')
    revalidatePath('/')

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

    revalidatePath('/blog')
    revalidatePath('/')

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Greška pri brisanju' }, { status: 500 })
  }
}
