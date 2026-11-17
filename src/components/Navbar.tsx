'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import Link, { usePathname, useCurrentLocale } from '@/i18n/navigation'
import { Menu, X, ChevronDown, LogOut } from 'lucide-react'
import AuthModal from './AuthModal'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeToggle from './ThemeToggle'
import { MEKTEB_PUBLIC, MEKTEB_URL } from '@/lib/links'

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
        className="flex items-center gap-0.5 px-1 min-[1440px]:px-1.5 py-2 text-base whitespace-nowrap hover:text-[var(--fg-8b1e3f)] transition-colors"
        style={{ color: isActive ? 'var(--fg-8b1e3f)' : 'var(--fg-5a4f49)', fontWeight: isActive ? 600 : 400 }}
      >
        {label}
        <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full start-0 mt-1 bg-[var(--bg-ffffff)] shadow-lg border border-[var(--line-ede5dc)] overflow-hidden z-50"
          style={{ minWidth: 190 }}>
          {items.map((item, i) => (
            <div key={item.href}>
              {i > 0 && <div className="border-t border-[var(--line-f0ebe4)]" />}
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 text-sm hover:bg-[var(--bg-faf7f2)] transition-colors"
                style={{ color: pathname === item.href ? 'var(--fg-8b1e3f)' : 'var(--fg-5a4f49)', fontWeight: pathname === item.href ? 600 : 400 }}
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

type T = ReturnType<typeof useTranslations<'nav'>>

const plainLinksLeft = (t: T) => [{ href: '/kuran', label: t('quran') }]
// Mekteb is its own site on a Misbah subdomain, shown once it is public (src/lib/links.ts)
const plainLinksMid  = (t: T) => [
  { href: '/podcasts', label: t('podcast') },
  ...(MEKTEB_PUBLIC ? [{ href: MEKTEB_URL, label: t('mekteb') }] : []),
]

// Dropdown groups, shared by the desktop and mobile navigation
const lecturesItems  = (t: T) => [
  { href: '/predavanja/duga',   label: t('longLectures') },
  { href: '/predavanja/kratka', label: t('shortLectures') },
]
const zikrItems      = (t: T) => [
  { href: '/zikrovi',          label: t('zikrs') },
  { href: '/zikrovi/tekstovi', label: t('duas') },
]
const ilahijeItems   = (t: T) => [
  { href: '/ilahije/izvedba',  label: t('performances') },
  { href: '/ilahije/tekstovi', label: t('lyrics') },
]
const communityItems = (t: T) => [
  { href: '/aktivnosti',   label: t('activities') },
  { href: '/galerija',     label: t('gallery') },
  { href: '/o-nama',       label: t('aboutUs') },
  { href: '/autori',       label: t('authors') },
  { href: '/pozovite-nas', label: t('inviteUs') },
]
const blogItems      = (t: T) => [
  { href: '/blog',  label: t('reflections') },
  { href: '/price', label: t('stories') },
]

type MobileEntry =
  | { href: string; label: string }
  | { label: string; items: DropdownItem[] }

// Mirrors the desktop navigation: same order, same dropdown groups
const mobileNav = (t: T): MobileEntry[] => [
  { href: '/', label: t('home') },
  { label: t('lectures'), items: lecturesItems(t) },
  { href: '/kuran', label: t('quran') },
  { label: t('zikrAndDua'), items: zikrItems(t) },
  { href: '/podcasts', label: t('podcast') },
  ...(MEKTEB_PUBLIC ? [{ href: MEKTEB_URL, label: t('mekteb') }] : []),
  { label: t('ilahije'), items: ilahijeItems(t) },
  { label: t('community'), items: communityItems(t) },
  { label: t('blog'), items: blogItems(t) },
]

function isGroupActive(items: DropdownItem[], pathname: string) {
  return items.some(i => pathname === i.href || (i.href !== '/' && pathname.startsWith(i.href + '/')))
}

export default function Navbar() {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const locale = useCurrentLocale()
  const MOBILE_NAV = mobileNav(t)
  // German and Arabic menu labels are longer and do not fit from 1280px:
  // in those languages the desktop menu starts at 1440px (mobile menu below)
  const lateDesktop = locale === 'de' || locale === 'ar'
  const desktopOnly = lateDesktop ? 'hidden min-[1440px]:block' : 'hidden xl:block'
  const mobileOnly = lateDesktop ? 'min-[1440px]:hidden' : 'xl:hidden'
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileGroup, setMobileGroup] = useState<string | null>(null)
  const [user, setUser]             = useState<AuthUser | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [modalOpen, setModalOpen]   = useState(false)
  const [modalMode, setModalMode]   = useState<'login' | 'register'>('login')

  const pred      = useDropdown()
  const zikrovi   = useDropdown()
  const ilahije   = useDropdown()
  const zajednica = useDropdown()
  const blog      = useDropdown()

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => { setUser(d.user); setAuthChecked(true) })
  }, [])

  useEffect(() => {
    if (!mobileOpen) return
    const current = MOBILE_NAV.find(e => 'items' in e && isGroupActive(e.items, pathname))
    setMobileGroup(current ? current.label : null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobileOpen, pathname])

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
  const isZajednica  = pathname.startsWith('/aktivnosti') || pathname.startsWith('/galerija') || pathname.startsWith('/o-nama') || pathname.startsWith('/autori') || pathname.startsWith('/pozovite-nas')
  const isBlog       = pathname.startsWith('/blog') || pathname.startsWith('/price')

  const ls = (active: boolean) => ({
    color:      active ? 'var(--fg-8b1e3f)' : 'var(--fg-5a4f49)',
    fontWeight: active ? 600 : 400,
  })

  return (
    <>
      {/* Desktop nav */}
      <nav className={`bg-[var(--bg-ffffff)] w-full sticky top-0 z-40 border-b border-[var(--line-f3f4f6)] ${desktopOnly}`}>
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Image src="/logo.jpg" alt="Misbah EDU" width={56} height={56} className="site-logo object-cover mix-blend-multiply" />
          <span className="font-bold text-[26px] leading-none" style={{ color: 'var(--fg-8b1e3f)' }}>
            Misbah <span style={{ color: 'var(--fg-c8a96b)' }}>EDU</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <NavDropdown
            open={pred.open} setOpen={pred.setOpen} dropRef={pred.ref}
            label={t('lectures')} isActive={isPredavanja} pathname={pathname}
            items={lecturesItems(t)}
          />
          {plainLinksLeft(t).map(link => (
            <Link key={link.href} href={link.href}
              className="px-1 min-[1440px]:px-1.5 py-2 text-base whitespace-nowrap hover:text-[var(--fg-8b1e3f)] transition-colors"
              style={ls(pathname === link.href)}>
              {link.label}
            </Link>
          ))}
          <NavDropdown
            open={zikrovi.open} setOpen={zikrovi.setOpen} dropRef={zikrovi.ref}
            label={t('zikrAndDua')} isActive={isZikrovi} pathname={pathname}
            items={zikrItems(t)}
          />
          {plainLinksMid(t).map(link => (
            <Link key={link.href} href={link.href}
              className="px-1 min-[1440px]:px-1.5 py-2 text-base whitespace-nowrap hover:text-[var(--fg-8b1e3f)] transition-colors"
              style={ls(pathname === link.href)}>
              {link.label}
            </Link>
          ))}
          <NavDropdown
            open={ilahije.open} setOpen={ilahije.setOpen} dropRef={ilahije.ref}
            label={t('ilahije')} isActive={isIlahije} pathname={pathname}
            items={ilahijeItems(t)}
          />
          <NavDropdown
            open={zajednica.open} setOpen={zajednica.setOpen} dropRef={zajednica.ref}
            label={t('community')} isActive={isZajednica} pathname={pathname}
            items={communityItems(t)}
          />
          <NavDropdown
            open={blog.open} setOpen={blog.setOpen} dropRef={blog.ref}
            label={t('blog')} isActive={isBlog} pathname={pathname}
            items={blogItems(t)}
          />
        </div>

        <div className="flex items-center gap-3 min-[1440px]:gap-4 shrink-0">
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
          {authChecked && (
            user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--fg-5a4f49)' }}>
                  <div className="w-8 h-8 flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: 'var(--bg-8b1e3f)' }}>
                    {user.username[0].toUpperCase()}
                  </div>
                  <span>{user.username}</span>
                </div>
                <button onClick={handleLogout}
                  className="flex items-center gap-1 text-sm transition-colors hover:text-[var(--fg-8b1e3f)]"
                  style={{ color: 'var(--fg-978a81)' }}>
                  <LogOut size={13} /> {t('logout')}
                </button>
              </div>
            ) : (
              <>
                <button onClick={() => openModal('register')}
                  className="bg-[var(--bg-8b1e3f)] text-white px-6 min-[1440px]:px-8 py-3 text-base font-normal hover:bg-[var(--bg-7a1a37)] transition-colors whitespace-nowrap">
                  {t('register')}
                </button>
                <button onClick={() => openModal('login')}
                  className="border border-[var(--line-8b1e3f)] text-[var(--fg-8b1e3f)] px-5 min-[1440px]:px-6 py-3 text-base font-normal hover:bg-[var(--bg-faf5f5)] transition-colors whitespace-nowrap">
                  {t('login')}
                </button>
              </>
            )
          )}
        </div>
      </div>
      </nav>

      {/* Mobile nav bar */}
      <nav className={`bg-[var(--bg-ffffff)] w-full sticky top-0 z-40 border-b border-[var(--line-f3f4f6)] ${mobileOnly} flex items-center justify-between px-5 py-4`}>
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/logo.jpg" alt="Misbah EDU" width={44} height={44} className="site-logo object-cover mix-blend-multiply" />
          <span className="font-bold text-[20px] leading-none" style={{ color: 'var(--fg-8b1e3f)' }}>
            Misbah <span style={{ color: 'var(--fg-c8a96b)' }}>EDU</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle variant="mobile" />
          <LanguageSwitcher variant="mobile" />
          <button onClick={() => setMobileOpen(v => !v)} className="p-1" aria-label={t('toggleMenu')}>
            {mobileOpen
              ? <X size={24} style={{ color: 'var(--fg-8b1e3f)' }} />
              : <Menu size={24} style={{ color: 'var(--fg-141110)' }} />
            }
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className={`${mobileOnly} fixed top-[65px] left-0 right-0 bg-[var(--bg-ffffff)] border-b border-[var(--line-f3f4f6)] px-5 pb-5 flex flex-col gap-0.5 z-30 shadow-md overflow-y-auto max-h-[calc(100vh-65px)]`}>
          <div className="flex flex-col pt-2">
            {MOBILE_NAV.map(entry => {
              if (!('items' in entry)) {
                return (
                  <Link key={entry.href} href={entry.href} onClick={() => setMobileOpen(false)}
                    className="py-3 text-base border-b border-[var(--line-f5f0eb)] transition-colors hover:text-[var(--fg-8b1e3f)]"
                    style={ls(pathname === entry.href)}>
                    {entry.label}
                  </Link>
                )
              }
              const expanded = mobileGroup === entry.label
              return (
                <div key={entry.label} className="border-b border-[var(--line-f5f0eb)]">
                  <button
                    onClick={() => setMobileGroup(expanded ? null : entry.label)}
                    className="w-full flex items-center justify-between py-3 text-base text-start"
                    style={ls(isGroupActive(entry.items, pathname))}
                    aria-expanded={expanded}>
                    {entry.label}
                    <ChevronDown size={16} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
                  </button>
                  {expanded && (
                    <div className="flex flex-col pb-2 ps-4 ms-1 border-s-2 border-[var(--line-ede5dc)]">
                      {entry.items.map(item => (
                        <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                          className="py-2.5 text-[15px] transition-colors hover:text-[var(--fg-8b1e3f)]"
                          style={ls(pathname === item.href)}>
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <div className="flex items-center gap-3 mt-4">
            {user ? (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--fg-5a4f49)' }}>
                  <div className="w-7 h-7 flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: 'var(--bg-8b1e3f)' }}>
                    {user.username[0].toUpperCase()}
                  </div>
                  {user.username}
                </div>
                <button onClick={handleLogout} className="text-sm flex items-center gap-1" style={{ color: 'var(--fg-978a81)' }}>
                  <LogOut size={13} /> {t('logout')}
                </button>
              </div>
            ) : (
              <>
                <button onClick={() => openModal('register')}
                  className="flex-1 bg-[var(--bg-8b1e3f)] text-white py-3 text-base font-normal">
                  {t('register')}
                </button>
                <button onClick={() => openModal('login')}
                  className="flex-1 border border-[var(--line-8b1e3f)] text-[var(--fg-8b1e3f)] py-3 text-base font-normal">
                  {t('login')}
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
