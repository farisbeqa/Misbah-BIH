'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Save, X, Upload } from 'lucide-react'

export default function EditBlogPostPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageUrlInput, setImageUrlInput] = useState('')
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url')
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/blog/${id}`)
      .then(r => r.json())
      .then(data => {
        setTitle(data.title || '')
        setContent(data.content || '')
        setImageUrl(data.imageUrl || '')
        setImageUrlInput(data.imageUrl || '')
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  const handleImageUpload = async (file: File) => {
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (res.ok) setImageUrl(data.url)
      else setError(data.error || 'Greška pri uploadu')
    } catch { setError('Greška pri uploadu') }
    finally { setUploading(false) }
  }

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) { setError('Naslov i sadržaj su obavezni'); return }
    setSaving(true); setError('')
    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), content: content.trim(), imageUrl: imageUrl || null }),
      })
      if (res.ok) {
        router.push('/admin/dashboard')
        router.refresh()
      } else {
        const d = await res.json()
        setError(d.error || 'Greška')
      }
    } catch { setError('Greška pri conexiji') }
    finally { setSaving(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-zinc-900 text-white px-4 sm:px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center text-zinc-900 font-black text-xs">م</div>
          <span className="font-bold">Misbah EDU</span>
          <span className="text-zinc-400 text-xs">Admin</span>
        </div>
      </nav>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-800 mb-6 text-sm transition-colors">
          <ArrowLeft size={15} /> Nazad
        </Link>
        <h1 className="text-2xl font-black text-zinc-900 mb-6">Uredi blog post</h1>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 size={28} className="animate-spin text-zinc-400" /></div>
        ) : (
          <div className="space-y-4">
            {/* Title */}
            <div className="bg-white rounded-2xl p-6 border border-zinc-100 shadow-sm">
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Naslov *</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm" />
            </div>

            {/* Image */}
            <div className="bg-white rounded-2xl p-6 border border-zinc-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-zinc-700">Naslovna slika <span className="text-zinc-400 font-normal">(opciono)</span></label>
                <div className="flex gap-1">
                  {(['url', 'upload'] as const).map(m => (
                    <button key={m} onClick={() => setImageMode(m)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${imageMode === m ? 'bg-emerald-700 text-white' : 'bg-zinc-100 text-zinc-600'}`}>
                      {m === 'url' ? 'URL' : 'Upload'}
                    </button>
                  ))}
                </div>
              </div>
              {imageMode === 'url' ? (
                <div className="flex gap-2">
                  <input type="url" value={imageUrlInput} onChange={e => setImageUrlInput(e.target.value)}
                    placeholder="https://example.com/slika.jpg"
                    className="flex-1 px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm" />
                  <button onClick={() => setImageUrl(imageUrlInput.trim())} disabled={!imageUrlInput.trim()}
                    className="px-4 py-2.5 bg-zinc-900 text-white rounded-xl text-sm disabled:opacity-40 hover:bg-zinc-700 transition-colors">
                    OK
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-zinc-200 rounded-xl p-6 text-center cursor-pointer hover:border-emerald-600 transition-colors"
                  onClick={() => fileInputRef.current?.click()}>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f) }} />
                  {uploading ? <Loader2 size={24} className="animate-spin mx-auto text-emerald-600" /> : <Upload size={24} className="mx-auto text-zinc-300 mb-1" />}
                  <p className="text-xs text-zinc-400 mt-1">Klikni ili prevuci sliku</p>
                </div>
              )}
              {imageUrl && (
                <div className="mt-3 relative inline-block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageUrl} alt="Preview" className="h-28 w-auto rounded-xl object-cover" />
                  <button onClick={() => { setImageUrl(''); setImageUrlInput('') }}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center">
                    <X size={10} />
                  </button>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl p-6 border border-zinc-100 shadow-sm">
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Sadržaj *</label>
              <textarea value={content} onChange={e => setContent(e.target.value)} rows={14}
                className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm resize-none leading-relaxed" />
            </div>

            {error && <p className="text-red-500 text-sm px-1">{error}</p>}

            <div className="flex gap-3">
              <Link href="/admin/dashboard"
                className="flex-1 text-center bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold py-2.5 rounded-xl text-sm transition-colors">
                Odustani
              </Link>
              <button onClick={handleSave} disabled={saving || !title.trim() || !content.trim()}
                className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-zinc-900 font-bold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-40">
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                {saving ? 'Snimanje...' : 'Spremi izmjene'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
