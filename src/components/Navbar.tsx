'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown, LogOut } from 'lucide-react'
import AuthModal from './AuthModal'

interface AuthUser { id: number; username: string }

// ─── Dropdown helper ─────────────────────────────────────────────────────────
// NOTE: Must be defined at module level (outside Navbar) so React never
// treats it as a new component type on re-renders, which would cause
// unmount/remount loops and broken refs on macOS browsers.

interface DropdownItem { href: string; label: string }

interface NavDropdownProps {
  open: boolean
  setOpen: (v: boolean | ((prev: boolean) => boolean)) => void
  dropRef: React.RefObject<HTMLDivElement>
  label: string
  isActive: boolean
  items: DropdownItem[]
  pathname: string
}

function NavDropdown({ open, setOpen, dropRef, label, isActive, items, pathname }: NavDropdownProps) {
  const activeColor   = '#8b1e3f'
  const inactiveColor = '#5a4f49'

  return (
    <div ref={dropRef} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-0.5 px-2 py-2 text-[14px] xl:text-[15px] whitespace-nowrap hover:text-[#8b1e3f] transition-colors"
        style={{ fontFamily: 'Manrope, sans-serif', color: isActive ? activeColor : inactiveColor, fontWeight: isActive ? 600 : 400 }}
      >
        {label}
        <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-lg border border-[#ede5dc] overflow-hidden z-50"
          style={{ minWidth: 190 }}>
          {items.map((item, i) => (
            <div key={item.href}>
              {i > 0 && <div className="border-t border-[#f0ebe4]" />}
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 text-sm hover:bg-[#faf7f2] transition-colors"
                style={{
                  color: pathname === item.href ? activeColor : inactiveColor,
                  fontWeight: pathname === item.href ? 600 : 400,
                }}
              >
                {item.label}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Hook ────────────────────────────────────────────────────────────────────

function useDropdown() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  return { open, setOpen, ref }
}

// ─── Nav data ────────────────────────────────────────────────────────────────

const PLAIN_LINKS_LEFT = [
  { href: '/kuran',    label: "Kur'an" },
  { href: '/zikrovi',  label: 'Zikrovi' },
  { href: '/ilahije',  label: 'Ilahije' },
  { href: '/podcasts', label: 'Podcasts' },
]

const PLAIN_LINKS_RIGHT = [
  { href: '/blog',     label: 'Blog' },
  { href: '/o-nama',   label: 'O Nama' },
  { href: '/donacije', label: 'Donacije' },
]

const MOBILE_LINKS = [
  { href: '/',                  label: 'Početna' },
  { href: '/predavanja/duga',   label: 'Duga predavanja' },
  { href: '/predavanja/kratka', label: 'Kratka predavanja' },
  { href: '/kuran',             label: "Kur'an" },
  { href: '/zikrovi',           label: 'Zikrovi' },
  { href: '/ilahije',           label: 'Ilahije' },
  { href: '/podcasts',          label: 'Podcasts' },
  { href: '/aktivnosti',        label: 'Aktivnosti' },
  { href: '/galerija',          label: 'Galerija' },
  { href: '/blog',              label: 'Blog' },
  { href: '/o-nama',            label: 'O Nama' },
  { href: '/donacije',          label: 'Donacije' },
]

// ─── Navbar ──────────────────────────────────────────────────────────────────

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser]             = useState<AuthUser | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [modalOpen, setModalOpen]   = useState(false)
  const [modalMode, setModalMode]   = useState<'login' | 'register'>('login')

  const pred      = useDropdown()
  const zajednica = useDropdown()

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

  const isPredavanja = pathname.startsWith('/predavanja') || pathname === '/videos'
  const isZajednica  = pathname.startsWith('/aktivnosti') || pathname.startsWith('/galerija')

  const ls = (active: boolean) => ({
    color:      active ? '#8b1e3f' : '#5a4f49',
    fontWeight: active ? 600 : 400,
  })

  return (
    <>
      {/* ── Desktop nav ──────────────────────────────────────────────── */}
      <nav className="bg-white w-full sticky top-0 z-40 border-b border-[#ede5dc] hidden lg:flex items-center justify-between px-5 xl:px-20 py-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <Image src="/logo.jpg" alt="Misbah EDU" width={48} height={48} className="rounded-lg object-cover" />
          <span className="font-bold text-[22px] xl:text-[26px] leading-none whitespace-nowrap"
            style={{ fontFamily: 'Manrope, sans-serif', color: '#8b1e3f' }}>
            Misbah <span style={{ color: '#c8a96b' }}>EDU</span>
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-0.5 xl:gap-1">

          <NavDropdown
            open={pred.open} setOpen={pred.setOpen} dropRef={pred.ref}
            label="Predavanja" isActive={isPredavanja} pathname={pathname}
            items={[
              { href: '/predavanja/duga',   label: 'Duga predavanja' },
              { href: '/predavanja/kratka', label: 'Kratka predavanja' },
            ]}
          />

          {PLAIN_LINKS_LEFT.map(link => (
            <Link key={link.href} href={link.href}
              className="px-2 py-2 text-[14px] xl:text-[15px] whitespace-nowrap hover:text-[#8b1e3f] transition-colors"
              style={{ fontFamily: 'Manrope, sans-serif', ...ls(pathname === link.href) }}>
              {link.label}
            </Link>
          ))}

          <NavDropdown
            open={zajednica.open} setOpen={zajednica.setOpen} dropRef={zajednica.ref}
            label="Zajednica" isActive={isZajednica} pathname={pathname}
            items={[
              { href: '/aktivnosti', label: 'Aktivnosti' },
              { href: '/galerija',   label: 'Galerija' },
            ]}
          />

          {PLAIN_LINKS_RIGHT.map(link => (
            <Link key={link.href} href={link.href}
              className="px-2 py-2 text-[14px] xl:text-[15px] whitespace-nowrap hover:text-[#8b1e3f] transition-colors"
              style={{ fontFamily: 'Manrope, sans-serif', ...ls(pathname === link.href) }}>
              {link.label}
            </Link>
          ))}

        </div>

        {/* Auth */}
        <div className="flex items-center gap-3 shrink-0">
          {authChecked && (
            user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm" style={{ color: '#5a4f49' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: '#8b1e3f' }}>
                    {user.username[0].toUpperCase()}
                  </div>
                  <span>{user.username}</span>
                </div>
                <button onClick={handleLogout}
                  className="flex items-center gap-1 text-sm transition-colors hover:text-[#8b1e3f]"
                  style={{ color: '#978a81' }}>
                  <LogOut size={13} /> Odjava
                </button>
              </div>
            ) : (
              <>
                <button onClick={() => openModal('register')}
                  className="bg-[#8b1e3f] text-white px-5 xl:px-7 py-2.5 text-[14px] xl:text-[15px] hover:opacity-90 transition-opacity"
                  style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Registruj se
                </button>
                <button onClick={() => openModal('login')}
                  className="border border-[#8b1e3f] text-[#8b1e3f] px-4 xl:px-6 py-2.5 text-[14px] xl:text-[15px] hover:bg-[#8b1e3f] hover:text-white transition-colors"
                  style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Prijava
                </button>
              </>
            )
          )}
        </div>
      </nav>

      {/* ── Mobile nav bar ───────────────────────────────────────────── */}
      <nav className="bg-white w-full sticky top-0 z-40 border-b border-[#ede5dc] lg:hidden flex items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/logo.jpg" alt="Misbah EDU" width={36} height={36} className="rounded-lg object-cover" />
          <span className="font-bold text-[20px] leading-none"
            style={{ fontFamily: 'Manrope, sans-serif', color: '#8b1e3f' }}>
            Misbah <span style={{ color: '#c8a96b' }}>EDU</span>
          </span>
        </Link>
        <button onClick={() => setMobileOpen(v => !v)} className="p-1" aria-label="Toggle menu">
          {mobileOpen
            ? <X size={22} style={{ color: '#8b1e3f' }} />
            : (
              <svg width="22" height="14" viewBox="0 0 20 14" fill="none">
                <path d="M1 7H19M1 1H19M1 13H19" stroke="#8B1E3F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="lg:hidden fixed top-[65px] left-0 right-0 bg-white border-b border-[#ede5dc] px-5 py-4 flex flex-col gap-0.5 z-30 shadow-md overflow-y-auto max-h-[calc(100vh-65px)]">
          {MOBILE_LINKS.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
              className="py-2.5 text-[15px] border-b border-[#f5f0eb] last:border-0 transition-colors hover:text-[#8b1e3f]"
              style={{ fontFamily: 'Manrope, sans-serif', ...ls(pathname === link.href) }}>
              {link.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-3 mt-1">
            {user ? (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2 text-sm" style={{ color: '#5a4f49' }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: '#8b1e3f' }}>
                    {user.username[0].toUpperCase()}
                  </div>
                  {user.username}
                </div>
                <button onClick={handleLogout} className="text-sm flex items-center gap-1" style={{ color: '#978a81' }}>
                  <LogOut size={13} /> Odjava
                </button>
              </div>
            ) : (
              <>
                <button onClick={() => openModal('register')}
                  className="flex-1 bg-[#8b1e3f] text-white py-2.5 text-[14px]"
                  style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Registruj se
                </button>
                <button onClick={() => openModal('login')}
                  className="flex-1 border border-[#8b1e3f] text-[#8b1e3f] py-2.5 text-[14px]"
                  style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Prijava
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <AuthModal open={modalOpen} mode={modalMode}
        onClose={() => setModalOpen(false)}
        onSuccess={u => { setUser(u); setModalOpen(false) }}
        onSwitchMode={m => setModalMode(m)} />
    </>
  )
}
