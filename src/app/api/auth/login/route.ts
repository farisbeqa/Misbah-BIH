import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { sessionOptions, SessionData } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { verifyPassword } from '@/lib/userAuth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json({ error: 'Korisničko ime i lozinka su obavezni' }, { status: 400 })
    }

    const adminUser = await prisma.adminUser.findUnique({ where: { username } })

    if (!adminUser || !verifyPassword(password, adminUser.passwordHash)) {
      return NextResponse.json({ error: 'Pogrešno korisničko ime ili lozinka' }, { status: 401 })
    }

    const response = NextResponse.json({ success: true })
    const session = await getIronSession<SessionData>(request, response, sessionOptions)
    session.isLoggedIn = true
    session.username = adminUser.username
    session.fullName = adminUser.fullName ?? undefined
    session.isSuperAdmin = adminUser.isSuperAdmin
    await session.save()

    return response
  } catch {
    return NextResponse.json({ error: 'Greška servera' }, { status: 500 })
  }
}
