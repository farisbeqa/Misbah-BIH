'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown, LogOut } from 'lucide-react'
import AuthModal from './AuthModal'

interface AuthUser { id: number; username: string }

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
  return (
    <div ref={dropRef} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-0.5 px-1.5 py-2 text-base whitespace-nowrap hover:text-[#8b1e3f] transition-colors"
        style={{ color: isActive ? '#8b1e3f' : '#5a4f49', fontWeight: isActive ? 600 : 400 }}
      >
        {label}
        <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white shadow-lg border border-[#ede5dc] overflow-hidden z-50"
          style={{ minWidth: 190 }}>
          {items.map((item, i) => (
            <div key={item.href}>
              {i > 0 && <div className="border-t border-[#f0ebe4]" />}
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 text-sm hover:bg-[#faf7f2] transition-colors"
                style={{ color: pathname === item.href ? '#8b1e3f' : '#5a4f49', fontWeight: pathname === item.href ? 600 : 400 }}
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

const PLAIN_LINKS_LEFT  = [{ href: '/kuran',    label: "Kur'an"  }]
const PLAIN_LINKS_MID   = [{ href: '/podcasts', label: 'Podcast' }, { href: '/mekteb', label: 'Mekteb' }]

const PLAIN_LINKS_RIGHT = [
  { href: '/blog',   label: 'Blog' },
  { href: '/o-nama', label: 'O Nama' },
]

const MOBILE_LINKS = [
  { href: '/',                   label: 'Početna' },
  { href: '/predavanja/duga',    label: 'Duga predavanja' },
  { href: '/predavanja/kratka',  label: 'Kratka predavanja' },
  { href: '/kuran',              label: "Kur'an" },
  { href: '/zikrovi',            label: 'Zikrovi (Tekst i Audio)' },
  { href: '/zikrovi/tekstovi',   label: 'Dove (Tekst i Audio)'    },
  { href: '/ilahije/izvedba',    label: 'Ilahije – Izvedba' },
  { href: '/ilahije/tekstovi',   label: 'Ilahije – Tekstovi' },
  { href: '/podcasts',           label: 'Podcast' },
  { href: '/mekteb',             label: 'Mekteb' },
  { href: '/aktivnosti',         label: 'Aktivnosti' },
  { href: '/galerija',           label: 'Galerija' },
  { href: '/blog',               label: 'Blog' },
  { href: '/o-nama',             label: 'O Nama' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser]             = useState<AuthUser | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [modalOpen, setModalOpen]   = useState(false)
  const [modalMode, setModalMode]   = useState<'login' | 'register'>('login')

  const pred      = useDropdown()
  const zikrovi   = useDropdown()
  const ilahije   = useDropdown()
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
  const isZikrovi    = pathname.startsWith('/zikrovi')
  const isIlahije    = pathname.startsWith('/ilahije')
  const isZajednica  = pathname.startsWith('/aktivnosti') || pathname.startsWith('/galerija')

  const ls = (active: boolean) => ({
    color:      active ? '#8b1e3f' : '#5a4f49',
    fontWeight: active ? 600 : 400,
  })

  return (
    <>
      {/* Desktop nav */}
      <nav className="bg-white w-full sticky top-0 z-40 border-b border-gray-100 hidden lg:block">
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Image src="/logo.jpg" alt="Misbah EDU" width={56} height={56} className="object-cover mix-blend-multiply" />
          <span className="font-bold text-[26px] leading-none" style={{ color: '#8b1e3f' }}>
            Misbah <span style={{ color: '#c8a96b' }}>EDU</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
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
              className="px-1.5 py-2 text-base whitespace-nowrap hover:text-[#8b1e3f] transition-colors"
              style={ls(pathname === link.href)}>
              {link.label}
            </Link>
          ))}
          <NavDropdown
            open={zikrovi.open} setOpen={zikrovi.setOpen} dropRef={zikrovi.ref}
            label="Zikrovi i Dove" isActive={isZikrovi} pathname={pathname}
            items={[
              { href: '/zikrovi',          label: 'Zikrovi (Tekst i Audio)' },
              { href: '/zikrovi/tekstovi', label: 'Dove (Tekst i Audio)'    },
            ]}
          />
          {PLAIN_LINKS_MID.map(link => (
            <Link key={link.href} href={link.href}
              className="px-1.5 py-2 text-base whitespace-nowrap hover:text-[#8b1e3f] transition-colors"
              style={ls(pathname === link.href)}>
              {link.label}
            </Link>
          ))}
          <NavDropdown
            open={ilahije.open} setOpen={ilahije.setOpen} dropRef={ilahije.ref}
            label="Ilahije" isActive={isIlahije} pathname={pathname}
            items={[
              { href: '/ilahije/izvedba',  label: 'Izvedba' },
              { href: '/ilahije/tekstovi', label: 'Tekstovi' },
            ]}
          />
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
              className="px-1.5 py-2 text-base whitespace-nowrap hover:text-[#8b1e3f] transition-colors"
              style={ls(pathname === link.href)}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4 shrink-0">
          {authChecked && (
            user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm" style={{ color: '#5a4f49' }}>
                  <div className="w-8 h-8 flex items-center justify-center text-xs font-bold text-white"
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
                  className="bg-[#8b1e3f] text-white px-8 py-3 text-base font-normal hover:bg-[#7a1a37] transition-colors">
                  Registruj se
                </button>
                <button onClick={() => openModal('login')}
                  className="border border-[#8b1e3f] text-[#8b1e3f] px-6 py-3 text-base font-normal hover:bg-[#faf5f5] transition-colors">
                  Prijava
                </button>
              </>
            )
          )}
        </div>
      </div>
      </nav>

      {/* Mobile nav bar */}
      <nav className="bg-white w-full sticky top-0 z-40 border-b border-gray-100 lg:hidden flex items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/logo.jpg" alt="Misbah EDU" width={44} height={44} className="object-cover mix-blend-multiply" />
          <span className="font-bold text-[20px] leading-none" style={{ color: '#8b1e3f' }}>
            Misbah <span style={{ color: '#c8a96b' }}>EDU</span>
          </span>
        </Link>
        <button onClick={() => setMobileOpen(v => !v)} className="p-1" aria-label="Toggle menu">
          {mobileOpen
            ? <X size={24} style={{ color: '#8b1e3f' }} />
            : <Menu size={24} style={{ color: '#141110' }} />
          }
        </button>
      </nav>

      {mobileOpen && (
        <div className="lg:hidden fixed top-[65px] left-0 right-0 bg-white border-b border-gray-100 px-5 pb-5 flex flex-col gap-0.5 z-30 shadow-md overflow-y-auto max-h-[calc(100vh-65px)]">
          <div className="flex flex-col gap-1 pt-2">
            {MOBILE_LINKS.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                className="py-2.5 text-base border-b border-[#f5f0eb] last:border-0 transition-colors hover:text-[#8b1e3f]"
                style={ls(pathname === link.href)}>
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3 mt-4">
            {user ? (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2 text-sm" style={{ color: '#5a4f49' }}>
                  <div className="w-7 h-7 flex items-center justify-center text-xs font-bold text-white"
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
                  className="flex-1 bg-[#8b1e3f] text-white py-3 text-base font-normal">
                  Registruj se
                </button>
                <button onClick={() => openModal('login')}
                  className="flex-1 border border-[#8b1e3f] text-[#8b1e3f] py-3 text-base font-normal">
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
