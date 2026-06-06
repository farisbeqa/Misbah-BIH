'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Save } from 'lucide-react'

export default function EditGalleryImagePage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()

  const [title, setTitle]     = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    fetch(`/api/gallery/${id}`)
      .then(r => r.json())
      .then(d => { setTitle(d.title || ''); setImageUrl(d.imageUrl || ''); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  const handleSave = async () => {
    setSaving(true); setError('')
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      })
      if (res.ok) { router.push('/admin/gallery/sve'); router.refresh() }
      else { const d = await res.json(); setError(d.error || 'Greška') }
    } catch { setError('Greška pri conexiji') }
    finally { setSaving(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-zinc-950 text-white px-4 sm:px-6 py-4 sticky top-0 z-30 border-b border-zinc-800">
        <div className="max-w-2xl mx-auto flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center text-white font-black text-sm">م</div>
          <span className="font-black text-sm">Misbah EDU</span>
          <span className="text-zinc-500 text-xs px-2 py-0.5 bg-zinc-800 rounded-md">Admin</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/admin/gallery/sve" className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-800 mb-6 text-sm">
          <ArrowLeft size={15} /> Nazad na galeriju
        </Link>
        <h1 className="text-2xl font-black text-zinc-900 mb-6">Uredi sliku</h1>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 size={28} className="animate-spin text-zinc-400" /></div>
        ) : (
          <div className="bg-white rounded-2xl p-6 border border-zinc-100 shadow-sm space-y-5">
            {imageUrl && (
              <div className="rounded-xl overflow-hidden max-h-64 bg-zinc-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="" className="w-full h-full object-cover max-h-64" />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">
                Naslov <span className="text-zinc-400 font-normal">(opciono)</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Unesite naslov slike..."
                className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand text-sm"
                onKeyDown={e => e.key === 'Enter' && handleSave()}
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex gap-3 pt-1">
              <Link href="/admin/gallery/sve"
                className="flex-1 text-center bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold py-2.5 rounded-xl text-sm transition-colors">
                Odustani
              </Link>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-40"
                style={{ background: '#8B1E3F' }}>
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                {saving ? 'Snimanje...' : 'Spremi'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
