import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  const item = await prisma.ilahijaText.findUnique({ where: { id } })
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(item)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await requireAuth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = parseInt(params.id)
  const { title, content, author, audioUrl, published } = await req.json()
  if (!title?.trim() || !content?.trim()) {
    return NextResponse.json({ error: 'Naslov i tekst su obavezni' }, { status: 400 })
  }

  const item = await prisma.ilahijaText.update({
    where: { id },
    data: { title: title.trim(), content: content.trim(), author: author?.trim() || null, audioUrl: audioUrl?.trim() || null, published: published ?? true },
  })
  revalidatePath('/ilahije/tekstovi')
  return NextResponse.json(item)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await requireAuth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = parseInt(params.id)
  await prisma.ilahijaText.delete({ where: { id } })
  revalidatePath('/ilahije/tekstovi')
  return NextResponse.json({ ok: true })
}
