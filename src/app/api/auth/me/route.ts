import { NextRequest, NextResponse } from 'next/server'
import { getRequestUser } from '@/lib/userAuth'

export async function GET(request: NextRequest) {
  const user = await getRequestUser(request)
  if (!user) return NextResponse.json({ user: null })
  return NextResponse.json({ user: { id: user.userId, username: user.username } })
}
