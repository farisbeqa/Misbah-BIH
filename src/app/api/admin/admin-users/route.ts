import { NextRequest, NextResponse } from 'next/server'
import { requireSuperAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { hashPassword } from '@/lib/userAuth'

export async function GET() {
  const session = await requireSuperAdmin()
  if (!session) return NextResponse.json({ error: 'Nije autorizovano' }, { status: 403 })

  const admins = await prisma.adminUser.findMany({
    select: { id: true, username: true, fullName: true, isSuperAdmin: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json(admins)
}

export async function POST(request: NextRequest) {
  const session = await requireSuperAdmin()
  if (!session) return NextResponse.json({ error: 'Nije autorizovano' }, { status: 403 })

  try {
    const { username, password, fullName } = await request.json()

    if (!username?.trim() || !password?.trim())
      return NextResponse.json({ error: 'Korisničko ime i lozinka su obavezni' }, { status: 400 })
    if (username.trim().length < 3 || username.trim().length > 32)
      return NextResponse.json({ error: 'Korisničko ime mora biti između 3 i 32 karaktera' }, { status: 400 })
    if (password.length < 6)
      return NextResponse.json({ error: 'Lozinka mora imati najmanje 6 karaktera' }, { status: 400 })

    const existing = await prisma.adminUser.findUnique({ where: { username: username.trim() } })
    if (existing)
      return NextResponse.json({ error: 'Korisničko ime je već zauzeto' }, { status: 409 })

    const admin = await prisma.adminUser.create({
      data: {
        username: username.trim(),
        passwordHash: hashPassword(password),
        fullName: fullName?.trim() || null,
        isSuperAdmin: false,
      },
      select: { id: true, username: true, fullName: true, isSuperAdmin: true, createdAt: true },
    })

    return NextResponse.json(admin, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Greška servera' }, { status: 500 })
  }
}
