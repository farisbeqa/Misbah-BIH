import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '100')

    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return NextResponse.json(posts)
  } catch {
    return NextResponse.json({ error: 'Greška pri učitavanju postova' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth()
    if (!session) {
      return NextResponse.json({ error: 'Nije autorizovano' }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, author, imageUrl } = body

    if (!title || !content) {
      return NextResponse.json({ error: 'Naslov i sadržaj su obavezni' }, { status: 400 })
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        content,
        author: author?.trim() || session.username,
        imageUrl: imageUrl || null,
        published: true,
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Greška pri kreiranju posta' }, { status: 500 })
  }
}
