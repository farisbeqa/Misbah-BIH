'use client'

import { useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTranslations } from 'next-intl'

// Light / dark theme switch (sun and moon). The choice is remembered in the
// "theme" cookie; without a choice the site follows the device setting. The
// script in src/app/layout.tsx applies the theme before the first paint; the
// colours themselves are in src/app/theme.css.

export const THEME_COOKIE = 'theme'

const root = () => document.documentElement
const isDark = () => root().getAttribute('data-theme') === 'dark'

export default function ThemeToggle({ variant = 'desktop' }: { variant?: 'desktop' | 'mobile' }) {
  const t = useTranslations('nav')

  // While the visitor has not chosen, follow changes of the device setting
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      if (new RegExp(`(?:^|; )${THEME_COOKIE}=`).test(document.cookie)) return
      root().setAttribute('data-theme', mq.matches ? 'dark' : 'light')
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const toggle = () => {
    const next = isDark() ? 'light' : 'dark'
    root().setAttribute('data-theme', next)
    document.cookie = `${THEME_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`
  }

  const size = variant === 'mobile' ? 20 : 18
  return (
    <button
      type="button"
      onClick={toggle}
      className={`theme-toggle flex items-center justify-center ${variant === 'mobile' ? 'p-1.5' : 'p-1'} transition-colors text-[var(--fg-5a4f49)] hover:text-[var(--fg-8b1e3f)]`}
    >
      {/* Icon and label follow data-theme through CSS, so the server render is right too */}
      <Moon size={size} className="theme-icon-moon" aria-hidden="true" />
      <Sun size={size} className="theme-icon-sun" aria-hidden="true" />
      <span className="sr-only theme-label-dark">{t('themeDark')}</span>
      <span className="sr-only theme-label-light">{t('themeLight')}</span>
    </button>
  )
}
