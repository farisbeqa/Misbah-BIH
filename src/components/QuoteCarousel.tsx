'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Quote { id: number; type: string; text: string; source: string | null }

const GAP        = 24
const AUTO_DELAY = 5000

export default function QuoteCarousel({ quotes }: { quotes: Quote[] }) {
  const [perPage, setPerPage] = useState(3)
  const [current, setCurrent] = useState(0)
  const [noAnim,  setNoAnim]  = useState(false)
  const [step,    setStep]    = useState(0)

  const pausedRef    = useRef(false)
  const currentRef   = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => { currentRef.current = current }, [current])

  useEffect(() => {
    const update = () => setPerPage(window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    const measure = () => {
      const card = containerRef.current?.querySelector('[data-card]') as HTMLElement | null
      if (card) setStep(card.offsetWidth + GAP)
    }
    const id = requestAnimationFrame(measure)
    window.addEventListener('resize', measure)
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', measure) }
  }, [perPage])

  const max = Math.max(0, quotes.length - perPage)
  useEffect(() => { setCurrent(c => Math.min(c, max)) }, [max])

  // Auto-play: refs used for paused/current to avoid stale closures without restarting the timer
  useEffect(() => {
    if (quotes.length <= perPage || max === 0) return
    const id = setInterval(() => {
      if (pausedRef.current) return
      if (currentRef.current >= max) {
        // Batch noAnim + position so React renders them together (no animated jump back)
        setNoAnim(true)
        setCurrent(0)
        requestAnimationFrame(() => requestAnimationFrame(() => setNoAnim(false)))
      } else {
        setCurrent(c => c + 1)
      }
    }, AUTO_DELAY)
    return () => clearInterval(id)
  }, [quotes.length, perPage, max])

  const go = (dir: -1 | 1) => {
    setNoAnim(false)
    setCurrent(c => Math.max(0, Math.min(c + dir, max)))
  }

  if (quotes.length === 0) return null

  const focusIdx  = current + (perPage === 3 ? 1 : 0)
  const cardWidth = `calc(${100 / perPage}% - ${GAP * (perPage - 1) / perPage}px)`

  return (
    <div
      className="relative px-10 sm:px-14"
      onMouseEnter={() => { pausedRef.current = true }}
      onMouseLeave={() => { pausedRef.current = false }}
    >
      {/* Left arrow */}
      <button
        onClick={() => go(-1)}
        disabled={current === 0}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white flex items-center justify-center transition-all duration-200 hover:scale-110 disabled:opacity-0 disabled:pointer-events-none"
        style={{ boxShadow: '0 2px 14px rgba(0,0,0,0.12)', border: '1px solid #E8E1DB' }}
      >
        <ChevronLeft size={18} style={{ color: '#5A4F49' }} />
      </button>

      {/* Card track — py-8 gives room for center-card shadow to not clip */}
      <div ref={containerRef} className="overflow-hidden py-8">
        <div
          style={{
            display:    'flex',
            flexWrap:   'nowrap',
            gap:        GAP,
            alignItems: 'center',
            transform:  step ? `translateX(-${current * step}px)` : 'none',
            transition: noAnim ? 'none' : 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        >
          {quotes.map((q, idx) => {
            const isCenter  = idx === focusIdx
            const isVisible = idx >= current && idx < current + perPage
            const isDimmed  = perPage === 3 && isVisible && !isCenter

            return (
              <div
                key={q.id}
                data-card
                style={{
                  flexShrink:    0,
                  flexGrow:      0,
                  width:         cardWidth,
                  boxSizing:     'border-box',
                  background:    '#FFFFFF',
                  border:        isCenter && perPage === 3
                    ? '1.5px solid #CFC5BB'
                    : '1px solid #EDE8E2',
                  borderRadius:  20,
                  padding:       '44px 36px 36px',
                  display:       'flex',
                  flexDirection: 'column',
                  minHeight:     260,
                  position:      'relative',
                  zIndex:        isCenter && perPage === 3 ? 2 : 1,
                  opacity:       isDimmed ? 0.48 : 1,
                  transform:     isDimmed ? 'scale(0.90)' : 'scale(1)',
                  boxShadow:     isCenter && perPage === 3
                    ? '0 24px 64px rgba(139,30,63,0.10), 0 6px 20px rgba(0,0,0,0.08)'
                    : '0 1px 4px rgba(0,0,0,0.03)',
                  transition:    'opacity 0.5s ease, transform 0.5s ease, box-shadow 0.5s ease',
                }}
              >
                {/* Decorative quote mark */}
                <span
                  aria-hidden="true"
                  style={{
                    display:      'block',
                    fontSize:     76,
                    lineHeight:   0.6,
                    color:        isCenter && perPage === 3 ? '#8B1E3F' : '#CBBFB8',
                    fontFamily:   'Georgia, "Times New Roman", serif',
                    marginBottom: 20,
                    userSelect:   'none',
                    opacity:      isCenter && perPage === 3 ? 0.28 : 0.9,
                  }}
                >
                  &ldquo;
                </span>

                <p style={{
                  color:      '#2C2420',
                  fontSize:   '0.97rem',
                  lineHeight: 1.88,
                  flex:       1,
                  fontStyle:  'italic',
                }}>
                  {q.text}
                </p>

                {q.source && (
                  <p style={{
                    color:         '#8B1E3F',
                    fontSize:      '0.67rem',
                    letterSpacing: '0.09em',
                    textTransform: 'uppercase',
                    fontWeight:    600,
                    marginTop:     22,
                  }}>
                    — {q.source}
                  </p>
                )}
              </div>
            )
          })}
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
        <div className="flex justify-center items-center gap-2 mt-4">
          {Array.from({ length: max + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => { setNoAnim(false); setCurrent(i) }}
              aria-label={`Stranica ${i + 1}`}
              className="rounded-full transition-all duration-300"
              style={{
                width:      i === current ? 24 : 7,
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
