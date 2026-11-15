'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Link, { useCurrentLocale } from '@/i18n/navigation'
import { LOCALE_INFO } from '@/i18n/config'
import { Search, BookOpen } from 'lucide-react'

interface DuaText {
  id: number
  title: string
  author?: string | null
  category: string
}

// value: category in the database; key: label in texts.duasPage.filters
const FILTERS = [
  { value: 'sve',      key: 'all' },
  { value: 'kuransko', key: 'kuransko' },
]

const PAGE = 15

export default function DuaTekstoviSearch({ tekstovi }: { tekstovi: DuaText[] }) {
  const t = useTranslations('texts')
  const rtl = LOCALE_INFO[useCurrentLocale()].dir === 'rtl'
  const [query, setQuery]     = useState('')
  const [filter, setFilter]   = useState('sve')
  const [visible, setVisible] = useState(PAGE)

  useEffect(() => { setVisible(PAGE) }, [query, filter])

  const filtered = tekstovi
    .filter(tekst => filter === 'sve' || tekst.category === filter)
    .filter(tekst => !query.trim() || tekst.title.toLowerCase().includes(query.toLowerCase()))
  const shown = filtered.slice(0, visible)

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
            {t(`duasPage.filters.${f.key}`)}
          </button>
        ))}
      </div>

      {tekstovi.length > 0 && (
        <div className="relative mb-8">
          <Search size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-[#a89888] pointer-events-none" />
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder={t('list.searchByTitle')}
            className="w-full ps-9 pe-4 py-2.5 border border-[#D6CCC3] bg-white focus:outline-none focus:border-[#8b1e3f] text-sm transition-colors" />
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24"
          style={{ background: '#FAF7F2', border: '1px dashed #E8E1DB', borderRadius: 8 }}>
          <BookOpen size={40} className="mb-3" style={{ color: '#D6CCC3' }} />
          <p className="font-mono text-sm" style={{ color: '#978A81' }}>
            {query.trim() ? t('list.noResults', { query }) : t('duasPage.empty')}
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {shown.map(tekst => (
              <Link key={tekst.id} href={`/zikrovi/tekstovi/${tekst.id}`} className="group block">
                <div className="flex items-center gap-4 px-6 py-5 transition-all group-hover:-translate-y-0.5"
                  style={{ background: '#FAF7F2', border: '1px solid #E8E1DB', borderRadius: 8 }}>
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: '#1D4ED815' }}>
                    <BookOpen size={18} style={{ color: '#1D4ED8' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-base leading-snug group-hover:text-brand transition-colors truncate"
                      style={{ color: '#241F1D' }}>
                      {tekst.title}
                    </h2>
                    {tekst.author && <p className="text-sm mt-0.5" style={{ color: '#978A81' }}>{tekst.author}</p>}
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {tekst.category === 'kuransko' && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        {t('duasPage.badges.kuransko')}
                      </span>
                    )}
                    <span className="text-sm font-medium" style={{ color: '#1D4ED8' }}>{`${t('list.read')} ${rtl ? '←' : '→'}`}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {visible < filtered.length && (
            <div className="flex flex-col items-center gap-2 mt-8">
              <button onClick={() => setVisible(v => v + PAGE)}
                className="px-8 py-3 border border-[#D6CCC3] text-[#5a4f49] text-sm font-medium hover:border-[#8b1e3f] hover:text-[#8b1e3f] transition-colors">
                {t('list.loadMore', { count: filtered.length - visible })}
              </button>
              <p className="text-xs text-[#a89888]">{t('list.shown', { shown: shown.length, total: filtered.length })}</p>
            </div>
          )}
        </>
      )}
    </>
  )
}
