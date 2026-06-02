'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Quote {
  id: number
  type: string
  text: string
  source: string | null
}

const TYPE_LABELS: Record<string, string> = {
  ajet:   'Ajet',
  hadis:  'Hadis',
  izreka: 'Izreka učenjaka',
}

const TYPE_COLORS: Record<string, string> = {
  ajet:   '#8B1E3F',
  hadis:  '#2563EB',
  izreka: '#059669',
}

export default function QuoteCarousel({ quotes }: { quotes: Quote[] }) {
  const [page, setPage] = useState(0)

  if (quotes.length === 0) return null

  const PER_PAGE = 3
  const totalPages = Math.ceil(quotes.length / PER_PAGE)
  const visible = quotes.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE)

  return (
    <div>
      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {visible.map(q => (
          <div key={q.id} className="flex flex-col p-6 rounded-2xl"
            style={{ background: '#fff', border: '1px solid #E8E1DB' }}>
            {/* Type badge */}
            <span className="font-mono text-[10px] uppercase tracking-widest mb-4 self-start px-2.5 py-1 rounded-full"
              style={{ background: `${TYPE_COLORS[q.type] ?? '#8B1E3F'}15`, color: TYPE_COLORS[q.type] ?? '#8B1E3F' }}>
              {TYPE_LABELS[q.type] ?? q.type}
            </span>

            {/* Quote mark */}
            <span className="text-5xl leading-none mb-3 select-none" style={{ color: '#D6CCC3', fontFamily: 'Georgia, serif' }}>"</span>

            {/* Text */}
            <p className="text-warm-800 text-sm leading-relaxed flex-1" style={{ color: '#3F3733' }}>
              {q.text}
            </p>

            {/* Source */}
            {q.source && (
              <p className="font-mono text-[11px] mt-4 tracking-wide" style={{ color: '#A89888' }}>
                — {q.source}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Navigation */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={() => setPage(p => p - 1)}
            disabled={page === 0}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-colors disabled:opacity-30 hover:bg-warm-200"
            style={{ border: '1px solid #D6CCC3' }}
          >
            <ChevronLeft size={18} style={{ color: '#5A4F49' }} />
          </button>

          <span className="font-mono text-xs text-warm-400">
            {page + 1} / {totalPages}
          </span>

          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page === totalPages - 1}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-colors disabled:opacity-30 hover:bg-warm-200"
            style={{ border: '1px solid #D6CCC3' }}
          >
            <ChevronRight size={18} style={{ color: '#5A4F49' }} />
          </button>
        </div>
      )}
    </div>
  )
}
