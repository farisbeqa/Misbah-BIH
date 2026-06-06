'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

interface StoredQuote {
  text: string
  source: string | null
  type: string
  selectedAt: number
}

const STORE_KEY   = 'misao_dana_v1'
const SESSION_KEY = 'misao_dana_shown'
const INTERVAL_MS = 12 * 60 * 60 * 1000

const TYPE_LABEL: Record<string, string> = {
  ajet:   "Kur'anski ajet",
  hadis:  'Hadis',
  izreka: 'Misao dana',
}

export default function MisaoDanaPopup() {
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
        if (!stored || now - stored.selectedAt > INTERVAL_MS) {
          const res = await fetch('/api/quotes')
          if (!res.ok) return
          const all: Array<{ text: string; source: string | null; type: string }> = await res.json()
          if (!all.length) return
          const picked = all[Math.floor(Math.random() * all.length)]
          stored = { text: picked.text, source: picked.source, type: picked.type, selectedAt: now }
          localStorage.setItem(STORE_KEY, JSON.stringify(stored))
        }

        setQuote(stored)
        setOpen(true)
        sessionStorage.setItem(SESSION_KEY, '1')
      } catch { /* fail silently */ }
    }

    load()
  }, [])

  if (!open || !quote) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6"
      style={{ backgroundColor: 'rgba(20,17,16,0.6)', backdropFilter: 'blur(2px)' }}
      onClick={() => setOpen(false)}
    >
      <div
        className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Accent bar */}
        <div className="h-1 w-full" style={{ background: '#8B1E3F' }} />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: '#8B1E3F', letterSpacing: '0.1em' }}
          >
            {TYPE_LABEL[quote.type] ?? 'Misao dana'}
          </span>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Zatvori"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mx-6 h-px" style={{ background: '#F0EBE4' }} />

        {/* Quote */}
        <div className="px-6 py-6">
          <p
            className="leading-relaxed text-center"
            style={{
              color: '#241F1D',
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
              style={{ color: '#8B1E3F' }}
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
            style={{ backgroundColor: '#8B1E3F' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#7a1a37')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#8B1E3F')}
          >
            Zatvori
          </button>
        </div>
      </div>
    </div>
  )
}
