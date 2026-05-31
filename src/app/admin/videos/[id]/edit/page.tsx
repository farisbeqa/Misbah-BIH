'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Save } from 'lucide-react'

const CATEGORIES = [
  { key: 'predavanja', label: 'Predavanje' },
  { key: 'kuran',      label: "Kur'an / Učanje" },
  { key: 'podcast',    label: 'Podcast' },
  { key: 'ilahije',    label: 'Ilahije i kaside' },
  { key: 'zikrovi',    label: 'Zikrovi i dove' },
]

export default function EditVideoPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [category, setCategory] = useState('predavanja')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/videos/${id}`)
      .then(r => r.json())
      .then(data => {
        setTitle(data.title || '')
        setDescription(data.description || '')
        setThumbnailUrl(data.thumbnailUrl || '')
        setCategory(data.category || 'predavanja')
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  const handleSave = async () => {
    if (!title.trim()) { setError('Naslov je obavezan'); return }
    setSaving(true); setError('')
    try {
      const res = await fetch(`/api/videos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), description: description.trim() || null, thumbnailUrl: thumbnailUrl.trim() || null, category }),
      })
      if (res.ok) { router.push('/admin/dashboard'); router.refresh() }
      else { const d = await res.json(); setError(d.error || 'Greška') }
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
        <h1 className="text-2xl font-black text-zinc-900 mb-6">Uredi sadržaj</h1>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 size={28} className="animate-spin text-zinc-400" /></div>
        ) : (
          <div className="bg-white rounded-2xl p-6 border border-zinc-100 shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Naslov *</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Opis <span className="text-zinc-400 font-normal">(opciono)</span></label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4}
                className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand text-sm resize-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">
                URL slike (thumbnail) <span className="text-zinc-400 font-normal">(opciono)</span>
              </label>
              <input type="url" value={thumbnailUrl} onChange={e => setThumbnailUrl(e.target.value)}
                placeholder="https://..." className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand text-sm" />
              {thumbnailUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={thumbnailUrl} alt="Preview" className="mt-2 rounded-lg max-h-32 object-cover" />
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-2">Kategorija</label>
              <div className="flex gap-2 flex-wrap">
                {CATEGORIES.map(c => (
                  <button key={c.key} type="button" onClick={() => setCategory(c.key)}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all border"
                    style={{
                      background: category === c.key ? '#8B1E3F' : 'white',
                      color: category === c.key ? 'white' : '#5A4F49',
                      borderColor: category === c.key ? '#8B1E3F' : '#E8E1DB',
                    }}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex gap-3 pt-2">
              <Link href="/admin/dashboard"
                className="flex-1 text-center bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold py-2.5 rounded-xl text-sm transition-colors">
                Odustani
              </Link>
              <button onClick={handleSave} disabled={saving || !title.trim()}
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
