'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Link, { useCurrentLocale } from '@/i18n/navigation'
import { LOCALE_INFO } from '@/i18n/config'
import { Search, BookOpen } from 'lucide-react'

interface IlahijaText {
  id: number
  title: string
  author?: string | null
}

const PAGE = 15

export default function IlahijaTekstoviSearch({ tekstovi }: { tekstovi: IlahijaText[] }) {
  const t = useTranslations('texts')
  const rtl = LOCALE_INFO[useCurrentLocale()].dir === 'rtl'
  const [query, setQuery]     = useState('')
  const [visible, setVisible] = useState(PAGE)

  useEffect(() => { setVisible(PAGE) }, [query])

  const filtered = query.trim()
    ? tekstovi.filter(tekst => tekst.title.toLowerCase().includes(query.toLowerCase()))
    : tekstovi
  const shown = filtered.slice(0, visible)

  return (
    <>
      {tekstovi.length > 0 && (
        <div className="relative mb-8">
          <Search size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-[var(--fg-a89888)] pointer-events-none" />
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder={t('list.searchByTitle')}
            className="w-full ps-9 pe-4 py-2.5 border border-[var(--line-d6ccc3)] bg-[var(--bg-ffffff)] focus:outline-none focus:border-[var(--line-8b1e3f)] text-sm transition-colors" />
        </div>
      )}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24"
          style={{ background: 'var(--bg-faf7f2)', border: '1px dashed var(--line-e8e1db)', borderRadius: 8 }}>
          <BookOpen size={40} className="mb-3" style={{ color: 'var(--fg-d6ccc3)' }} />
          <p className="font-mono text-sm" style={{ color: 'var(--fg-978a81)' }}>
            {query.trim() ? t('list.noResults', { query }) : t('ilahijePage.empty')}
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {shown.map(tekst => (
              <Link key={tekst.id} href={`/ilahije/tekstovi/${tekst.id}`} className="group block">
                <div className="flex items-center gap-4 px-6 py-5 transition-all group-hover:-translate-y-0.5"
                  style={{ background: 'var(--bg-faf7f2)', border: '1px solid var(--line-e8e1db)', borderRadius: 8 }}>
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: '#8B1E3F15' }}>
                    <BookOpen size={18} style={{ color: 'var(--fg-8b1e3f)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-base leading-snug group-hover:text-[var(--fg-8b1e3f)] transition-colors truncate"
                      style={{ color: 'var(--fg-241f1d)' }}>
                      {tekst.title}
                    </h2>
                    {tekst.author && <p className="text-sm mt-0.5" style={{ color: 'var(--fg-978a81)' }}>{tekst.author}</p>}
                  </div>
                  <span className="text-sm font-medium flex-shrink-0" style={{ color: 'var(--fg-8b1e3f)' }}>{`${t('list.read')} ${rtl ? '←' : '→'}`}</span>
                </div>
              </Link>
            ))}
          </div>
          {visible < filtered.length && (
            <div className="flex flex-col items-center gap-2 mt-8">
              <button onClick={() => setVisible(v => v + PAGE)}
                className="px-8 py-3 border border-[var(--line-d6ccc3)] text-[var(--fg-5a4f49)] text-sm font-medium hover:border-[var(--line-8b1e3f)] hover:text-[var(--fg-8b1e3f)] transition-colors">
                {t('list.loadMore', { count: filtered.length - visible })}
              </button>
              <p className="text-xs text-[var(--fg-a89888)]">{t('list.shown', { shown: shown.length, total: filtered.length })}</p>
            </div>
          )}
        </>
      )}
    </>
  )
}
