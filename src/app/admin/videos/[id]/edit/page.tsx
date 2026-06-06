'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Save, ImagePlus, X } from 'lucide-react'

const CATEGORIES = [
  { key: 'predavanja', label: 'Predavanje' },
  { key: 'kuran',      label: "Kur'an / Učanje" },
  { key: 'podcast',    label: 'Podcast' },
  { key: 'ilahije',    label: 'Ilahije i kaside' },
  { key: 'zikrovi',    label: 'Zikrovi i dove' },
]

const TOPICS = [
  { key: 'tefsir',    label: 'Tefsir' },
  { key: 'hadis',     label: 'Hadis' },
  { key: 'sira',      label: 'Sira' },
  { key: 'opste',     label: 'Opšte teme' },
  { key: 'akaid',     label: 'Akaid' },
  { key: 'fikh',      label: 'Fikh' },
  { key: 'duhovnost', label: 'Duhovnost' },
  { key: 'historija', label: 'Historija' },
]

export default function EditVideoPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const thumbInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle]             = useState('')
  const [description, setDescription] = useState('')
  const [author, setAuthor]           = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [thumbFile, setThumbFile]     = useState<File | null>(null)
  const [thumbPreview, setThumbPreview] = useState<string | null>(null)
  const [category, setCategory]       = useState('predavanja')
  const [topic, setTopic]             = useState('')
  const [isShortForm, setIsShortForm] = useState(false)
  const [loading, setLoading]         = useState(true)
  const [saving, setSaving]           = useState(false)
  const [error, setError]             = useState('')

  useEffect(() => {
    fetch(`/api/videos/${id}`)
      .then(r => r.json())
      .then(data => {
        setTitle(data.title || '')
        setDescription(data.description || '')
        setAuthor(data.author || '')
        setThumbnailUrl(data.thumbnailUrl || '')
        setCategory(data.category || 'predavanja')
        setTopic(data.topic || '')
        setIsShortForm(data.isShortForm || false)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  const handleThumbFile = (file: File) => {
    setThumbFile(file)
    setThumbPreview(URL.createObjectURL(file))
    setThumbnailUrl('')
  }

  const handleSave = async () => {
    if (!title.trim()) { setError('Naslov je obavezan'); return }
    setSaving(true); setError('')
    let finalThumbnailUrl = thumbnailUrl.trim() || null
    if (thumbFile) {
      try {
        const presignRes = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: thumbFile.name, contentType: thumbFile.type, folder: 'thumbs' }),
        })
        if (presignRes.ok) {
          const { uploadUrl, publicUrl } = await presignRes.json()
          const r2Res = await fetch(uploadUrl, { method: 'PUT', body: thumbFile, headers: { 'Content-Type': thumbFile.type } })
          if (r2Res.ok) finalThumbnailUrl = publicUrl
        }
      } catch { /* keep existing URL on upload fail */ }
    }
    try {
      const res = await fetch(`/api/videos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          author: author.trim() || null,
          thumbnailUrl: finalThumbnailUrl,
          category,
          topic: topic || null,
          isShortForm,
        }),
      })
      if (res.ok) { router.push('/admin/dashboard'); router.refresh() }
      else { const d = await res.json(); setError(d.error || 'Greška') }
    } catch { setError('Greška pri conexiji') }
    finally { setSaving(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-zinc-950 text-white px-4 sm:px-6 py-4 border-b border-zinc-800">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center text-white font-black text-sm">م</div>
          <span className="font-black text-sm">Misbah EDU</span>
          <span className="text-zinc-500 text-xs px-2 py-0.5 bg-zinc-800 rounded-md">Admin</span>
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
            {/* Naslov */}
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Naslov *</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand text-sm" />
            </div>

            {/* Autor */}
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Autor <span className="text-zinc-400 font-normal">(predavač)</span></label>
              <input type="text" value={author} onChange={e => setAuthor(e.target.value)}
                placeholder="npr. hfz. Hamdo Solo"
                className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand text-sm" />
            </div>

            {/* Opis */}
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Opis <span className="text-zinc-400 font-normal">(opciono)</span></label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4}
                className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand text-sm resize-none" />
            </div>

            {/* Thumbnail */}
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">
                Naslovna slika <span className="text-zinc-400 font-normal">(opciono)</span>
              </label>
              <input ref={thumbInputRef} type="file" accept="image/jpeg,image/png,image/webp"
                className="hidden" onChange={e => e.target.files?.[0] && handleThumbFile(e.target.files[0])} />
              <div className="flex gap-2 mb-2">
                <input type="url" value={thumbnailUrl}
                  onChange={e => { setThumbnailUrl(e.target.value); setThumbPreview(null); setThumbFile(null) }}
                  placeholder="https://..."
                  className="flex-1 px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand text-sm" />
                <button onClick={() => thumbInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-zinc-300 rounded-xl text-sm text-zinc-500 hover:border-brand hover:text-brand transition-colors whitespace-nowrap">
                  <ImagePlus size={15} /> Upload
                </button>
              </div>
              {(thumbPreview || thumbnailUrl) && (
                <div className="relative inline-block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumbPreview || thumbnailUrl} alt="Thumbnail" className="h-28 rounded-xl object-cover" />
                  <button onClick={() => { setThumbFile(null); setThumbPreview(null); setThumbnailUrl('') }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>

            {/* Kategorija */}
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

            {/* Topic - samo za predavanja */}
            {category === 'predavanja' && (
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-2">Tema <span className="text-zinc-400 font-normal">(opciono)</span></label>
                <div className="flex gap-2 flex-wrap">
                  <button type="button" onClick={() => setTopic('')}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all border"
                    style={{ background: !topic ? '#8B1E3F' : 'white', color: !topic ? 'white' : '#5A4F49', borderColor: !topic ? '#8B1E3F' : '#E8E1DB' }}>
                    Bez teme
                  </button>
                  {TOPICS.map(t => (
                    <button key={t.key} type="button" onClick={() => setTopic(t.key)}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all border"
                      style={{ background: topic === t.key ? '#8B1E3F' : 'white', color: topic === t.key ? 'white' : '#5A4F49', borderColor: topic === t.key ? '#8B1E3F' : '#E8E1DB' }}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Vrsta predavanja (duga/kratka) */}
            {category === 'predavanja' && (
              <div className="flex items-center justify-between py-1">
                <div>
                  <p className="font-semibold text-zinc-700 text-sm">Vrsta predavanja</p>
                  <p className="text-zinc-400 text-xs mt-0.5">{isShortForm ? 'Kratko predavanje' : 'Dugo predavanje'}</p>
                </div>
                <button onClick={() => setIsShortForm(!isShortForm)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${isShortForm ? 'bg-brand' : 'bg-gray-200'}`}>
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isShortForm ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            )}

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
