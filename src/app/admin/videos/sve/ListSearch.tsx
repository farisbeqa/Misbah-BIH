'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, ExternalLink, Facebook, Instagram, Pencil, Play, Search, Youtube } from 'lucide-react'
import { getPlatformLabel } from '@/lib/videoUtils'
import DeleteButton from '../../dashboard/DeleteButton'

interface Video {
  id: number
  title: string
  platform: string
  isShortForm: boolean
  topic: string | null
  createdAt: Date | string
}

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.25 8.25 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z" />
  </svg>
)

function PlatformIcon({ platform }: { platform: string }) {
  switch (platform) {
    case 'youtube':   return <Youtube size={15} className="text-red-500" />
    case 'instagram': return <Instagram size={15} className="text-pink-500" />
    case 'facebook':  return <Facebook size={15} className="text-blue-500" />
    case 'tiktok':    return <TikTokIcon />
    default:          return <Play size={15} />
  }
}

function fmt(d: Date | string) {
  return new Date(d).toLocaleDateString('bs-BA', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function VideoListSearch({ videos }: { videos: Video[] }) {
  const [query, setQuery] = useState('')
  const filtered = query.trim()
    ? videos.filter(v => v.title.toLowerCase().includes(query.toLowerCase()))
    : videos

  return (
    <>
      <div className="relative mb-5">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
        <input value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Pretraži po naslovu..."
          className="w-full pl-9 pr-4 py-2 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand bg-white" />
      </div>
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-zinc-200">
          <p className="text-zinc-400">
            {query.trim() ? `Nema rezultata za "${query}"` : 'Nema sadržaja u ovoj kategoriji.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-card overflow-hidden">
          {filtered.map((v, i) => (
            <div key={v.id}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 transition-colors ${i > 0 ? 'border-t border-zinc-100' : ''}`}>
              <PlatformIcon platform={v.platform} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-zinc-900 text-sm truncate">{v.title}</p>
                <div className="flex items-center gap-2 text-zinc-400 text-xs mt-0.5">
                  <span>{getPlatformLabel(v.platform)}</span>
                  <span>·</span>
                  <Calendar size={9} /><span>{fmt(v.createdAt)}</span>
                  {v.isShortForm && <span className="bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-500">Kratko</span>}
                  {v.topic && <span className="bg-brand/10 text-brand px-1.5 py-0.5 rounded capitalize">{v.topic}</span>}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Link href={`/admin/videos/${v.id}/edit`} title="Uredi"
                  className="p-1.5 text-zinc-300 hover:text-brand transition-colors">
                  <Pencil size={13} />
                </Link>
                <Link href={`/videos/${v.id}`} target="_blank" title="Pregledaj"
                  className="p-1.5 text-zinc-300 hover:text-zinc-600 transition-colors">
                  <ExternalLink size={13} />
                </Link>
                <DeleteButton id={v.id} type="video" />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
