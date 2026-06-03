'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'

export default function NewIlahijaTextPage() {
  const router = useRouter()
  const [title, setTitle]       = useState('')
  const [content, setContent]   = useState('')
  const [author, setAuthor]     = useState('')
  const [published, setPublished] = useState(true)
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState('')

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) { setError('Naslov i tekst su obavezni'); return }
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/ilahije-tekstovi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, author, published }),
      })
      const data = await res.json()
      if (res.ok) { router.push('/admin/dashboard'); router.refresh() }
      else setError(data.error || 'Greška pri snimanju')
    } catch { setError('Greška pri conexiji') }
    finally { setSaving(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-zinc-950 text-white px-4 sm:px-6 py-4 sticky top-0 z-30 border-b border-zinc-800">
        <div className="max-w-3xl mx-auto flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center text-white font-black text-sm">م</div>
          <span className="font-bold">Misbah EDU</span>
          <span className="text-zinc-500 text-xs px-2 py-0.5 bg-zinc-800 rounded-md">Admin</span>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm">
          <ArrowLeft size={15} /> Nazad na dashboard
        </Link>

        <h1 className="text-2xl font-black text-gray-900 mb-6">Dodaj tekst ilahije</h1>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Naziv ilahije *</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Npr. Mevlud – El-Burdeh"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand text-sm" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Autor <span className="text-gray-400 font-normal">(opciono)</span>
            </label>
            <input type="text" value={author} onChange={e => setAuthor(e.target.value)}
              placeholder="Npr. Imam Busiri"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand text-sm" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tekst *</label>
            <textarea value={content} onChange={e => setContent(e.target.value)}
              placeholder="Unesite cijeli tekst ilahije..."
              rows={16}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand text-sm resize-y font-mono" />
          </div>

          <div className="flex items-center justify-between py-1">
            <div>
              <p className="font-semibold text-gray-700 text-sm">Objaviti</p>
              <p className="text-gray-400 text-xs mt-0.5">{published ? 'Vidljivo korisnicima' : 'Skriveno (draft)'}</p>
            </div>
            <button onClick={() => setPublished(!published)}
              className={`relative w-11 h-6 rounded-full transition-colors ${published ? 'bg-brand' : 'bg-gray-200'}`}>
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${published ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mt-4">{error}</div>}

        <div className="flex gap-3 mt-4">
          <Link href="/admin/dashboard"
            className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl transition-colors text-sm">
            Odustani
          </Link>
          <button onClick={handleSave} disabled={!title.trim() || !content.trim() || saving}
            className="flex-1 flex items-center justify-center gap-2 bg-brand hover:bg-brand-light text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-40 text-sm">
            {saving && <Loader2 size={16} className="animate-spin" />}
            {saving ? 'Snimanje...' : 'Spremi'}
          </button>
        </div>
      </div>
    </div>
  )
}
