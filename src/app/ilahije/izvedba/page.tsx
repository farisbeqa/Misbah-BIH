'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Search } from 'lucide-react'
import { useCurrentLocale } from '@/i18n/navigation'
import VideoCard from '@/components/VideoCard'

interface Video {
  id: number; title: string; description: string | null; author?: string | null
  platform: string; thumbnailUrl: string | null; isShortForm: boolean; createdAt: string
}

const PAGE = 12

export default function IlahijeIzvedbaPage() {
  const t = useTranslations('videos')
  const locale = useCurrentLocale()
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery]   = useState('')
  const [visible, setVisible] = useState(PAGE)

  useEffect(() => {
    fetch(`/api/videos?category=ilahije&lang=${locale}`)
      .then(r => r.json()).then(d => { setVideos(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [locale])

  useEffect(() => { setVisible(PAGE) }, [query])

  const filtered = query.trim()
    ? videos.filter(v => v.title.toLowerCase().includes(query.toLowerCase()))
    : videos
  const shown = filtered.slice(0, visible)

  return (
    <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20 py-12 sm:py-16" style={{ minHeight: '60vh' }}>
      <div className="mb-12">
        <p className="font-medium text-[var(--fg-8b1e3f)] text-base mb-2">{t('ilahije.tag')}</p>
        <h1 className="font-semibold text-[var(--fg-141110)] mb-3"
          style={{ fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.3, letterSpacing: '-0.44px' }}>
          {t('ilahije.title')}
        </h1>
        <p className="font-normal text-[var(--fg-746860)]" style={{ fontSize: 18 }}>
          {t('ilahije.text')}
        </p>
      </div>

      <div className="relative mb-8">
        <Search size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-[var(--fg-a89888)] pointer-events-none" />
        <input value={query} onChange={e => setQuery(e.target.value)}
          placeholder={t('list.searchPlaceholder')}
          className="w-full ps-9 pe-4 py-2.5 border border-[var(--line-d6ccc3)] bg-[var(--bg-ffffff)] focus:outline-none focus:border-[var(--line-8b1e3f)] text-sm transition-colors" />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
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
          <p className="text-sm text-[var(--fg-a89888)]">
            {query.trim() ? t('list.noResults', { query }) : t('ilahije.empty')}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {shown.map(v => (
              <VideoCard key={v.id} id={v.id} title={v.title} description={v.description}
                author={v.author} platform={v.platform} thumbnailUrl={v.thumbnailUrl}
                isShortForm={v.isShortForm} createdAt={v.createdAt} />
            ))}
          </div>
          {visible < filtered.length && (
            <div className="flex flex-col items-center gap-2 mt-10">
              <button onClick={() => setVisible(v => v + PAGE)}
                className="px-8 py-3 border border-[var(--line-d6ccc3)] text-[var(--fg-5a4f49)] text-sm font-medium hover:border-[var(--line-8b1e3f)] hover:text-[var(--fg-8b1e3f)] transition-colors">
                {t('list.loadMore', { remaining: filtered.length - visible })}
              </button>
              <p className="text-xs text-[var(--fg-a89888)]">{t('list.shownOf', { shown: shown.length, total: filtered.length })}</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
