'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import VideoCard from '@/components/VideoCard'

interface Video {
  id: number; title: string; description: string | null; author?: string | null
  platform: string; thumbnailUrl: string | null; isShortForm: boolean; createdAt: string
}

const FILTERS = [
  { key: 'all',     label: 'Sve' },
  { key: 'youtube', label: 'YouTube' },
  { key: 'tiktok',  label: 'TikTok' },
  { key: 'upload',  label: 'Upload' },
]

export default function PodcastsPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    setLoading(true)
    const base = '/api/videos?category=podcast'
    const url  = filter === 'all' ? base : `${base}&platform=${filter}`
    fetch(url).then(r => r.json()).then(d => { setVideos(d); setLoading(false) }).catch(() => setLoading(false))
  }, [filter])

  const filtered = query.trim()
    ? videos.filter(v => v.title.toLowerCase().includes(query.toLowerCase()))
    : videos

  return (
    <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20 py-12 sm:py-16" style={{ minHeight: '60vh' }}>
      <div className="mb-12">
        <p className="font-medium text-[#8b1e3f] text-base mb-2">RAZGOVORI</p>
        <h1 className="font-semibold text-[#141110] mb-3"
          style={{ fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.3, letterSpacing: '-0.44px' }}>
          Podcast
        </h1>
        <p className="font-normal text-[#746860]" style={{ fontSize: 18 }}>
          Razgovori, intervjui i podcast epizode o vjeri i svakodnevnom životu.
        </p>
      </div>

      <div className="relative mb-6">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a89888] pointer-events-none" />
        <input value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Pretraži po naslovu..."
          className="w-full pl-9 pr-4 py-2.5 border border-[#D6CCC3] bg-white focus:outline-none focus:border-[#8b1e3f] text-sm transition-colors" />
      </div>

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
          <p className="text-sm text-[#a89888]">
            {query.trim() ? `Nema rezultata za "${query}"` : 'Nema podcast epizoda još uvijek'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(v => (
            <VideoCard key={v.id} id={v.id} title={v.title} description={v.description}
              author={v.author} platform={v.platform} thumbnailUrl={v.thumbnailUrl}
              isShortForm={v.isShortForm} createdAt={v.createdAt} />
          ))}
        </div>
      )}
    </div>
  )
}
