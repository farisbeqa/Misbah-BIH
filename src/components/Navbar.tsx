'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, Youtube, Instagram, Facebook, LogOut, LogIn, UserPlus } from 'lucide-react'
import AuthModal from './AuthModal'

const TikTokIcon = ({ size = 16 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: size, height: size }}>
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.25 8.25 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z" />
  </svg>
)

interface AuthUser { id: number; username: string }

const navLinks = [
  { href: '/', label: 'Početna' },
  { href: '/videos', label: 'Predavanja' },
  { href: '/blog', label: 'Blog' },
]

const socials = [
  { href: 'https://www.youtube.com/@misbah_ba', Icon: Youtube, label: 'YouTube' },
  { href: 'https://www.instagram.com/misbah_bih/', Icon: Instagram, label: 'Instagram' },
  { href: 'https://www.facebook.com/MisbahBIH/', Icon: Facebook, label: 'Facebook' },
  { href: 'https://www.tiktok.com/@misbah_ba', Icon: TikTokIcon, label: 'TikTok' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'login' | 'register'>('login')

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => { setUser(d.user); setAuthChecked(true) })
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/user-logout', { method: 'POST' })
    setUser(null); setMobileOpen(false)
  }

  const openModal = (mode: 'login' | 'register') => {
    setModalMode(mode); setModalOpen(true); setMobileOpen(false)
  }

  if (pathname.startsWith('/admin')) return null

  // Burgundy navbar — warm and premium, not black
  const navBg = '#5E1028'
  const navBorder = 'rgba(255,255,255,0.08)'

  return (
    <>
      <nav className="sticky top-0 z-40" style={{ background: navBg, borderBottom: `1px solid ${navBorder}` }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8"
          style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <Image src="/logo.jpg" alt="Misbah BIH" width={32} height={32} className="rounded-lg object-cover" />
            <span className="font-extrabold text-[15px] tracking-tight text-white group-hover:text-gold transition-colors">
              Misbah <span className="text-gold">BIH</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}
                className="text-sm font-medium transition-colors"
                style={{ color: pathname === link.href ? '#C8A96B' : 'rgba(255,255,255,0.65)' }}
                onMouseEnter={e => { if (pathname !== link.href) (e.target as HTMLElement).style.color = 'white' }}
                onMouseLeave={e => { if (pathname !== link.href) (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.65)' }}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right */}
          <div className="hidden md:flex items-center gap-5">
            <div className="flex items-center gap-3">
              {socials.map(s => (
                <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  className="transition-opacity hover:opacity-100 opacity-40" style={{ color: 'white' }}>
                  <s.Icon size={15} />
                </a>
              ))}
            </div>
            <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.15)' }} />
            {authChecked && (
              user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                      style={{ background: '#C8A96B', color: '#5E1028' }}>
                      {user.username[0].toUpperCase()}
                    </div>
                    <span className="font-medium">{user.username}</span>
                  </div>
                  <button onClick={handleLogout}
                    className="flex items-center gap-1 text-xs transition-opacity hover:opacity-100 opacity-50"
                    style={{ color: 'white' }}>
                    <LogOut size={12} /> Odjava
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button onClick={() => openModal('login')}
                    className="text-sm font-medium transition-opacity hover:opacity-100 opacity-70 flex items-center gap-1.5"
                    style={{ color: 'white' }}>
                    <LogIn size={13} /> Prijava
                  </button>
                  <button onClick={() => openModal('register')}
                    className="text-sm font-semibold px-4 py-2 transition-all flex items-center gap-1.5"
                    style={{ background: '#C8A96B', color: '#5E1028', borderRadius: 8 }}>
                    <UserPlus size={13} /> Registruj se
                  </button>
                </div>
              )
            )}
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-1 transition-opacity hover:opacity-100 opacity-70" style={{ color: 'white' }}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile */}
        {mobileOpen && (
          <div style={{ background: '#4A0D21', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="px-4 py-3 space-y-0.5">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                  className="block py-2.5 px-3 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    background: pathname === link.href ? '#C8A96B' : 'transparent',
                    color: pathname === link.href ? '#5E1028' : 'rgba(255,255,255,0.7)',
                  }}>
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-4 px-7 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              {socials.map(s => (
                <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="opacity-50 hover:opacity-100 transition-opacity" style={{ color: 'white' }}>
                  <s.Icon size={16} />
                </a>
              ))}
            </div>
            <div className="px-4 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              {user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: '#C8A96B', color: '#5E1028' }}>
                      {user.username[0].toUpperCase()}
                    </div>
                    {user.username}
                  </div>
                  <button onClick={handleLogout} className="text-sm opacity-60" style={{ color: 'white' }}>
                    Odjava
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => openModal('login')}
                    className="flex-1 py-2.5 text-sm font-medium rounded-lg"
                    style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}>
                    Prijava
                  </button>
                  <button onClick={() => openModal('register')}
                    className="flex-1 py-2.5 text-sm font-semibold rounded-lg"
                    style={{ background: '#C8A96B', color: '#5E1028' }}>
                    Registruj se
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      <AuthModal open={modalOpen} mode={modalMode}
        onClose={() => setModalOpen(false)}
        onSuccess={u => { setUser(u); setModalOpen(false) }}
        onSwitchMode={m => setModalMode(m)} />
    </>
  )
}
