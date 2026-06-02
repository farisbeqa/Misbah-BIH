'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Quote {
  id: number
  type: string
  text: string
  source: string | null
}

const GAP = 24

export default function QuoteCarousel({ quotes }: { quotes: Quote[] }) {
  const [current, setCurrent]   = useState(0)
  const [perPage, setPerPage]   = useState(3)
  const [step, setStep]         = useState(0)
  const containerRef            = useRef<HTMLDivElement>(null)

  const measure = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    const card = el.querySelector('[data-card]') as HTMLElement
    if (card) setStep(card.offsetWidth + GAP)
  }, [])

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      setPerPage(w < 640 ? 1 : w < 1024 ? 2 : 3)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    // Re-measure after perPage changes and DOM updates
    requestAnimationFrame(measure)
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [perPage, measure])

  const max = Math.max(0, quotes.length - perPage)
  const go  = (dir: -1 | 1) => setCurrent(c => Math.max(0, Math.min(c + dir, max)))

  if (quotes.length === 0) return null

  return (
    <div className="relative px-10 sm:px-12">

      {/* Left arrow */}
      <button
        onClick={() => go(-1)}
        disabled={current === 0}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white flex items-center justify-center transition-all duration-200 hover:scale-110 disabled:opacity-0 disabled:pointer-events-none"
        style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.10)', border: '1px solid #E8E1DB' }}
      >
        <ChevronLeft size={17} style={{ color: '#5A4F49' }} />
      </button>

      {/* Track */}
      <div ref={containerRef} className="overflow-hidden">
        <div
          className="flex"
          style={{
            gap: GAP,
            transform: `translateX(-${current * step}px)`,
            transition: 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        >
          {quotes.map(q => (
            <div
              key={q.id}
              data-card
              className="flex-shrink-0 flex flex-col"
              style={{
                width: `calc(${100 / perPage}% - ${GAP * (perPage - 1) / perPage}px)`,
                background: '#FFFFFF',
                border: '1px solid #EDE8E2',
                borderRadius: 16,
                padding: '32px 28px 28px',
              }}
            >
              {/* Decorative quote mark */}
              <span
                className="block select-none leading-none mb-4"
                style={{ fontSize: 64, color: '#D6CCC3', fontFamily: 'Georgia, serif', lineHeight: 0.8 }}
              >
                &ldquo;
              </span>

              {/* Quote text */}
              <p className="flex-1 leading-relaxed" style={{ color: '#2C2420', fontSize: '0.9375rem' }}>
                {q.text}
              </p>

              {/* Source */}
              {q.source && (
                <p
                  className="font-mono mt-5"
                  style={{ color: '#A89888', fontSize: '0.6875rem', letterSpacing: '0.04em' }}
                >
                  — {q.source}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right arrow */}
      <button
        onClick={() => go(1)}
        disabled={current >= max}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white flex items-center justify-center transition-all duration-200 hover:scale-110 disabled:opacity-0 disabled:pointer-events-none"
        style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.10)', border: '1px solid #E8E1DB' }}
      >
        <ChevronRight size={17} style={{ color: '#5A4F49' }} />
      </button>

      {/* Dot indicators */}
      {max > 0 && (
        <div className="flex justify-center items-center gap-1.5 mt-8">
          {Array.from({ length: max + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width:      i === current ? 20 : 6,
                height:     6,
                background: i === current ? '#8B1E3F' : '#D6CCC3',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
