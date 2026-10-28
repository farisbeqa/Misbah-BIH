import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { prisma } from '@/lib/db'
import { deleteUserCompletely, verifyPassword, userSessionOptions, UserSessionData } from '@/lib/userAuth'

// Permanently deletes a user account with its likes and comments.
// Used by the mobile app and the /obrisi-nalog page — both stores require it.
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    if (!username || !password) {
      return NextResponse.json({ error: 'Korisničko ime i lozinka su obavezni' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { username: String(username).trim() } })
    if (!user || !verifyPassword(String(password), user.passwordHash)) {
      return NextResponse.json({ error: 'Pogrešno korisničko ime ili lozinka' }, { status: 401 })
    }

    await deleteUserCompletely(user.id)

    const response = NextResponse.json({ success: true })
    const session = await getIronSession<UserSessionData>(request, response, userSessionOptions)
    if (session.userId === user.id) session.destroy()
    return response
  } catch {
    return NextResponse.json({ error: 'Greška servera' }, { status: 500 })
  }
}
