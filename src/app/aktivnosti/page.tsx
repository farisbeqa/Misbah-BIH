'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, MapPin } from 'lucide-react'

interface Activity {
  id: number; title: string; content: string; imageUrl: string | null
  videoUrl: string | null; date: string; tag: string
}

const MONTHS = ['jan','feb','mar','apr','maj','jun','jul','aug','sep','okt','nov','dec']
function fmt(d: string) {
  const dt = new Date(d)
  return `${dt.getDate()}. ${MONTHS[dt.getMonth()]} ${dt.getFullYear()}.`
}

const FILTERS = [
  { key: 'all',        label: 'Sve' },
  { key: 'vijesti',    label: 'Vijesti' },
  { key: 'novosti',    label: 'Novosti' },
  { key: 'aktivnosti', label: 'Aktivnosti' },
]

const TAG_LABELS: Record<string, string> = { vijesti: 'Vijesti', novosti: 'Novosti', aktivnosti: 'Aktivnosti' }

export default function AktivnostiPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/activities')
      .then(r => r.json())
      .then(d => { setActivities(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? activities : activities.filter(a => a.tag === filter)

  return (
    <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20 py-12 sm:py-16">
      <div className="mb-10">
        <p className="font-medium text-[#8b1e3f] text-base mb-2">ZAJEDNICA</p>
        <h1 className="font-semibold text-[#141110] mb-3"
          style={{ fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.3, letterSpacing: '-0.44px' }}>
          Aktivnosti
        </h1>
        <p className="font-normal text-[#746860]" style={{ fontSize: 18 }}>
          Vijesti, novosti i aktivnosti zajednice — kvizovi, radionice, posjete i druženja.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-10">
        {FILTERS.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className="text-sm font-medium px-4 py-2 transition-all"
            style={{
              border: filter === f.key ? 'none' : '1px solid #D6CCC3',
              background: filter === f.key ? '#8B1E3F' : 'white',
              color: filter === f.key ? '#fff' : '#5A4F49',
            }}>
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-[#f5f2ef] overflow-hidden border border-black/5">
              <div className="h-[228px] bg-[#e0d8d0]" />
              <div className="px-6 py-7 space-y-3">
                <div className="h-2.5 bg-[#e0d8d0] rounded w-24" />
                <div className="h-5 bg-[#e0d8d0] rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex items-center justify-center py-20 bg-[#f5f2ef] border border-black/5">
          <p className="text-sm text-[#a89888]">Nema stavki u ovoj kategoriji</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(a => (
            <Link key={a.id} href={`/aktivnosti/${a.id}`} className="group block h-full">
              <div className="bg-[#f5f2ef] overflow-hidden border border-black/5 flex flex-col h-full">
                <div className="relative h-[228px] w-full shrink-0 overflow-hidden">
                  {a.videoUrl
                    ? <video src={a.videoUrl} className="absolute inset-0 w-full h-full object-cover" muted playsInline />
                    : a.imageUrl
                    ? <img src={a.imageUrl} alt={a.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    : <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#8B1E3F,#5E1028)' }}>
                        <MapPin size={36} className="text-white/40" />
                      </div>
                  }
                  {/* Tag pill */}
                  <div className="absolute top-4 left-4 bg-[#faf5f5] px-2.5 py-1.5">
                    <span className="text-[#8b1e3f] uppercase" style={{ fontSize: 10, letterSpacing: '0.3px' }}>
                      {TAG_LABELS[a.tag] ?? a.tag}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2.5 px-6 py-7 flex-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={10} style={{ color: '#8B1E3F' }} />
                    <p className="font-medium text-[#8b1e3f] text-xs uppercase tracking-wide">{fmt(a.date)}</p>
                  </div>
                  <p className="font-medium text-[#241f1d] leading-[1.12] line-clamp-2 group-hover:text-[#8b1e3f] transition-colors"
                    style={{ fontSize: 20, letterSpacing: '-0.6px' }}>
                    {a.title}
                  </p>
                  <p className="font-normal text-[#5a4f49] text-base leading-normal line-clamp-3 mt-auto">
                    {a.content.replace(/\n+/g, ' ').trim()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
