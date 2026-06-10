'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, BookOpen } from 'lucide-react'

interface DuaText {
  id: number
  title: string
  author?: string | null
  category: string
}

const FILTERS = [
  { value: 'sve',      label: 'Sve' },
  { value: 'kuransko', label: "Kur'anske dove" },
]

export default function DuaTekstoviSearch({ tekstovi }: { tekstovi: DuaText[] }) {
  const [query, setQuery]     = useState('')
  const [filter, setFilter]   = useState('sve')

  const filtered = tekstovi
    .filter(t => filter === 'sve' || t.category === filter)
    .filter(t => !query.trim() || t.title.toLowerCase().includes(query.toLowerCase()))

  return (
    <>
      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {FILTERS.map(f => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className={`px-4 py-2 text-sm font-medium transition-colors border ${
              filter === f.value
                ? 'bg-[#1D4ED8] text-white border-[#1D4ED8]'
                : 'bg-white text-[#5a4f49] border-[#D6CCC3] hover:border-[#1D4ED8]'
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      {tekstovi.length > 0 && (
        <div className="relative mb-8">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a89888] pointer-events-none" />
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Pretraži po naslovu..."
            className="w-full pl-9 pr-4 py-2.5 border border-[#D6CCC3] bg-white focus:outline-none focus:border-[#8b1e3f] text-sm transition-colors" />
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24"
          style={{ background: '#FAF7F2', border: '1px dashed #E8E1DB', borderRadius: 8 }}>
          <BookOpen size={40} className="mb-3" style={{ color: '#D6CCC3' }} />
          <p className="font-mono text-sm" style={{ color: '#978A81' }}>
            {query.trim() ? `Nema rezultata za "${query}"` : 'Nema tekstova dova još uvijek'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(t => (
            <Link key={t.id} href={`/zikrovi/tekstovi/${t.id}`} className="group block">
              <div className="flex items-center gap-4 px-6 py-5 transition-all group-hover:-translate-y-0.5"
                style={{ background: '#FAF7F2', border: '1px solid #E8E1DB', borderRadius: 8 }}>
                <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: '#1D4ED815' }}>
                  <BookOpen size={18} style={{ color: '#1D4ED8' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-base leading-snug group-hover:text-brand transition-colors truncate"
                    style={{ color: '#241F1D' }}>
                    {t.title}
                  </h2>
                  {t.author && <p className="text-sm mt-0.5" style={{ color: '#978A81' }}>{t.author}</p>}
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {t.category === 'kuransko' && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      Kur&apos;anska
                    </span>
                  )}
                  <span className="text-sm font-medium" style={{ color: '#1D4ED8' }}>Čitaj →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
