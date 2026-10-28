import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getRequestUser } from '@/lib/userAuth'

// "Prijavi komentar" from the app and the website; reviewed at /admin/komentari
export async function POST(request: NextRequest) {
  try {
    const { commentId, reason } = await request.json()
    const id = Number(commentId)
    if (!Number.isInteger(id)) return NextResponse.json({ error: 'Neispravan komentar' }, { status: 400 })

    const comment = await prisma.comment.findUnique({ where: { id }, select: { id: true } })
    if (!comment) return NextResponse.json({ error: 'Komentar nije pronađen' }, { status: 404 })

    const user = await getRequestUser(request)
    await prisma.commentReport.create({
      data: {
        commentId: id,
        reason: typeof reason === 'string' ? reason.trim().slice(0, 500) || null : null,
        reporter: user?.username ?? null,
      },
    })
    return NextResponse.json({ success: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Greška servera' }, { status: 500 })
  }
}
