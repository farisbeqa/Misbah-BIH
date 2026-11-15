import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getIronSession } from 'iron-session'
import { sessionOptions, SessionData } from '@/lib/auth'
import { DEFAULT_LOCALE, LOCALE_COOKIE, LOCALE_HEADER, PATH_HEADER, isLocale } from '@/i18n/config'
import { splitLocale } from '@/i18n/href'

async function adminGuard(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname === '/admin') return NextResponse.next()

  const response = NextResponse.next()
  const session = await getIronSession<SessionData>(request, response, sessionOptions)
  if (!session.isLoggedIn) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }
  return response
}

function noStore(res: NextResponse) {
  res.headers.set('Cache-Control', 'private, no-store')
  return res
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/admin' || pathname.startsWith('/admin/')) return adminGuard(request)
  // The app preview (/app) is a static export with its own language handling
  if (pathname === '/app' || pathname.startsWith('/app/')) return NextResponse.next()

  // /bs/... is the same page as the unprefixed address
  if (pathname === '/bs' || pathname.startsWith('/bs/')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.slice(3) || '/'
    return NextResponse.redirect(url, 308)
  }

  const headers = new Headers(request.headers)
  const { locale: prefixed, path } = splitLocale(pathname)

  if (prefixed) {
    // There is no translated admin, API or app preview
    if (/^\/(admin|api|app)(\/|$)/.test(path)) {
      const url = request.nextUrl.clone()
      url.pathname = path
      return NextResponse.redirect(url)
    }
    headers.set(LOCALE_HEADER, prefixed)
    headers.set(PATH_HEADER, path)
    const url = request.nextUrl.clone()
    url.pathname = path
    return NextResponse.rewrite(url, { request: { headers } })
  }

  // Unprefixed addresses are Bosnian, unless the visitor picked another
  // language in the menu earlier (remembered in a cookie)
  const chosen = request.cookies.get(LOCALE_COOKIE)?.value
  if (isLocale(chosen) && chosen !== DEFAULT_LOCALE && (request.method === 'GET' || request.method === 'HEAD')) {
    const url = request.nextUrl.clone()
    url.pathname = `/${chosen}${pathname === '/' ? '' : pathname}`
    return noStore(NextResponse.redirect(url, 307))
  }

  headers.set(LOCALE_HEADER, DEFAULT_LOCALE)
  headers.set(PATH_HEADER, pathname)
  return NextResponse.next({ request: { headers } })
}

export const config = {
  // Every page (and /admin); not the API, Next internals or files with an extension
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
