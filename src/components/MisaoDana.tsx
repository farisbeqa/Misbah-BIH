'use client'

import { useState } from 'react'

interface Quote { id: number; type: string; text: string; source: string | null }

function ArrowUp() {
  return (
    <svg fill="none" viewBox="0 0 9.196 11.92" style={{ width: 16, height: 16, display: 'block' }}>
      <path d="M4.59783 11.4094V0.51087M8.68478 4.59783L4.59783 0.51087L0.51087 4.59783"
        stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.02174" />
    </svg>
  )
}

function ArrowDown() {
  return (
    <svg fill="none" viewBox="0 0 9.196 11.92" style={{ width: 16, height: 16, display: 'block' }}>
      <path d="M4.59783 0.51087V11.4094M0.51087 7.32246L4.59783 11.4094L8.68478 7.32246"
        stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.02174" />
    </svg>
  )
}

export default function MisaoDana({ quotes }: { quotes: Quote[] }) {
  const [active, setActive] = useState(0)

  if (quotes.length === 0) return null

  const prev = () => setActive(a => (a - 1 + quotes.length) % quotes.length)
  const next = () => setActive(a => (a + 1) % quotes.length)

  return (
    <section className="bg-[#f5f2ef] w-full">
      <div className="px-5 md:px-10 lg:px-20 py-20 lg:py-[100px] flex flex-col gap-3">
        <p className="font-medium text-[#8b1e3f] text-base leading-normal">PODSJETNIK</p>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 items-start pt-4">
          {/* Left: heading + desc + arrows */}
          <div className="flex flex-col gap-8 lg:flex-1">
            <div className="flex flex-col gap-6">
              <h2
                className="font-semibold text-[#141110]"
                style={{ fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.3, letterSpacing: '-0.44px' }}
              >
                Misao dana
              </h2>
              <p
                className="font-normal text-[#746860]"
                style={{ fontSize: '18px', lineHeight: 1.5, letterSpacing: '-0.18px' }}
              >
                Misli iz Kur&apos;ana, hadisa i islamske tradicije koje podstiču na
                razmišljanje i djelovanje.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={prev}
                aria-label="Prethodna misao"
                className="bg-[#8b1e3f] p-3 hover:bg-[#7a1a37] transition-colors"
              >
                <ArrowUp />
              </button>
              <button
                onClick={next}
                aria-label="Sljedeća misao"
                className="bg-[#8b1e3f] p-3 hover:bg-[#7a1a37] transition-colors"
              >
                <ArrowDown />
              </button>
            </div>
          </div>

          {/* Right: indicator bars + quote card */}
          <div className="flex gap-7 lg:flex-1 max-w-[708px] w-full">
            {/* Vertical bars */}
            <div className="flex flex-col gap-4 pt-12 shrink-0">
              {quotes.map((_, i) => (
                <div
                  key={i}
                  onClick={() => setActive(i)}
                  className="w-1.5 cursor-pointer transition-colors"
                  style={{
                    flex: 1,
                    minHeight: 20,
                    backgroundColor: i === active ? '#8b1e3f' : 'white',
                  }}
                />
              ))}
            </div>

            {/* Quote card */}
            <div className="bg-white flex-1 overflow-hidden">
              <div className="flex flex-col gap-6 px-6 py-12">
                <p
                  className="font-normal text-[#8b1e3f] leading-[1.5]"
                  style={{ fontSize: 'clamp(18px, 2.5vw, 24px)', letterSpacing: '-0.24px' }}
                >
                  {quotes[active].text}
                </p>
                {quotes[active].source && (
                  <p
                    className="font-bold text-[#8b1e3f] leading-[1.5]"
                    style={{ fontSize: 'clamp(18px, 2.5vw, 24px)', letterSpacing: '-0.24px' }}
                  >
                    {quotes[active].source}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
