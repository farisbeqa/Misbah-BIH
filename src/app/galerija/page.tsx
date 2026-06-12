'use client'

import { useState, useEffect, useCallback } from 'react'
import { Images, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'

interface GalleryImage {
  id: number; title: string | null; imageUrl: string; description: string | null; createdAt: string
}

const PAGE = 12

export default function GalerijaPage() {
  const [images, setImages]         = useState<GalleryImage[]>([])
  const [initialLoad, setInitialLoad] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore]       = useState(false)
  const [skip, setSkip]             = useState(0)
  const [lightbox, setLightbox]     = useState<{ img: GalleryImage; index: number } | null>(null)

  const fetchBatch = useCallback(async (currentSkip: number, append: boolean) => {
    try {
      const data: GalleryImage[] = await fetch(`/api/gallery?limit=${PAGE}&skip=${currentSkip}`).then(r => r.json())
      if (append) setImages(prev => [...prev, ...data])
      else setImages(data)
      setHasMore(data.length === PAGE)
      setSkip(currentSkip + data.length)
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    fetchBatch(0, false).finally(() => setInitialLoad(false))
  }, [fetchBatch])

  const loadMore = async () => {
    setLoadingMore(true)
    await fetchBatch(skip, true)
    setLoadingMore(false)
  }

  const moveLightbox = (dir: 1 | -1) => {
    if (!lightbox) return
    const next = lightbox.index + dir
    if (next < 0 || next >= images.length) return
    setLightbox({ img: images[next], index: next })
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!lightbox) return
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowRight') moveLightbox(1)
      if (e.key === 'ArrowLeft') moveLightbox(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16" style={{ minHeight: '60vh' }}>
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-warm-900 tracking-tight mb-2">Galerija</h1>
        <p className="text-warm-500 text-sm">Fotografije s naših aktivnosti i događaja</p>
      </div>

      {initialLoad ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: PAGE }).map((_, i) => (
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
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {images.map((img, index) => (
              <button key={img.id} onClick={() => setLightbox({ img, index })}
                className="group relative overflow-hidden rounded-xl aspect-square focus:outline-none"
                style={{ background: '#E8E1DB' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.imageUrl} alt={img.title || ''}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
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

          {hasMore && (
            <div className="flex flex-col items-center gap-3 mt-10">
              <button onClick={loadMore} disabled={loadingMore}
                className="flex items-center gap-2 px-8 py-3 border border-[#D6CCC3] text-[#5a4f49] text-sm font-medium hover:border-[#8b1e3f] hover:text-[#8b1e3f] transition-colors disabled:opacity-50">
                {loadingMore
                  ? <><Loader2 size={15} className="animate-spin" /> Učitavam...</>
                  : 'Učitaj još slika'
                }
              </button>
              <p className="text-xs text-[#a89888]">Prikazano {images.length} slika</p>
            </div>
          )}
          {!hasMore && images.length > PAGE && (
            <p className="text-center text-xs text-[#a89888] mt-8">Sve slike su učitane ({images.length})</p>
          )}
        </>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85"
          onClick={() => setLightbox(null)}>
          <div className="relative max-w-4xl w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={lightbox.img.imageUrl} alt={lightbox.img.title || ''}
                className="w-full max-h-[80vh] object-contain rounded-xl" />
              {lightbox.img.title && (
                <div className="absolute bottom-3 left-3">
                  <span className="inline-block bg-black/60 backdrop-blur-sm text-white text-sm font-medium px-3 py-1.5 rounded-lg">
                    {lightbox.img.title}
                  </span>
                </div>
              )}
              <span className="absolute bottom-3 right-3 text-xs text-white/60 bg-black/40 px-2 py-1 rounded">
                {lightbox.index + 1} / {images.length}
              </span>
            </div>
            {lightbox.index > 0 && (
              <button onClick={() => moveLightbox(-1)}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">
                <ChevronLeft size={20} />
              </button>
            )}
            {lightbox.index < images.length - 1 && (
              <button onClick={() => moveLightbox(1)}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">
                <ChevronRight size={20} />
              </button>
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
