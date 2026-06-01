'use client'

import { useState, useEffect } from 'react'
import { Music2 } from 'lucide-react'
import VideoCard from '@/components/VideoCard'

interface Video {
  id: number; title: string; description: string | null
  platform: string; thumbnailUrl: string | null; isShortForm: boolean; createdAt: string
}

export default function IlahijePage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/videos?category=ilahije')
      .then(r => r.json()).then(d => { setVideos(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16" style={{ minHeight: '60vh' }}>
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-warm-900 tracking-tight mb-2">Ilahije i kaside</h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse" style={{ background: '#FAF7F2', border: '1px solid #E8E1DB', borderRadius: 8, overflow: 'hidden' }}>
              <div className="aspect-video bg-warm-200" />
              <div className="px-4 py-4 space-y-2">
                <div className="h-2.5 bg-warm-200 rounded w-24" />
                <div className="h-3.5 bg-warm-200 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24"
          style={{ background: '#FAF7F2', border: '1px dashed #E8E1DB', borderRadius: 8 }}>
          <Music2 size={40} className="mb-3" style={{ color: '#D6CCC3' }} />
          <p className="font-mono text-sm text-warm-400">Nema ilahija još uvijek</p>
        </div>
      ) : (
        <>
          <p className="font-mono text-[11px] text-warm-400 mb-5 tracking-wide">
            {videos.length} {videos.length === 1 ? 'snimak' : 'snimaka'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map(v => (
              <VideoCard key={v.id} id={v.id} title={v.title} description={v.description}
                platform={v.platform} thumbnailUrl={v.thumbnailUrl} isShortForm={v.isShortForm} createdAt={v.createdAt} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
