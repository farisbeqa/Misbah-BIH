import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getIronSession } from 'iron-session'
import { sessionOptions, SessionData } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAdminPage = pathname.startsWith('/admin')
  const isLoginPage = pathname === '/admin'
  const isApiAuthRoute = pathname.startsWith('/api/auth')

  if (!isAdminPage || isLoginPage || isApiAuthRoute) {
    return NextResponse.next()
  }

  const response = NextResponse.next()
  const session = await getIronSession<SessionData>(request, response, sessionOptions)

  if (!session.isLoggedIn) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
