import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { userSessionOptions, UserSessionData } from '@/lib/userAuth'

export async function GET(request: NextRequest) {
  const response = NextResponse.next()
  const session = await getIronSession<UserSessionData>(request, response, userSessionOptions)

  if (!session.isLoggedIn || !session.userId) {
    return NextResponse.json({ user: null })
  }

  return NextResponse.json({
    user: { id: session.userId, username: session.username },
  })
}
