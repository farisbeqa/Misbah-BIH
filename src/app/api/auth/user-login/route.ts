import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { prisma } from '@/lib/db'
import { verifyPassword, userSessionOptions, UserSessionData } from '@/lib/userAuth'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: 'Korisničko ime i lozinka su obavezni' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { username } })
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ error: 'Pogrešno korisničko ime ili lozinka' }, { status: 401 })
    }

    const response = NextResponse.json({ success: true, username: user.username })
    const session = await getIronSession<UserSessionData>(request, response, userSessionOptions)
    session.isLoggedIn = true
    session.userId = user.id
    session.username = user.username
    await session.save()

    return response
  } catch {
    return NextResponse.json({ error: 'Greška servera' }, { status: 500 })
  }
}
