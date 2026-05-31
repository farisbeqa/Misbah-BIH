'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Loader2, Search, Youtube, Instagram, Facebook,
  CheckCircle, Link2, Upload, Film, X, ImagePlus,
} from 'lucide-react'

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.25 8.25 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z" />
  </svg>
)

interface Preview {
  platform: string
  embedUrl: string
  thumbnailUrl: string | null
  title: string
  isShortForm: boolean
}

const PLATFORM_EXAMPLES: Record<string, string[]> = {
  youtube: ['https://www.youtube.com/watch?v=VIDEO_ID', 'https://youtube.com/shorts/VIDEO_ID'],
  instagram: ['https://www.instagram.com/reel/SHORTCODE/'],
  tiktok: ['https://www.tiktok.com/@username/video/VIDEO_ID'],
  facebook: ['https://www.facebook.com/watch?v=VIDEO_ID'],
}

function PlatformBadge({ platform }: { platform: string }) {
  const map: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
    youtube: { icon: <Youtube size={14} />, label: 'YouTube', color: 'bg-red-100 text-red-700' },
    instagram: { icon: <Instagram size={14} />, label: 'Instagram', color: 'bg-pink-100 text-pink-700' },
    tiktok: { icon: <TikTokIcon />, label: 'TikTok', color: 'bg-gray-100 text-gray-700' },
    facebook: { icon: <Facebook size={14} />, label: 'Facebook', color: 'bg-blue-100 text-blue-700' },
  }
  const info = map[platform]
  if (!info) return null
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${info.color}`}>
      {info.icon} {info.label} pronađen
    </span>
  )
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// ─── URL mode ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { key: 'predavanja', label: 'Predavanje' },
  { key: 'kuran',      label: "Kur'an / Učanje" },
  { key: 'podcast',    label: 'Podcast' },
  { key: 'ilahije',    label: 'Ilahije i kaside' },
  { key: 'zikrovi',    label: 'Zikrovi i dove' },
]

function CategorySelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kategorija</label>
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(c => (
          <button key={c.key} type="button" onClick={() => onChange(c.key)}
            className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all border"
            style={{
              background: value === c.key ? '#8B1E3F' : 'white',
              color: value === c.key ? 'white' : '#5A4F49',
              borderColor: value === c.key ? '#8B1E3F' : '#E8E1DB',
            }}>
            {c.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function UrlMode() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('predavanja')
  const [preview, setPreview] = useState<Preview | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [previewError, setPreviewError] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handlePreview = async () => {
    if (!url.trim()) return
    setPreviewLoading(true); setPreviewError(''); setPreview(null)
    try {
      const res = await fetch('/api/videos/preview', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      })
      const data = await res.json()
      if (res.ok) { setPreview(data); if (data.title && !title) setTitle(data.title) }
      else setPreviewError(data.error || 'Greška pri preuzimanju pregleda')
    } catch { setPreviewError('Greška pri conexiji') }
    finally { setPreviewLoading(false) }
  }

  const handleSave = async () => {
    if (!url.trim() || !preview) return
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/videos', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim(), title: title.trim() || 'Bez naslova', description: description.trim() || null, category }),
      })
      const data = await res.json()
      if (res.ok) { router.push('/admin/dashboard'); router.refresh() }
      else setError(data.error || 'Greška pri snimanju')
    } catch { setError('Greška pri conexiji') }
    finally { setSaving(false) }
  }

  return (
    <div className="space-y-4">
      {/* Supported platforms */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
        <p className="font-medium mb-2">Podržane platforme:</p>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(PLATFORM_EXAMPLES).map(([platform, examples]) => (
            <div key={platform}>
              <p className="font-medium capitalize mb-0.5">{platform}:</p>
              {examples.map(ex => <p key={ex} className="text-blue-500 text-xs truncate">{ex}</p>)}
            </div>
          ))}
        </div>
      </div>

      {/* URL input */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Link videa *</label>
        <div className="flex gap-2">
          <input
            type="url" value={url}
            onChange={e => { setUrl(e.target.value); setPreview(null); setPreviewError('') }}
            placeholder="Zalijepi YouTube, Instagram, TikTok ili Facebook link..."
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand text-sm"
            onKeyDown={e => e.key === 'Enter' && handlePreview()}
          />
          <button onClick={handlePreview} disabled={!url.trim() || previewLoading}
            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-40 flex-shrink-0">
            {previewLoading ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
            Provjeri
          </button>
        </div>
        {previewError && <p className="text-red-500 text-xs mt-2">{previewError}</p>}
      </div>

      {/* Preview */}
      {preview && (
        <div className="bg-white rounded-2xl p-6 border border-brand/30 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle size={16} className="text-brand" />
            <span className="text-brand font-medium text-sm">Video pronađen!</span>
            <PlatformBadge platform={preview.platform} />
            {preview.isShortForm && <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">Kratki sadržaj</span>}
          </div>
          {preview.thumbnailUrl && (
            <div className="mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview.thumbnailUrl} alt="Preview" className="rounded-xl max-h-44 object-cover" />
            </div>
          )}
          <div className="mb-3">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Naslov *</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Unesite naslov predavanja"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Opis <span className="text-gray-400 font-normal">(opciono)</span>
            </label>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Kratki opis predavanja..." rows={3}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand text-sm resize-none" />
          </div>
          <CategorySelect value={category} onChange={setCategory} />
        </div>
      )}

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}

      <div className="flex gap-3">
        <Link href="/admin/dashboard"
          className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl transition-colors text-sm">
          Odustani
        </Link>
        <button onClick={handleSave} disabled={!preview || !title.trim() || saving}
          className="flex-1 flex items-center justify-center gap-2 bg-brand hover:bg-brand-light text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm">
          {saving ? <Loader2 size={16} className="animate-spin" /> : null}
          {saving ? 'Snimanje...' : 'Spremi predavanje'}
        </button>
      </div>
    </div>
  )
}

// ─── Upload mode ──────────────────────────────────────────────────────────────

function UploadMode() {
  const router = useRouter()
  const videoInputRef = useRef<HTMLInputElement>(null)
  const thumbInputRef = useRef<HTMLInputElement>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [thumbFile, setThumbFile] = useState<File | null>(null)
  const [thumbPreview, setThumbPreview] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('predavanja')
  const [isShortForm, setIsShortForm] = useState(true)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState('')
  const [error, setError] = useState('')

  const ALLOWED = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/mpeg']

  const handleVideoFile = (file: File) => {
    if (!ALLOWED.includes(file.type)) { setError('Nepodržan format. Koristite MP4, WebM ili MOV.'); return }
    if (file.size > 500 * 1024 * 1024) { setError('Video je prevelik (max 500 MB)'); return }
    setError(''); setVideoFile(file)
    if (!title) setTitle(file.name.replace(/\.[^/.]+$/, ''))
  }

  const handleThumbFile = (file: File) => {
    setThumbFile(file)
    const url = URL.createObjectURL(file)
    setThumbPreview(url)
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleVideoFile(file)
  }, [])

  const handleUpload = async () => {
    if (!videoFile || !title.trim()) return
    setUploading(true); setError('')

    try {
      let videoUrl = ''
      let thumbnailUrl = ''

      // Try to get a presigned URL (production / R2)
      const presignRes = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: videoFile.name, contentType: videoFile.type, folder: 'videos' }),
      })

      if (presignRes.ok) {
        // Production: upload directly to R2
        const { uploadUrl, publicUrl } = await presignRes.json()
        setProgress('Uploadovanje videa na R2...')
        const uploadRes = await fetch(uploadUrl, {
          method: 'PUT', body: videoFile, headers: { 'Content-Type': videoFile.type },
        })
        if (!uploadRes.ok) { setError('Greška pri uploadu na R2'); return }
        videoUrl = publicUrl

        // Upload thumbnail to R2 if provided
        if (thumbFile) {
          setProgress('Uploadovanje naslovne slike...')
          const tRes = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename: thumbFile.name, contentType: thumbFile.type, folder: 'thumbs' }),
          })
          if (tRes.ok) {
            const { uploadUrl: tUrl, publicUrl: tPublicUrl } = await tRes.json()
            await fetch(tUrl, { method: 'PUT', body: thumbFile, headers: { 'Content-Type': thumbFile.type } })
            thumbnailUrl = tPublicUrl
          }
        }

        // Save metadata to DB
        setProgress('Snimanje u bazu...')
        const saveRes = await fetch('/api/videos/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: title.trim(), description: description.trim(), isShortForm, videoUrl, thumbnailUrl, category }),
        })
        const data = await saveRes.json()
        if (saveRes.ok) { router.push('/admin/dashboard'); router.refresh() }
        else setError(data.error || 'Greška pri snimanju')
      } else {
        // Development: multipart upload to local filesystem
        setProgress('Uploadovanje videa...')
        const formData = new FormData()
        formData.append('video', videoFile)
        formData.append('title', title.trim())
        formData.append('description', description.trim())
        formData.append('isShortForm', String(isShortForm))
        if (thumbFile) formData.append('thumbnail', thumbFile)

        const res = await fetch('/api/videos/upload', { method: 'POST', body: formData })
        const data = await res.json()
        if (res.ok) { router.push('/admin/dashboard'); router.refresh() }
        else setError(data.error || 'Greška pri uploadu')
      }
    } catch { setError('Greška pri conexiji') }
    finally { setUploading(false); setProgress('') }
  }

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onClick={() => !videoFile && videoInputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        className={`relative border-2 border-dashed rounded-2xl transition-colors ${
          videoFile ? 'border-brand/40 bg-brand/5' :
          dragging ? 'border-brand bg-brand/10 cursor-copy' :
          'border-gray-200 bg-gray-50 hover:border-gray-300 cursor-pointer'
        }`}
        style={{ minHeight: 160 }}
      >
        <input ref={videoInputRef} type="file" accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
          className="hidden" onChange={e => e.target.files?.[0] && handleVideoFile(e.target.files[0])} />

        {videoFile ? (
          <div className="flex items-center gap-4 p-5">
            <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center flex-shrink-0">
              <Film size={22} className="text-brand" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-zinc-900 text-sm truncate">{videoFile.name}</p>
              <p className="text-zinc-400 text-xs mt-0.5">{formatBytes(videoFile.size)}</p>
            </div>
            <button onClick={e => { e.stopPropagation(); setVideoFile(null); setTitle('') }}
              className="p-1.5 text-zinc-300 hover:text-red-400 transition-colors flex-shrink-0">
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-center px-4">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
              <Upload size={22} className="text-gray-400" />
            </div>
            <div>
              <p className="font-semibold text-zinc-700 text-sm">Prevuci video ovdje ili klikni da odabereš</p>
              <p className="text-zinc-400 text-xs mt-1">MP4, WebM, MOV · max 500 MB</p>
            </div>
          </div>
        )}
      </div>

      {videoFile && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Naslov *</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Unesite naslov predavanja"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand text-sm" />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Opis <span className="text-gray-400 font-normal">(opciono)</span>
            </label>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Kratki opis predavanja..." rows={3}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand text-sm resize-none" />
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Naslovna slika <span className="text-gray-400 font-normal">(opciono)</span>
            </label>
            <input ref={thumbInputRef} type="file" accept="image/jpeg,image/png,image/webp"
              className="hidden" onChange={e => e.target.files?.[0] && handleThumbFile(e.target.files[0])} />
            {thumbPreview ? (
              <div className="relative inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={thumbPreview} alt="Thumbnail" className="h-28 rounded-xl object-cover" />
                <button onClick={() => { setThumbFile(null); setThumbPreview(null) }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center">
                  <X size={12} />
                </button>
              </div>
            ) : (
              <button onClick={() => thumbInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-gray-400 transition-colors">
                <ImagePlus size={15} /> Dodaj naslovnu sliku
              </button>
            )}
          </div>

          <CategorySelect value={category} onChange={setCategory} />

          {/* Short-form toggle */}
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="font-semibold text-gray-700 text-sm">Kratki sadržaj (Short / Reel)</p>
              <p className="text-gray-400 text-xs mt-0.5">Vertikalni format — prikazuje se kao short</p>
            </div>
            <button onClick={() => setIsShortForm(!isShortForm)}
              className={`relative w-11 h-6 rounded-full transition-colors ${isShortForm ? 'bg-brand' : 'bg-gray-200'}`}>
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isShortForm ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>
      )}

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}

      {uploading && (
        <div className="flex items-center gap-3 bg-brand/5 border border-brand/20 rounded-xl px-4 py-3">
          <Loader2 size={16} className="animate-spin text-brand flex-shrink-0" />
          <span className="text-sm text-brand font-medium">{progress || 'Upload u toku...'}</span>
        </div>
      )}

      <div className="flex gap-3">
        <Link href="/admin/dashboard"
          className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl transition-colors text-sm">
          Odustani
        </Link>
        <button onClick={handleUpload} disabled={!videoFile || !title.trim() || uploading}
          className="flex-1 flex items-center justify-center gap-2 bg-brand hover:bg-brand-light text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm">
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={15} />}
          {uploading ? 'Uploading...' : 'Uploaduj i spremi'}
        </button>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AddVideoPage() {
  const [mode, setMode] = useState<'url' | 'upload'>('url')

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-zinc-950 text-white px-4 sm:px-6 py-4 sticky top-0 z-30 border-b border-zinc-800">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center text-white font-black text-sm">م</div>
          <span className="font-bold">Misbah EDU</span>
          <span className="text-zinc-500 text-xs font-medium px-2 py-0.5 bg-zinc-800 rounded-md">Admin</span>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/admin/dashboard"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm">
          <ArrowLeft size={15} /> Nazad na dashboard
        </Link>

        <h1 className="text-2xl font-black text-gray-900 mb-6">Dodaj predavanje</h1>

        {/* Mode tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl mb-6">
          <button
            onClick={() => setMode('url')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              mode === 'url' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            <Link2 size={15} /> Dodaj link
          </button>
          <button
            onClick={() => setMode('upload')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              mode === 'upload' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            <Upload size={15} /> Uploaduj video
          </button>
        </div>

        {mode === 'url' ? <UrlMode /> : <UploadMode />}
      </div>
    </div>
  )
}
