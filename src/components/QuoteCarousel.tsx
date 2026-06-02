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
  // Default 1 — safe for SSR/mobile, JS updates after mount
  const [perPage, setPerPage] = useState(1)
  const [current, setCurrent] = useState(0)
  const [step, setStep]       = useState(0)
  const containerRef          = useRef<HTMLDivElement>(null)

  const measure = useCallback(() => {
    const el  = containerRef.current
    if (!el) return
    const card = el.querySelector('[data-card]') as HTMLElement | null
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

  // Re-measure whenever perPage changes (DOM has updated)
  useEffect(() => {
    const id = requestAnimationFrame(measure)
    window.addEventListener('resize', measure)
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', measure) }
  }, [perPage, measure])

  const max = Math.max(0, quotes.length - perPage)

  // Clamp current when perPage changes
  useEffect(() => { setCurrent(c => Math.min(c, max)) }, [max])

  const go = (dir: -1 | 1) => setCurrent(c => Math.max(0, Math.min(c + dir, max)))

  if (quotes.length === 0) return null

  const cardWidth = `calc(${100 / perPage}% - ${GAP * (perPage - 1) / perPage}px)`

  return (
    <div className="relative px-10 sm:px-14">

      {/* Left arrow */}
      <button
        onClick={() => go(-1)}
        disabled={current === 0}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white flex items-center justify-center transition-all duration-200 hover:scale-110 disabled:opacity-0 disabled:pointer-events-none"
        style={{ boxShadow: '0 2px 14px rgba(0,0,0,0.12)', border: '1px solid #E8E1DB' }}
      >
        <ChevronLeft size={18} style={{ color: '#5A4F49' }} />
      </button>

      {/* Track — overflow-hidden + flex-nowrap */}
      <div ref={containerRef} className="overflow-hidden">
        <div
          style={{
            display: 'flex',
            flexWrap: 'nowrap',
            gap: GAP,
            transform: step ? `translateX(-${current * step}px)` : 'none',
            transition: 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        >
          {quotes.map(q => (
            <div
              key={q.id}
              data-card
              style={{
                flexShrink: 0,
                flexGrow: 0,
                width: cardWidth,
                background: '#FFFFFF',
                border: '1px solid #EDE8E2',
                borderRadius: 18,
                padding: '36px 32px 32px',
                display: 'flex',
                flexDirection: 'column',
                minHeight: 220,
                boxSizing: 'border-box',
              }}
            >
              {/* Decorative quote mark */}
              <span
                aria-hidden="true"
                style={{
                  display: 'block',
                  fontSize: 72,
                  lineHeight: 0.75,
                  color: '#D6CCC3',
                  fontFamily: 'Georgia, serif',
                  marginBottom: 18,
                  userSelect: 'none',
                }}
              >
                &ldquo;
              </span>

              {/* Quote text */}
              <p style={{ color: '#2C2420', fontSize: '1rem', lineHeight: 1.75, flex: 1 }}>
                {q.text}
              </p>

              {/* Source */}
              {q.source && (
                <p style={{
                  color: '#A89888',
                  fontSize: '0.7rem',
                  fontFamily: 'monospace',
                  letterSpacing: '0.05em',
                  marginTop: 22,
                }}>
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
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white flex items-center justify-center transition-all duration-200 hover:scale-110 disabled:opacity-0 disabled:pointer-events-none"
        style={{ boxShadow: '0 2px 14px rgba(0,0,0,0.12)', border: '1px solid #E8E1DB' }}
      >
        <ChevronRight size={18} style={{ color: '#5A4F49' }} />
      </button>

      {/* Dot indicators */}
      {max > 0 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          {Array.from({ length: max + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Stranica ${i + 1}`}
              className="rounded-full transition-all duration-300"
              style={{
                width:      i === current ? 22 : 7,
                height:     7,
                background: i === current ? '#8B1E3F' : '#D6CCC3',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
