'use client'

import { useEffect, useRef, useState } from 'react'
import { Globe, ChevronDown, Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { LOCALES, LOCALE_COOKIE, LOCALE_INFO, type Locale } from '@/i18n/config'
import { localizeHref, stripLocale } from '@/i18n/href'
import { useCurrentLocale } from '@/i18n/navigation'

/** Switches language: remembers the choice and reloads the same page in the new language */
export function switchLocale(next: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`
  const { pathname, search, hash } = window.location
  window.location.assign(localizeHref(stripLocale(pathname) + search + hash, next))
}

/**
 * Language picker for the navigation bar. `variant="desktop"` matches the menu
 * dropdowns; `variant="mobile"` is the compact globe button in the mobile bar.
 */
export default function LanguageSwitcher({ variant = 'desktop' }: { variant?: 'desktop' | 'mobile' }) {
  const t = useTranslations('nav')
  const current = useCurrentLocale()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-label={t('language')}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={
          variant === 'desktop'
            ? 'flex items-center gap-1 px-1 py-2 text-base whitespace-nowrap hover:text-[var(--fg-8b1e3f)] transition-colors'
            : 'flex items-center gap-1 p-1 text-sm font-medium'
        }
        style={{ color: open ? 'var(--fg-8b1e3f)' : 'var(--fg-5a4f49)' }}
      >
        <Globe size={variant === 'desktop' ? 17 : 20} strokeWidth={1.75} />
        <span className={variant === 'desktop' ? 'text-sm font-medium' : ''}>{LOCALE_INFO[current].short}</span>
        {variant === 'desktop' && <ChevronDown size={13} className={`hidden min-[1440px]:block transition-transform ${open ? 'rotate-180' : ''}`} />}
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label={t('language')}
          className="absolute top-full end-0 mt-1 bg-[var(--bg-ffffff)] shadow-lg border border-[var(--line-ede5dc)] overflow-hidden z-50"
          style={{ minWidth: 170 }}
        >
          {LOCALES.map((l, i) => {
            const active = l === current
            return (
              <li key={l} role="option" aria-selected={active}>
                {i > 0 && <div className="border-t border-[var(--line-f0ebe4)]" />}
                <button
                  type="button"
                  lang={l}
                  dir={LOCALE_INFO[l].dir}
                  onClick={() => { setOpen(false); if (!active) switchLocale(l) }}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 text-sm hover:bg-[var(--bg-faf7f2)] transition-colors text-start"
                  style={{ color: active ? 'var(--fg-8b1e3f)' : 'var(--fg-5a4f49)', fontWeight: active ? 600 : 400 }}
                >
                  <span>{LOCALE_INFO[l].name}</span>
                  {active && <Check size={14} />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
