'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Save, ImagePlus, X } from 'lucide-react'

const CATEGORIES = [
  { key: 'opste',       label: 'Opšte' },
  { key: 'program',     label: 'Plan i program' },
  { key: 'kviz',        label: 'Kviz / Pitanja' },
  { key: 'materijali',  label: 'Materijali' },
]

export default function NewMektebPage() {
  const router = useRouter()
  const thumbInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle]       = useState('')
  const [content, setContent]   = useState('')
  const [author, setAuthor]     = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [category, setCategory] = useState('opste')
  const [published, setPublished] = useState(true)
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState('')

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file); setImagePreview(URL.createObjectURL(file)); setImageUrl('')
  }

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) { setError('Naslov i sadržaj su obavezni'); return }
    setSaving(true); setError('')
    try {
      let finalImageUrl = imageUrl.trim() || null
      if (imageFile) {
        const presignRes = await fetch('/api/upload', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: imageFile.name, contentType: imageFile.type, folder: 'thumbs' }),
        })
        if (presignRes.ok) {
          const { uploadUrl, publicUrl } = await presignRes.json()
          await fetch(uploadUrl, { method: 'PUT', body: imageFile, headers: { 'Content-Type': imageFile.type } })
          finalImageUrl = publicUrl
        }
      }
      const res = await fetch('/api/mekteb', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, author, imageUrl: finalImageUrl, category, published }),
      })
      if (res.ok) { router.push('/admin/dashboard'); router.refresh() }
      else { const d = await res.json(); setError(d.error || 'Greška') }
    } catch { setError('Greška pri conexiji') }
    finally { setSaving(false) }
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
        <h1 className="text-2xl font-black text-zinc-900 mb-6">Dodaj Mekteb sadržaj</h1>

        <div className="bg-white rounded-2xl p-6 border border-zinc-100 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Naslov *</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="npr. Ramazanski kviz 2026"
              className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5">
              Autor / Efendija <span className="text-zinc-400 font-normal">(opciono)</span>
            </label>
            <input type="text" value={author} onChange={e => setAuthor(e.target.value)}
              placeholder="npr. Imam Hamdo Solo"
              className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5">
              Naslovna slika <span className="text-zinc-400 font-normal">(opciono)</span>
            </label>
            <input ref={thumbInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageFile} />
            <div className="flex gap-2">
              <input type="url" value={imageUrl}
                onChange={e => { setImageUrl(e.target.value); setImageFile(null); setImagePreview(null) }}
                placeholder="https://..."
                className="flex-1 px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand text-sm" />
              <button type="button" onClick={() => thumbInputRef.current?.click()}
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
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Kategorija</label>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map(c => (
                <button key={c.key} type="button" onClick={() => setCategory(c.key)}
                  className="px-3 py-1.5 text-sm font-medium transition-all border"
                  style={{ background: category === c.key ? '#8B1E3F' : 'white', color: category === c.key ? 'white' : '#5A4F49', borderColor: category === c.key ? '#8B1E3F' : '#E8E1DB', borderRadius: 8 }}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Sadržaj *</label>
            <textarea value={content} onChange={e => setContent(e.target.value)}
              placeholder="Unesite sadržaj, pitanja, plan programa..."
              rows={12}
              className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand text-sm resize-none" />
          </div>
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="font-semibold text-zinc-700 text-sm">Objaviti</p>
              <p className="text-zinc-400 text-xs mt-0.5">{published ? 'Vidljivo korisnicima' : 'Skriveno (draft)'}</p>
            </div>
            <button onClick={() => setPublished(!published)}
              className={`relative w-11 h-6 rounded-full transition-colors ${published ? 'bg-brand' : 'bg-zinc-200'}`}>
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${published ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
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
              {saving ? 'Snimanje...' : 'Objavi'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
