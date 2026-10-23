import { getIronSession, sealData, unsealData, SessionOptions } from 'iron-session'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import { randomBytes, pbkdf2Sync } from 'crypto'

export interface UserSessionData {
  isLoggedIn: boolean
  userId?: number
  username?: string
}

export const userSessionOptions: SessionOptions = {
  password: (process.env.SESSION_SECRET || 'misbah-bih-super-secret-session-key-min-32-chars') + '_user',
  cookieName: 'misbah_user_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
}

export async function getUserSession() {
  const cookieStore = await cookies()
  return getIronSession<UserSessionData>(cookieStore, userSessionOptions)
}

// ── Mobile app auth ─────────────────────────────────────────────────────────
// The app can't rely on cookies, so login/register hand it a sealed token
// (same secret as the session cookie) that it sends as `Authorization: Bearer`.

const MOBILE_TOKEN_TTL = 60 * 60 * 24 * 90 // 90 days

export interface RequestUser {
  userId: number
  username: string
}

export function isMobileClient(request: NextRequest) {
  return request.headers.get('x-misbah-client') === 'mobile'
}

export function createMobileToken(user: { id: number; username: string }) {
  return sealData(
    { userId: user.id, username: user.username },
    { password: userSessionOptions.password, ttl: MOBILE_TOKEN_TTL },
  )
}

/** The logged-in user: Bearer token from the mobile app, otherwise the web session cookie. */
export async function getRequestUser(request: NextRequest): Promise<RequestUser | null> {
  const auth = request.headers.get('authorization')
  if (auth?.startsWith('Bearer ')) {
    try {
      const data = await unsealData<Partial<RequestUser>>(auth.slice(7).trim(), {
        password: userSessionOptions.password,
        ttl: MOBILE_TOKEN_TTL,
      })
      return data.userId && data.username ? { userId: data.userId, username: data.username } : null
    } catch {
      return null
    }
  }

  const session = await getIronSession<UserSessionData>(request, NextResponse.next(), userSessionOptions)
  return session.isLoggedIn && session.userId
    ? { userId: session.userId, username: session.username ?? '' }
    : null
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, hashedPassword: string): boolean {
  const [salt, hash] = hashedPassword.split(':')
  if (!salt || !hash) return false
  const verify = pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
  return verify === hash
}
