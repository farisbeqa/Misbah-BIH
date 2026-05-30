import { NextRequest, NextResponse } from 'next/server'
import { requireSuperAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireSuperAdmin()
  if (!session) return NextResponse.json({ error: 'Nije autorizovano' }, { status: 403 })

  const id = parseInt(params.id)

  const target = await prisma.adminUser.findUnique({ where: { id } })
  if (!target) return NextResponse.json({ error: 'Admin nije pronađen' }, { status: 404 })

  if (target.isSuperAdmin)
    return NextResponse.json({ error: 'Ne možete obrisati super-admin korisnika' }, { status: 400 })

  await prisma.adminUser.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
