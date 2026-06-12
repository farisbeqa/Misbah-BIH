'use client'

import { useState, useEffect } from 'react'
import VideoCard from '@/components/VideoCard'

interface Video {
  id: number; title: string; description: string | null; author?: string | null
  platform: string; thumbnailUrl: string | null; isShortForm: boolean; createdAt: string
}

const TOPICS = [
  { key: 'all',       label: 'Sve' },
  { key: 'tefsir',    label: 'Tefsir' },
  { key: 'hadis',     label: 'Hadis' },
  { key: 'sira',      label: 'Sira' },
  { key: 'opste',     label: 'Opšte teme' },
  { key: 'akaid',     label: 'Akaid' },
  { key: 'fikh',      label: 'Fikh' },
  { key: 'duhovnost', label: 'Duhovnost' },
  { key: 'historija', label: 'Historija' },
]

const PAGE = 12

export default function KratkaPredavanjaPage() {
  const [videos, setVideos]   = useState<Video[]>([])
  const [topic, setTopic]     = useState('all')
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(PAGE)

  useEffect(() => {
    setLoading(true)
    const base = '/api/videos?category=predavanja&isShortForm=true'
    const url  = topic === 'all' ? base : `${base}&topic=${topic}`
    fetch(url).then(r => r.json()).then(d => { setVideos(d); setLoading(false) }).catch(() => setLoading(false))
  }, [topic])

  useEffect(() => { setVisible(PAGE) }, [topic])

  const shown = videos.slice(0, visible)

  return (
    <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20 py-12 sm:py-16" style={{ minHeight: '60vh' }}>
      <div className="mb-10">
        <p className="font-medium text-[#8b1e3f] text-base mb-2">PREDAVANJA</p>
        <h1 className="font-semibold text-[#141110] mb-3"
          style={{ fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.3, letterSpacing: '-0.44px' }}>
          Kratka predavanja
        </h1>
        <p className="font-normal text-[#746860]" style={{ fontSize: 18 }}>
          Kratki sadržaji i isječci za brzi islamski duhovni podsjećaj.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        {TOPICS.map(t => (
          <button key={t.key} onClick={() => setTopic(t.key)}
            className="text-sm font-medium px-4 py-2 transition-all"
            style={{
              border: topic === t.key ? 'none' : '1px solid #D6CCC3',
              background: topic === t.key ? '#8B1E3F' : 'white',
              color: topic === t.key ? '#fff' : '#5A4F49',
            }}>
            {t.label}
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
      ) : videos.length === 0 ? (
        <div className="flex items-center justify-center py-20 bg-[#f5f2ef] border border-black/5">
          <p className="text-sm text-[#a89888]">Nema kratkih predavanja u ovoj kategoriji</p>
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
          {visible < videos.length && (
            <div className="flex flex-col items-center gap-2 mt-10">
              <button onClick={() => setVisible(v => v + PAGE)}
                className="px-8 py-3 border border-[#D6CCC3] text-[#5a4f49] text-sm font-medium hover:border-[#8b1e3f] hover:text-[#8b1e3f] transition-colors">
                Učitaj još ({videos.length - visible} preostalih)
              </button>
              <p className="text-xs text-[#a89888]">Prikazano {shown.length} od {videos.length}</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
