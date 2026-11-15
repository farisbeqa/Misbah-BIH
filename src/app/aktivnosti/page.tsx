'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Link, { useCurrentLocale } from '@/i18n/navigation'
import { formatShortDate } from '@/i18n/format'
import { Calendar, MapPin } from 'lucide-react'

interface Activity {
  id: number; title: string; content: string; imageUrl: string | null
  videoUrl: string | null; date: string; tag: string
}

const TAGS = ['vijesti', 'novosti', 'aktivnosti']
const FILTERS = ['all', ...TAGS]
const PAGE = 12

export default function AktivnostiPage() {
  const t = useTranslations('community.activities')
  const locale = useCurrentLocale()
  const [activities, setActivities] = useState<Activity[]>([])
  const [filter, setFilter]         = useState('all')
  const [loading, setLoading]       = useState(true)
  const [visible, setVisible]       = useState(PAGE)

  useEffect(() => {
    let current = true
    fetch(`/api/activities?lang=${locale}`)
      .then(r => r.json())
      .then(d => { if (current) { setActivities(d); setLoading(false) } })
      .catch(() => { if (current) setLoading(false) })
    return () => { current = false }
  }, [locale])

  useEffect(() => { setVisible(PAGE) }, [filter])

  const filtered = filter === 'all' ? activities : activities.filter(a => a.tag === filter)
  const shown    = filtered.slice(0, visible)

  return (
    <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20 py-12 sm:py-16">
      <div className="mb-10">
        <p className="font-medium text-[var(--fg-8b1e3f)] text-base mb-2">{t('tag')}</p>
        <h1 className="font-semibold text-[var(--fg-141110)] mb-3"
          style={{ fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.3, letterSpacing: '-0.44px' }}>
          {t('title')}
        </h1>
        <p className="font-normal text-[var(--fg-746860)]" style={{ fontSize: 18 }}>
          {t('intro')}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-10">
        {FILTERS.map(key => (
          <button key={key} onClick={() => setFilter(key)}
            className="text-sm font-medium px-4 py-2 transition-all"
            style={{
              border: filter === key ? 'none' : '1px solid var(--line-d6ccc3)',
              background: filter === key ? 'var(--bg-8b1e3f)' : 'var(--bg-ffffff)',
              color: filter === key ? 'var(--fg-ffffff)' : 'var(--fg-5a4f49)',
            }}>
            {key === 'all' ? t('filterAll') : t(`tags.${key}`)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-[var(--bg-f5f2ef)] overflow-hidden border border-[var(--line-black5)]">
              <div className="h-[228px] bg-[var(--bg-e0d8d0)]" />
              <div className="px-6 py-7 space-y-3">
                <div className="h-2.5 bg-[var(--bg-e0d8d0)] rounded w-24" />
                <div className="h-5 bg-[var(--bg-e0d8d0)] rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex items-center justify-center py-20 bg-[var(--bg-f5f2ef)] border border-[var(--line-black5)]">
          <p className="text-sm text-[var(--fg-a89888)]">{t('empty')}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {shown.map(a => (
              <Link key={a.id} href={`/aktivnosti/${a.id}`} className="group block h-full">
                <div className="bg-[var(--bg-f5f2ef)] overflow-hidden border border-[var(--line-black5)] flex flex-col h-full">
                  <div className="relative h-[228px] w-full shrink-0 overflow-hidden">
                    {a.videoUrl
                      ? <video src={a.videoUrl} className="absolute inset-0 w-full h-full object-cover" muted playsInline />
                      : a.imageUrl
                      ? <img src={a.imageUrl} alt={a.title} loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      : <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg,var(--bg-8b1e3f),var(--bg-5e1028))' }}>
                          <MapPin size={36} className="text-white/40" />
                        </div>
                    }
                    <div className="absolute top-4 start-4 bg-[var(--bg-faf5f5)] px-2.5 py-1.5">
                      <span className="text-[var(--fg-8b1e3f)] uppercase" style={{ fontSize: 10, letterSpacing: '0.3px' }}>
                        {TAGS.includes(a.tag) ? t(`tags.${a.tag}`) : a.tag}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2.5 px-6 py-7 flex-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={10} style={{ color: 'var(--fg-8b1e3f)' }} />
                      <p className="font-medium text-[var(--fg-8b1e3f)] text-xs uppercase tracking-wide">{formatShortDate(a.date, locale)}</p>
                    </div>
                    <p className="font-medium text-[var(--fg-241f1d)] leading-[1.12] line-clamp-2 group-hover:text-[var(--fg-8b1e3f)] transition-colors"
                      style={{ fontSize: 20, letterSpacing: '-0.6px' }}>
                      {a.title}
                    </p>
                    <p className="font-normal text-[var(--fg-5a4f49)] text-base leading-normal line-clamp-3 mt-auto">
                      {a.content.replace(/\n+/g, ' ').trim()}
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
                {t('loadMore', { count: filtered.length - visible })}
              </button>
              <p className="text-xs text-[var(--fg-a89888)]">{t('shownOf', { shown: shown.length, total: filtered.length })}</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
