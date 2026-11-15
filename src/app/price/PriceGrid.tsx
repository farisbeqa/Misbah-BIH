'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Link, { useCurrentLocale } from '@/i18n/navigation'
import { formatShortDate } from '@/i18n/format'
import { BookOpen, Calendar, Search } from 'lucide-react'

interface Prica {
  id: number; title: string; content: string; author: string | null
  imageUrl: string | null; createdAt: Date | string
}

const PAGE = 12

export default function PriceGrid({ price }: { price: Prica[] }) {
  const t = useTranslations('blog')
  const locale = useCurrentLocale()
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
          <Search size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-[var(--fg-a89888)] pointer-events-none" />
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder={t('list.searchByTitleOrAuthor')}
            className="w-full ps-9 pe-4 py-2.5 border border-[var(--line-d6ccc3)] bg-[var(--bg-ffffff)] focus:outline-none focus:border-[var(--line-8b1e3f)] text-sm transition-colors" />
        </div>
      )}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-[var(--bg-f5f2ef)] border border-[var(--line-black5)]">
          <BookOpen size={36} className="text-[var(--fg-d6ccc3)] mb-3" />
          <p className="text-sm text-[var(--fg-a89888)]">
            {query.trim() ? t('list.noResults', { query }) : t('storiesPage.empty')}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {shown.map(prica => (
              <Link key={prica.id} href={`/price/${prica.id}`} className="group block h-full">
                <div className="bg-[var(--bg-f5f2ef)] overflow-hidden border border-[var(--line-black5)] flex flex-col h-full">
                  <div className="relative h-[228px] w-full shrink-0 overflow-hidden">
                    {prica.imageUrl
                      ? <img src={prica.imageUrl} alt={prica.title} loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      : <div className="absolute inset-0 flex items-center justify-center"
                          style={{ background: 'linear-gradient(135deg,var(--bg-8b1e3f),var(--bg-5a1429))' }}>
                          <BookOpen size={36} className="text-white/30" />
                        </div>
                    }
                  </div>
                  <div className="flex flex-col gap-2.5 px-6 py-7 flex-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={10} style={{ color: 'var(--fg-8b1e3f)' }} />
                      <p className="font-medium text-[var(--fg-8b1e3f)] text-xs uppercase tracking-wide">{formatShortDate(prica.createdAt, locale)}</p>
                    </div>
                    <p className="font-medium text-[var(--fg-241f1d)] leading-[1.12] line-clamp-2 group-hover:text-[var(--fg-8b1e3f)] transition-colors"
                      style={{ fontSize: 20, letterSpacing: '-0.6px' }}>
                      {prica.title}
                    </p>
                    {prica.author && (
                      <p className="font-normal text-[var(--fg-5a4f49)] text-base leading-normal">{prica.author}</p>
                    )}
                    <p className="font-normal text-[var(--fg-5a4f49)] text-sm leading-normal line-clamp-3 mt-auto">
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
