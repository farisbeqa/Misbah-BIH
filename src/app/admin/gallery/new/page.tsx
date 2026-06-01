'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Save } from 'lucide-react'

export default function NewGalleryImagePage() {
  const router = useRouter()
  const [imageUrl, setImageUrl] = useState('')
  const [title, setTitle]       = useState('')
  const [description, setDesc]  = useState('')
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState('')

  const handleSave = async () => {
    if (!imageUrl.trim()) { setError('URL slike je obavezan'); return }
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim() || null, imageUrl: imageUrl.trim(), description: description.trim() || null }),
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
        <h1 className="text-2xl font-black text-zinc-900 mb-6">Dodaj sliku u galeriju</h1>
        <div className="bg-white rounded-2xl p-6 border border-zinc-100 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5">URL slike *</label>
            <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand text-sm" />
            {imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt="Preview" className="mt-2 rounded-xl max-h-48 object-cover" />
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Naziv <span className="text-zinc-400 font-normal">(opciono)</span></label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="npr. Posjeta Srebrenici 2026"
              className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Opis <span className="text-zinc-400 font-normal">(opciono)</span></label>
            <textarea value={description} onChange={e => setDesc(e.target.value)} rows={3}
              className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand text-sm resize-none" />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-3 pt-2">
            <Link href="/admin/dashboard"
              className="flex-1 text-center bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold py-2.5 rounded-xl text-sm transition-colors">
              Odustani
            </Link>
            <button onClick={handleSave} disabled={saving || !imageUrl.trim()}
              className="flex-1 flex items-center justify-center gap-2 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-40"
              style={{ background: '#8B1E3F' }}>
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              {saving ? 'Dodavanje...' : 'Dodaj u galeriju'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
