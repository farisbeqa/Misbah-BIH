'use client'

import { useState, useEffect } from 'react'
import { Images } from 'lucide-react'

interface GalleryImage {
  id: number; title: string | null; imageUrl: string; description: string | null; createdAt: string
}

export default function GalerijaPage() {
  const [images, setImages]   = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null)

  useEffect(() => {
    fetch('/api/gallery').then(r => r.json()).then(d => { setImages(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16" style={{ minHeight: '60vh' }}>
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-warm-900 tracking-tight mb-2">Galerija</h1>
        <p className="text-warm-500 text-sm">Fotografije s naših aktivnosti i događaja</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse aspect-square rounded-xl" style={{ background: '#E8E1DB' }} />
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24"
          style={{ background: '#FAF7F2', border: '1px dashed #E8E1DB', borderRadius: 8 }}>
          <Images size={40} className="mb-3" style={{ color: '#D6CCC3' }} />
          <p className="font-mono text-sm text-warm-400">Galerija je prazna</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map(img => (
            <button key={img.id} onClick={() => setLightbox(img)}
              className="group relative overflow-hidden rounded-xl aspect-square focus:outline-none"
              style={{ background: '#E8E1DB' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.imageUrl} alt={img.title || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              {img.title && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
                  <p className="w-full px-3 py-2 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity truncate">
                    {img.title}
                  </p>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85"
          onClick={() => setLightbox(null)}>
          <div className="relative max-w-4xl w-full mx-4" onClick={e => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={lightbox.imageUrl} alt={lightbox.title || ''} className="w-full max-h-[80vh] object-contain rounded-xl" />
            {(lightbox.title || lightbox.description) && (
              <div className="mt-3 text-center">
                {lightbox.title && <p className="text-white font-semibold text-lg">{lightbox.title}</p>}
                {lightbox.description && <p className="text-white/70 text-sm mt-1">{lightbox.description}</p>}
              </div>
            )}
            <button onClick={() => setLightbox(null)}
              className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center text-zinc-900 hover:bg-zinc-100 transition-colors text-lg font-bold">
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
