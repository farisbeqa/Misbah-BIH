import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  const items = await prisma.duaText.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(items)
}

export async function POST(req: Request) {
  const session = await requireAuth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, content, author, audioUrl, published } = await req.json()
  if (!title?.trim() || !content?.trim()) {
    return NextResponse.json({ error: 'Naslov i tekst su obavezni' }, { status: 400 })
  }

  const item = await prisma.duaText.create({
    data: { title: title.trim(), content: content.trim(), author: author?.trim() || null, audioUrl: audioUrl?.trim() || null, published: published ?? true },
  })
  revalidatePath('/zikrovi/tekstovi')
  return NextResponse.json(item, { status: 201 })
}
