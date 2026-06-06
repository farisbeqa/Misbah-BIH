'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Upload, X, CheckCircle, Loader2, ImagePlus } from 'lucide-react'

interface ImageItem {
  id: string
  file: File
  preview: string
  title: string
  status: 'pending' | 'uploading' | 'done' | 'error'
  url?: string
  error?: string
}

export default function NewGalleryImagePage() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [images, setImages] = useState<ImageItem[]>([])
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const [urlTitle, setUrlTitle] = useState('')
  const [urlError, setUrlError] = useState('')

  const addFiles = (files: FileList | File[]) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    const newItems: ImageItem[] = Array.from(files)
      .filter(f => allowed.includes(f.type))
      .map(f => ({
        id: `${Date.now()}-${Math.random()}`,
        file: f,
        preview: URL.createObjectURL(f),
        title: '',
        status: 'pending',
      }))
    setImages(prev => [...prev, ...newItems])
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files)
  }, [])

  const remove = (id: string) => setImages(prev => prev.filter(i => i.id !== id))

  const uploadAll = async () => {
    const pending = images.filter(i => i.status === 'pending')
    if (pending.length === 0) { router.push('/admin/dashboard'); router.refresh(); return }

    setUploading(true)
    await Promise.all(pending.map(async item => {
      setImages(prev => prev.map(i => i.id === item.id ? { ...i, status: 'uploading' } : i))
      try {
        let imageUrl = ''

        // Try R2 presigned upload (production)
        const presignRes = await fetch('/api/upload', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: item.file.name, contentType: item.file.type, folder: 'gallery' }),
        })

        if (presignRes.ok) {
          const { uploadUrl, publicUrl } = await presignRes.json()
          const upRes = await fetch(uploadUrl, { method: 'PUT', body: item.file, headers: { 'Content-Type': item.file.type } })
          if (!upRes.ok) throw new Error('R2 upload failed')
          imageUrl = publicUrl
        } else {
          // Development: multipart fallback
          const fd = new FormData(); fd.append('file', item.file)
          const upRes = await fetch('/api/upload', { method: 'POST', body: fd })
          if (!upRes.ok) throw new Error('Upload failed')
          const data = await upRes.json()
          imageUrl = data.publicUrl
        }

        // Save to gallery
        await fetch('/api/gallery', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl, title: item.title.trim() || null }),
        })

        setImages(prev => prev.map(i => i.id === item.id ? { ...i, status: 'done', url: imageUrl } : i))
      } catch {
        setImages(prev => prev.map(i => i.id === item.id ? { ...i, status: 'error', error: 'Greška pri uploadu' } : i))
      }
    }))

    setUploading(false)
  }

  const addByUrl = async () => {
    if (!urlInput.trim()) return
    setUrlError('')
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: urlInput.trim(), title: urlTitle.trim() || null }),
      })
      if (res.ok) {
        setUrlInput('')
        router.push('/admin/dashboard'); router.refresh()
      } else {
        const d = await res.json(); setUrlError(d.error || 'Greška')
      }
    } catch { setUrlError('Greška pri conexiji') }
  }

  const pendingCount = images.filter(i => i.status === 'pending').length
  const doneCount    = images.filter(i => i.status === 'done').length

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-zinc-950 text-white px-4 sm:px-6 py-4 sticky top-0 z-30 border-b border-zinc-800">
        <div className="max-w-4xl mx-auto flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center text-white font-black text-sm">م</div>
          <span className="font-black text-sm">Misbah EDU</span>
          <span className="text-zinc-500 text-xs px-2 py-0.5 bg-zinc-800 rounded-md">Admin</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-800 mb-6 text-sm">
          <ArrowLeft size={15} /> Nazad
        </Link>
        <h1 className="text-2xl font-black text-zinc-900 mb-2">Dodaj slike u galeriju</h1>
        <p className="text-zinc-400 text-sm mb-8">Možeš odabrati više slika odjednom. Naslov i opis nisu obavezni.</p>

        {/* Drop zone */}
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          onDrop={onDrop}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          className={`border-2 border-dashed rounded-2xl transition-colors mb-6 cursor-pointer ${
            dragging ? 'border-brand bg-brand/5' : 'border-zinc-200 bg-white hover:border-zinc-300'
          }`}
          style={{ minHeight: 160 }}
        >
          <input
            ref={inputRef} type="file" multiple
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={e => e.target.files && addFiles(e.target.files)}
          />
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-center px-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center">
              <ImagePlus size={22} className="text-zinc-400" />
            </div>
            <div>
              <p className="font-semibold text-zinc-700 text-sm">Prevuci slike ovdje ili klikni da odabereš</p>
              <p className="text-zinc-400 text-xs mt-1">JPG, PNG, WebP, GIF · više slika odjednom</p>
            </div>
          </div>
        </div>

        {/* Image preview grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {images.map(img => (
              <div key={img.id} className="flex flex-col gap-1.5">
                <div className="relative aspect-square rounded-xl overflow-hidden group"
                  style={{ background: '#E8E1DB' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.preview} alt="" className="w-full h-full object-cover" />

                  {img.status === 'uploading' && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 size={20} className="text-white animate-spin" />
                    </div>
                  )}
                  {img.status === 'done' && (
                    <div className="absolute inset-0 bg-green-500/30 flex items-center justify-center">
                      <CheckCircle size={20} className="text-white" />
                    </div>
                  )}
                  {img.status === 'error' && (
                    <div className="absolute inset-0 bg-red-500/40 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                  )}
                  {img.status === 'pending' && (
                    <button onClick={() => remove(img.id)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500">
                      <X size={11} className="text-white" />
                    </button>
                  )}
                </div>
                {img.status === 'pending' && (
                  <input
                    type="text"
                    value={img.title}
                    onChange={e => setImages(prev => prev.map(i => i.id === img.id ? { ...i, title: e.target.value } : i))}
                    placeholder="Naslov (opciono)"
                    className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-brand bg-white"
                  />
                )}
                {(img.status === 'done' || img.status === 'uploading') && img.title && (
                  <p className="text-xs text-zinc-500 truncate px-1">{img.title}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        {images.length > 0 && (
          <div className="flex gap-3 mb-8">
            <button onClick={() => setImages([])} disabled={uploading}
              className="px-4 py-2.5 text-sm text-zinc-500 hover:text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-colors disabled:opacity-40">
              Obriši sve
            </button>
            <button onClick={uploadAll} disabled={uploading || pendingCount === 0}
              className="flex-1 flex items-center justify-center gap-2 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-40"
              style={{ background: '#8B1E3F' }}>
              {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
              {uploading
                ? `Uploadovanje... (${doneCount}/${images.length})`
                : `Uploaduj ${pendingCount} ${pendingCount === 1 ? 'sliku' : 'slike'}`}
            </button>
          </div>
        )}

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 border-t border-zinc-200" />
          <span className="text-xs text-zinc-400 font-mono">ili dodaj putem linka</span>
          <div className="flex-1 border-t border-zinc-200" />
        </div>

        {/* URL input fallback */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input type="url" value={urlInput} onChange={e => setUrlInput(e.target.value)}
              placeholder="https://... (URL slike)"
              className="flex-1 px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand text-sm"
              onKeyDown={e => e.key === 'Enter' && addByUrl()} />
            <button onClick={addByUrl} disabled={!urlInput.trim()}
              className="px-4 py-2.5 text-sm font-semibold text-white rounded-xl disabled:opacity-40 transition-opacity hover:opacity-90"
              style={{ background: '#8B1E3F' }}>
              Dodaj
            </button>
          </div>
          <input type="text" value={urlTitle} onChange={e => setUrlTitle(e.target.value)}
            placeholder="Naslov slike (opciono)"
            className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand text-sm" />
        </div>
        {urlError && <p className="text-red-500 text-xs mt-1.5">{urlError}</p>}
      </div>
    </div>
  )
}
