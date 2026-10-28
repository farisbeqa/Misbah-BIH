import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

// Admin moderation: remove any comment
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!(await requireAuth())) return NextResponse.json({ error: 'Nije autorizovano' }, { status: 401 })
  const id = parseInt(params.id)
  if (!Number.isFinite(id)) return NextResponse.json({ error: 'Nije pronađeno' }, { status: 404 })
  await prisma.$transaction([
    prisma.commentReport.deleteMany({ where: { commentId: id } }),
    prisma.comment.deleteMany({ where: { id } }),
  ])
  return NextResponse.json({ success: true })
}
