import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { userSessionOptions, UserSessionData } from '@/lib/userAuth'

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true })
  const session = await getIronSession<UserSessionData>(request, response, userSessionOptions)
  session.destroy()
  return response
}
