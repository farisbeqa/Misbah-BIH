'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookOpen, Calendar } from 'lucide-react'

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
  const [visible, setVisible] = useState(PAGE)
  const shown = price.slice(0, visible)

  return (
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
      {visible < price.length && (
        <div className="flex flex-col items-center gap-2 mt-10">
          <button onClick={() => setVisible(v => v + PAGE)}
            className="px-8 py-3 border border-[#D6CCC3] text-[#5a4f49] text-sm font-medium hover:border-[#8b1e3f] hover:text-[#8b1e3f] transition-colors">
            Učitaj još ({price.length - visible} preostalih)
          </button>
          <p className="text-xs text-[#a89888]">Prikazano {shown.length} od {price.length}</p>
        </div>
      )}
    </>
  )
}
