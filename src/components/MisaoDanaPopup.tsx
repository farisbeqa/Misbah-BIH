'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { X } from 'lucide-react'
import { useCurrentLocale } from '@/i18n/navigation'
import { DEFAULT_LOCALE } from '@/i18n/config'

interface StoredQuote {
  id?: number
  text: string
  source: string | null
  type: string
  selectedAt: number
  /** Language of text/source; quotes stored before the site had languages are Bosnian */
  locale?: string
}

const STORE_KEY   = 'misao_dana_v1'
const SESSION_KEY = 'misao_dana_shown'
const INTERVAL_MS = 12 * 60 * 60 * 1000

const QUOTE_TYPES = ['ajet', 'hadis', 'izreka']

export default function MisaoDanaPopup() {
  const t = useTranslations('quotes')
  const locale = useCurrentLocale()
  const [quote, setQuote] = useState<StoredQuote | null>(null)
  const [open,  setOpen]  = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (sessionStorage.getItem(SESSION_KEY)) return

    async function load() {
      try {
        let stored: StoredQuote | null = null
        try {
          const raw = localStorage.getItem(STORE_KEY)
          if (raw) stored = JSON.parse(raw)
        } catch { /* ignore malformed */ }

        const now = Date.now()
        const expired = !stored || now - stored.selectedAt > INTERVAL_MS
        const otherLanguage = !!stored && (stored.locale ?? DEFAULT_LOCALE) !== locale
        if (expired || otherLanguage) {
          const res = await fetch(`/api/quotes?lang=${locale}`)
          if (!res.ok) return
          const all: Array<{ id: number; text: string; source: string | null; type: string }> = await res.json()
          if (!all.length) return
          // Only the language changed: keep today's quote, in the new language
          const same = !expired && stored?.id != null ? all.find(q => q.id === stored?.id) : undefined
          const picked = same ?? all[Math.floor(Math.random() * all.length)]
          stored = {
            id: picked.id, text: picked.text, source: picked.source, type: picked.type,
            selectedAt: same && stored ? stored.selectedAt : now,
            locale,
          }
          localStorage.setItem(STORE_KEY, JSON.stringify(stored))
        }

        setQuote(stored)
        setOpen(true)
        sessionStorage.setItem(SESSION_KEY, '1')
      } catch { /* fail silently */ }
    }

    load()
  }, [locale])

  if (!open || !quote) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6"
      style={{ backgroundColor: 'rgba(20,17,16,0.6)', backdropFilter: 'blur(2px)' }}
      onClick={() => setOpen(false)}
    >
      <div
        className="relative bg-[var(--bg-ffffff)] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Accent bar */}
        <div className="h-1 w-full" style={{ background: 'var(--bg-8b1e3f)' }} />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: 'var(--fg-8b1e3f)', letterSpacing: '0.1em' }}
          >
            {QUOTE_TYPES.includes(quote.type) ? t(`types.${quote.type}`) : t('popup.defaultLabel')}
          </span>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg text-[var(--fg-9ca3af)] hover:text-[var(--fg-374151)] hover:bg-[var(--bg-f3f4f6)] transition-colors"
            aria-label={t('popup.close')}
          >
            <X size={18} />
          </button>
        </div>

        <div className="mx-6 h-px" style={{ background: 'var(--bg-f0ebe4)' }} />

        {/* Quote */}
        <div className="px-6 py-6">
          <p
            className="leading-relaxed text-center"
            style={{
              color: 'var(--fg-241f1d)',
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(16px, 4vw, 20px)',
              lineHeight: 1.7,
            }}
          >
            &ldquo;{quote.text}&rdquo;
          </p>
          {quote.source && (
            <p
              className="text-sm text-center mt-4 font-semibold"
              style={{ color: 'var(--fg-8b1e3f)' }}
            >
              — {quote.source}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-1">
          <button
            onClick={() => setOpen(false)}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-colors"
            style={{ backgroundColor: 'var(--bg-8b1e3f)' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-7a1a37)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--bg-8b1e3f)')}
          >
            {t('popup.close')}
          </button>
        </div>
      </div>
    </div>
  )
}
