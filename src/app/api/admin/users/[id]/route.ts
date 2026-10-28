import { NextResponse } from 'next/server'
import { deleteUserCompletely } from '@/lib/userAuth'
import { requireAuth } from '@/lib/auth'

// Admin moderation: remove an abusive user together with their likes and comments
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!(await requireAuth())) return NextResponse.json({ error: 'Nije autorizovano' }, { status: 401 })
  const id = parseInt(params.id)
  if (!Number.isFinite(id)) return NextResponse.json({ error: 'Nije pronađeno' }, { status: 404 })
  await deleteUserCompletely(id)
  return NextResponse.json({ success: true })
}
