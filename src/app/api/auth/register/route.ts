import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { prisma } from '@/lib/db'
import { hashPassword, userSessionOptions, UserSessionData } from '@/lib/userAuth'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: 'Korisničko ime i lozinka su obavezni' }, { status: 400 })
    }
    if (username.length < 3 || username.length > 24) {
      return NextResponse.json({ error: 'Korisničko ime mora biti između 3 i 24 karaktera' }, { status: 400 })
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json({ error: 'Korisničko ime smije sadržavati samo slova, brojeve i _' }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Lozinka mora imati najmanje 6 karaktera' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { username } })
    if (existing) {
      return NextResponse.json({ error: 'Ovo korisničko ime je zauzeto' }, { status: 409 })
    }

    const user = await prisma.user.create({
      data: { username, passwordHash: hashPassword(password) },
    })

    const response = NextResponse.json({ success: true, username: user.username })
    const session = await getIronSession<UserSessionData>(request, response, userSessionOptions)
    session.isLoggedIn = true
    session.userId = user.id
    session.username = user.username
    await session.save()

    return response
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Greška servera' }, { status: 500 })
  }
}
