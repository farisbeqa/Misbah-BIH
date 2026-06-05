'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Save } from 'lucide-react'

const TAGS = [
  { key: 'aktivnosti', label: 'Aktivnosti' },
  { key: 'vijesti',    label: 'Vijesti' },
  { key: 'novosti',    label: 'Novosti' },
]

export default function EditActivityPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [title, setTitle]       = useState('')
  const [content, setContent]   = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [date, setDate]         = useState('')
  const [tag, setTag]           = useState('aktivnosti')
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState('')

  useEffect(() => {
    fetch(`/api/activities/${id}`).then(r => r.json()).then(d => {
      setTitle(d.title || ''); setContent(d.content || ''); setImageUrl(d.imageUrl || '')
      setDate(d.date ? new Date(d.date).toISOString().split('T')[0] : '')
      setTag(d.tag || 'aktivnosti')
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) { setError('Naslov i sadržaj su obavezni'); return }
    setSaving(true); setError('')
    try {
      const res = await fetch(`/api/activities/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), content: content.trim(), imageUrl: imageUrl.trim() || null, date, tag }),
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
        <h1 className="text-2xl font-black text-zinc-900 mb-6">Uredi aktivnost</h1>
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
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Datum aktivnosti</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand text-sm" />
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
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Naslovna slika <span className="text-zinc-400 font-normal">(URL, opciono)</span></label>
              <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)}
                placeholder="https://..." className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand text-sm" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {imageUrl && <img src={imageUrl} alt="Preview" className="mt-2 rounded-lg max-h-40 object-cover" />}
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Opis / Tekst *</label>
              <textarea value={content} onChange={e => setContent(e.target.value)} rows={8}
                className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand text-sm resize-none" />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex gap-3 pt-2">
              <Link href="/admin/dashboard" className="flex-1 text-center bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold py-2.5 rounded-xl text-sm transition-colors">Odustani</Link>
              <button onClick={handleSave} disabled={saving || !title.trim() || !content.trim()}
                className="flex-1 flex items-center justify-center gap-2 text-white font-semibold py-2.5 rounded-xl text-sm disabled:opacity-40"
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
