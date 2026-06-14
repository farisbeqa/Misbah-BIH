import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
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
  } catch (error) {
    console.error('[blog GET]', error)
    return NextResponse.json({ error: 'Greška pri učitavanju postova' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  console.log('[blog POST] received')
  try {
    const session = await requireAuth()
    console.log('[blog POST] session:', session ? `${session.username} isLoggedIn=${session.isLoggedIn}` : 'null')
    if (!session) {
      return NextResponse.json({ error: 'Nije autorizovano — prijavite se ponovo' }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, author, imageUrl, category } = body
    console.log('[blog POST] title:', title?.slice(0, 60), '| content len:', content?.length)

    if (!title || !content) {
      return NextResponse.json({ error: 'Naslov i sadržaj su obavezni' }, { status: 400 })
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        content,
        author: author?.trim() || null,
        imageUrl: imageUrl || null,
        category: category || 'savjeti',
        published: true,
      },
    })
    console.log('[blog POST] created post id:', post.id)

    revalidatePath('/blog')
    revalidatePath('/')

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('[blog POST] ERROR:', error)
    return NextResponse.json({ error: 'Greška pri kreiranju posta' }, { status: 500 })
  }
}
