'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Save, ImagePlus, Video, X } from 'lucide-react'

const TAGS = [
  { key: 'aktivnosti', label: 'Aktivnosti' },
  { key: 'vijesti',    label: 'Vijesti' },
  { key: 'novosti',    label: 'Novosti' },
]

export default function NewActivityPage() {
  const router = useRouter()
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle]         = useState('')
  const [content, setContent]     = useState('')
  const [date, setDate]           = useState(new Date().toISOString().split('T')[0])
  const [tag, setTag]             = useState('aktivnosti')
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState('')

  // Media state
  const [mediaMode, setMediaMode] = useState<'image' | 'video'>('image')
  const [imageUrl, setImageUrl]   = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [videoUrl, setVideoUrl]   = useState('')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file); setImagePreview(URL.createObjectURL(file)); setImageUrl('')
  }

  const handleVideoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setVideoFile(file); setVideoPreview(URL.createObjectURL(file)); setVideoUrl('')
  }

  const uploadFile = async (file: File, folder: string): Promise<string | null> => {
    const presignRes = await fetch('/api/upload', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: file.name, contentType: file.type, folder }),
    })
    if (!presignRes.ok) return null
    const { uploadUrl, publicUrl } = await presignRes.json()
    const upRes = await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } })
    return upRes.ok ? publicUrl : null
  }

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) { setError('Naslov i sadržaj su obavezni'); return }
    setSaving(true); setUploading(false); setError('')
    try {
      let finalImageUrl: string | null = null
      let finalVideoUrl: string | null = null

      if (mediaMode === 'image') {
        if (imageFile) { setUploading(true); finalImageUrl = await uploadFile(imageFile, 'thumbs') }
        else finalImageUrl = imageUrl.trim() || null
      } else {
        if (videoFile) { setUploading(true); finalVideoUrl = await uploadFile(videoFile, 'activities') }
        else finalVideoUrl = videoUrl.trim() || null
      }

      const res = await fetch('/api/activities', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), content: content.trim(), imageUrl: finalImageUrl, videoUrl: finalVideoUrl, date, tag }),
      })
      if (res.ok) { router.push('/admin/dashboard'); router.refresh() }
      else { const d = await res.json(); setError(d.error || 'Greška') }
    } catch { setError('Greška pri conexiji') }
    finally { setSaving(false); setUploading(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-zinc-950 text-white px-4 sm:px-6 py-4 sticky top-0 z-30 border-b border-zinc-800">
        <div className="max-w-3xl mx-auto flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center text-white font-black text-sm">م</div>
          <span className="font-black text-sm">Misbah EDU</span>
          <span className="text-zinc-500 text-xs px-2 py-0.5 bg-zinc-800 rounded-md">Admin</span>
        </div>
      </nav>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-800 mb-6 text-sm">
          <ArrowLeft size={15} /> Nazad
        </Link>
        <h1 className="text-2xl font-black text-zinc-900 mb-6">Dodaj aktivnost</h1>

        <div className="bg-white rounded-2xl p-6 border border-zinc-100 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Naslov *</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="npr. Posjeta Srebrenici 2026"
              className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Datum aktivnosti</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand text-sm" />
          </div>

          {/* Media section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-zinc-700">
                Medija <span className="text-zinc-400 font-normal">(opciono)</span>
              </label>
              <div className="flex gap-1">
                <button type="button" onClick={() => setMediaMode('image')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${mediaMode === 'image' ? 'bg-brand text-white' : 'bg-zinc-100 text-zinc-600'}`}>
                  <ImagePlus size={12} /> Slika
                </button>
                <button type="button" onClick={() => setMediaMode('video')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${mediaMode === 'video' ? 'bg-brand text-white' : 'bg-zinc-100 text-zinc-600'}`}>
                  <Video size={12} /> Video / Reel
                </button>
              </div>
            </div>

            {mediaMode === 'image' ? (
              <>
                <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageFile} />
                <div className="flex gap-2">
                  <input type="url" value={imageUrl}
                    onChange={e => { setImageUrl(e.target.value); setImageFile(null); setImagePreview(null) }}
                    placeholder="https://..."
                    className="flex-1 px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand text-sm" />
                  <button type="button" onClick={() => imageInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-4 py-2.5 border border-zinc-200 rounded-xl text-sm text-zinc-600 hover:bg-zinc-50 transition-colors whitespace-nowrap">
                    <ImagePlus size={15} /> Upload
                  </button>
                </div>
                {(imagePreview || imageUrl) && (
                  <div className="mt-2 relative inline-block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imagePreview || imageUrl} alt="Preview" className="rounded-lg max-h-40 object-cover" />
                    <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); setImageUrl('') }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600">
                      <X size={12} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={handleVideoFile} />
                <div className="flex gap-2">
                  <input type="url" value={videoUrl}
                    onChange={e => { setVideoUrl(e.target.value); setVideoFile(null); setVideoPreview(null) }}
                    placeholder="https://... (URL videa)"
                    className="flex-1 px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand text-sm" />
                  <button type="button" onClick={() => videoInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-4 py-2.5 border border-zinc-200 rounded-xl text-sm text-zinc-600 hover:bg-zinc-50 transition-colors whitespace-nowrap">
                    <Video size={15} /> Upload
                  </button>
                </div>
                {(videoPreview || videoUrl) && (
                  <div className="mt-2 relative inline-block w-full max-w-sm">
                    <video src={videoPreview || videoUrl} className="rounded-lg max-h-40 w-full object-cover" muted playsInline />
                    <button type="button" onClick={() => { setVideoFile(null); setVideoPreview(null); setVideoUrl('') }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600">
                      <X size={12} />
                    </button>
                  </div>
                )}
                <p className="text-xs text-zinc-400 mt-1.5">MP4, MOV, WebM — preporučeno za reels</p>
              </>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Kategorija</label>
            <div className="flex gap-2 flex-wrap">
              {TAGS.map(t => (
                <button key={t.key} type="button" onClick={() => setTag(t.key)}
                  className="px-3 py-1.5 text-sm font-medium transition-all border"
                  style={{ background: tag === t.key ? '#8B1E3F' : 'white', color: tag === t.key ? 'white' : '#5A4F49', borderColor: tag === t.key ? '#8B1E3F' : '#E8E1DB', borderRadius: 8 }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Opis / Tekst *</label>
            <textarea value={content} onChange={e => setContent(e.target.value)}
              placeholder="Opišite aktivnost, gdje ste bili, šta ste radili..."
              rows={8}
              className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand text-sm resize-none" />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-3 pt-2">
            <Link href="/admin/dashboard"
              className="flex-1 text-center bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold py-2.5 rounded-xl text-sm transition-colors">
              Odustani
            </Link>
            <button onClick={handleSave} disabled={saving || !title.trim() || !content.trim()}
              className="flex-1 flex items-center justify-center gap-2 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-40"
              style={{ background: '#8B1E3F' }}>
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              {uploading ? 'Uploadanje...' : saving ? 'Snimanje...' : 'Objavi aktivnost'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
