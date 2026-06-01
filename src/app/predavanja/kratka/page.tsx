'use client'

import { useState, useEffect } from 'react'
import { Play } from 'lucide-react'
import VideoCard from '@/components/VideoCard'

interface Video {
  id: number; title: string; description: string | null
  platform: string; thumbnailUrl: string | null; isShortForm: boolean; createdAt: string
}

const TOPICS = [
  { key: 'all',       label: 'Sve' },
  { key: 'tefsir',    label: 'Tefsir' },
  { key: 'sira',      label: 'Sira' },
  { key: 'opste',     label: 'Opšte teme' },
  { key: 'akida',     label: 'Akida' },
  { key: 'fikh',      label: 'Fikh' },
  { key: 'historija', label: 'Historija' },
]

export default function KratkaPredavanjaPage() {
  const [videos, setVideos]   = useState<Video[]>([])
  const [topic, setTopic]     = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const base = '/api/videos?category=predavanja&isShortForm=true'
    const url  = topic === 'all' ? base : `${base}&topic=${topic}`
    fetch(url).then(r => r.json()).then(d => { setVideos(d); setLoading(false) }).catch(() => setLoading(false))
  }, [topic])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16" style={{ minHeight: '60vh' }}>
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-warm-900 tracking-tight mb-2">Kratka predavanja</h1>
      </div>

      {/* Topic filters */}
      <div className="flex flex-wrap gap-2 mb-10">
        {TOPICS.map(t => (
          <button key={t.key} onClick={() => setTopic(t.key)}
            className="font-mono text-xs px-4 py-2 transition-all"
            style={{
              borderRadius: 6,
              border: topic === t.key ? 'none' : '1px solid #D6CCC3',
              background: topic === t.key ? '#8B1E3F' : '#EDE5DC',
              color: topic === t.key ? '#fff' : '#5A4F49',
              fontWeight: topic === t.key ? 600 : 400,
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse" style={{ background: '#FAF7F2', border: '1px solid #E8E1DB', borderRadius: 8, overflow: 'hidden' }}>
              <div className="m-2 aspect-video bg-warm-200" style={{ borderRadius: 4 }} />
              <div className="px-4 pt-3 pb-4 space-y-2">
                <div className="h-2.5 bg-warm-200 rounded w-24" />
                <div className="h-3.5 bg-warm-200 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-warm-400"
          style={{ background: '#FAF7F2', border: '1px dashed #E8E1DB', borderRadius: 8 }}>
          <Play size={40} className="text-warm-300 mb-3" />
          <p className="font-mono text-sm text-warm-400">Nema kratkih predavanja u ovoj kategoriji</p>
        </div>
      ) : (
        <>
          <p className="font-mono text-[11px] text-warm-400 mb-5 tracking-wide">
            {videos.length} {videos.length === 1 ? 'predavanje' : 'predavanja'}
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
