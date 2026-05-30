import { getIronSession, SessionOptions } from 'iron-session'
import { cookies } from 'next/headers'

export interface SessionData {
  isLoggedIn: boolean
  username?: string
  isSuperAdmin?: boolean
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || 'misbah-bih-super-secret-session-key-min-32-chars',
  cookieName: 'misbah_admin_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
  },
}

export async function getSession() {
  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions)
  return session
}

export async function requireAuth() {
  const session = await getSession()
  if (!session.isLoggedIn) return null
  return session
}

export async function requireSuperAdmin() {
  const session = await getSession()
  if (!session.isLoggedIn || !session.isSuperAdmin) return null
  return session
}
