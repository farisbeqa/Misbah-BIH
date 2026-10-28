import { getIronSession, sealData, unsealData, SessionOptions } from 'iron-session'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import { randomBytes, pbkdf2Sync } from 'crypto'
import { prisma } from '@/lib/db'

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

/**
 * The logged-in user: Bearer token from the mobile app, otherwise the web
 * session cookie. Tokens and cookies outlive deleted accounts, so the user is
 * always looked up — a deleted or banned user is treated as logged out.
 */
export async function getRequestUser(request: NextRequest): Promise<RequestUser | null> {
  let userId: number | undefined
  const auth = request.headers.get('authorization')
  if (auth?.startsWith('Bearer ')) {
    try {
      const data = await unsealData<Partial<RequestUser>>(auth.slice(7).trim(), {
        password: userSessionOptions.password,
        ttl: MOBILE_TOKEN_TTL,
      })
      userId = data.userId
    } catch {
      return null
    }
  } else {
    const session = await getIronSession<UserSessionData>(request, NextResponse.next(), userSessionOptions)
    if (session.isLoggedIn) userId = session.userId
  }
  if (!userId) return null

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, username: true } })
  return user ? { userId: user.id, username: user.username } : null
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

/**
 * Deletes a user with their likes and comments. Done explicitly in one
 * transaction instead of relying on SQLite foreign-key cascades.
 */
export async function deleteUserCompletely(userId: number) {
  const comments = await prisma.comment.findMany({ where: { userId }, select: { id: true } })
  await prisma.$transaction([
    prisma.commentReport.deleteMany({ where: { commentId: { in: comments.map(c => c.id) } } }),
    prisma.like.deleteMany({ where: { userId } }),
    prisma.comment.deleteMany({ where: { userId } }),
    prisma.user.deleteMany({ where: { id: userId } }),
  ])
}
