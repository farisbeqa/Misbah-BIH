'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, BookOpen } from 'lucide-react'

interface IlahijaText {
  id: number
  title: string
  author?: string | null
}

const PAGE = 15

export default function IlahijaTekstoviSearch({ tekstovi }: { tekstovi: IlahijaText[] }) {
  const [query, setQuery]     = useState('')
  const [visible, setVisible] = useState(PAGE)

  useEffect(() => { setVisible(PAGE) }, [query])

  const filtered = query.trim()
    ? tekstovi.filter(t => t.title.toLowerCase().includes(query.toLowerCase()))
    : tekstovi
  const shown = filtered.slice(0, visible)

  return (
    <>
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
            {query.trim() ? `Nema rezultata za "${query}"` : 'Nema tekstova još uvijek'}
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {shown.map(t => (
              <Link key={t.id} href={`/ilahije/tekstovi/${t.id}`} className="group block">
                <div className="flex items-center gap-4 px-6 py-5 transition-all group-hover:-translate-y-0.5"
                  style={{ background: '#FAF7F2', border: '1px solid #E8E1DB', borderRadius: 8 }}>
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: '#8B1E3F15' }}>
                    <BookOpen size={18} style={{ color: '#8B1E3F' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-base leading-snug group-hover:text-brand transition-colors truncate"
                      style={{ color: '#241F1D' }}>
                      {t.title}
                    </h2>
                    {t.author && <p className="text-sm mt-0.5" style={{ color: '#978A81' }}>{t.author}</p>}
                  </div>
                  <span className="text-sm font-medium flex-shrink-0" style={{ color: '#8B1E3F' }}>Čitaj →</span>
                </div>
              </Link>
            ))}
          </div>
          {visible < filtered.length && (
            <div className="flex flex-col items-center gap-2 mt-8">
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
