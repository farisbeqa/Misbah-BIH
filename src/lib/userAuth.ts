import { getIronSession, SessionOptions } from 'iron-session'
import { cookies } from 'next/headers'
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
