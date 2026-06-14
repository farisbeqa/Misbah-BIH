'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BookOpen, Calendar, Search } from 'lucide-react'

interface Prica {
  id: number; title: string; content: string; author: string | null
  imageUrl: string | null; createdAt: Date | string
}

const MONTHS = ['jan','feb','mar','apr','maj','jun','jul','aug','sep','okt','nov','dec']
function fmt(d: Date | string) {
  const dt = new Date(d)
  return `${dt.getDate()}. ${MONTHS[dt.getMonth()]} ${dt.getFullYear()}.`
}

const PAGE = 12

export default function PriceGrid({ price }: { price: Prica[] }) {
  const [query, setQuery] = useState('')
  const [visible, setVisible] = useState(PAGE)

  useEffect(() => { setVisible(PAGE) }, [query])

  const filtered = query.trim()
    ? price.filter(p =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        (p.author ?? '').toLowerCase().includes(query.toLowerCase()))
    : price
  const shown = filtered.slice(0, visible)

  return (
    <>
      {price.length > 0 && (
        <div className="relative mb-8">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a89888] pointer-events-none" />
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Pretraži po naslovu ili autoru..."
            className="w-full pl-9 pr-4 py-2.5 border border-[#D6CCC3] bg-white focus:outline-none focus:border-[#8b1e3f] text-sm transition-colors" />
        </div>
      )}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-[#f5f2ef] border border-black/5">
          <BookOpen size={36} className="text-[#D6CCC3] mb-3" />
          <p className="text-sm text-[#a89888]">
            {query.trim() ? `Nema rezultata za "${query}"` : 'Nema priča još uvijek'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {shown.map(prica => (
              <Link key={prica.id} href={`/price/${prica.id}`} className="group block h-full">
                <div className="bg-[#f5f2ef] overflow-hidden border border-black/5 flex flex-col h-full">
                  <div className="relative h-[228px] w-full shrink-0 overflow-hidden">
                    {prica.imageUrl
                      ? <img src={prica.imageUrl} alt={prica.title} loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      : <div className="absolute inset-0 flex items-center justify-center"
                          style={{ background: 'linear-gradient(135deg,#8B1E3F,#5a1429)' }}>
                          <BookOpen size={36} className="text-white/30" />
                        </div>
                    }
                  </div>
                  <div className="flex flex-col gap-2.5 px-6 py-7 flex-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={10} style={{ color: '#8B1E3F' }} />
                      <p className="font-medium text-[#8b1e3f] text-xs uppercase tracking-wide">{fmt(prica.createdAt)}</p>
                    </div>
                    <p className="font-medium text-[#241f1d] leading-[1.12] line-clamp-2 group-hover:text-[#8b1e3f] transition-colors"
                      style={{ fontSize: 20, letterSpacing: '-0.6px' }}>
                      {prica.title}
                    </p>
                    {prica.author && (
                      <p className="font-normal text-[#5a4f49] text-base leading-normal">{prica.author}</p>
                    )}
                    <p className="font-normal text-[#5a4f49] text-sm leading-normal line-clamp-3 mt-auto">
                      {prica.content.replace(/\n+/g, ' ').trim()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {visible < filtered.length && (
            <div className="flex flex-col items-center gap-2 mt-10">
              <button onClick={() => setVisible(v => v + PAGE)}
                className="px-8 py-3 border border-[#D6CCC3] text-[#5a4f49] text-sm font-medium hover:border-[#8b1e3f] hover:text-[#8b1e3f] transition-colors">
                Učitaj još ({filtered.length - visible} preostalih)
              </button>
              <p className="text-xs text-[#a89888]">Prikazano {shown.length} od {filtered.length}</p>
            </div>
          )}
        </>
      )}
    </>
  )
}
