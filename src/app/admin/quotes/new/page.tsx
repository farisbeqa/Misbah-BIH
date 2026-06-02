'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Save } from 'lucide-react'

const TYPES = [
  { key: 'ajet',   label: 'Ajet (Kur\'an)', color: '#8B1E3F' },
  { key: 'hadis',  label: 'Hadis',          color: '#2563EB' },
  { key: 'izreka', label: 'Izreka učenjaka', color: '#059669' },
]

export default function NewQuotePage() {
  const router = useRouter()
  const [type, setType]       = useState('izreka')
  const [text, setText]       = useState('')
  const [source, setSource]   = useState('')
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')

  const handleSave = async () => {
    if (!text.trim()) { setError('Tekst je obavezan'); return }
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/quotes', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, text: text.trim(), source: source.trim() || null }),
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
        <h1 className="text-2xl font-black text-zinc-900 mb-6">Dodaj misao dana</h1>

        <div className="bg-white rounded-2xl p-6 border border-zinc-100 shadow-sm space-y-5">
          {/* Tip */}
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-2">Tip</label>
            <div className="flex gap-2 flex-wrap">
              {TYPES.map(t => (
                <button key={t.key} type="button" onClick={() => setType(t.key)}
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-all border"
                  style={{
                    background: type === t.key ? t.color : 'white',
                    color: type === t.key ? 'white' : '#5A4F49',
                    borderColor: type === t.key ? t.color : '#E8E1DB',
                  }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tekst */}
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5">
              Tekst *
            </label>
            <textarea
              value={text} onChange={e => setText(e.target.value)}
              placeholder={
                type === 'ajet'   ? 'Unesite tekst ajeta...' :
                type === 'hadis'  ? 'Unesite tekst hadisa...' :
                'Unesite izreku učenjaka...'
              }
              rows={5}
              className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand text-sm resize-none" />
          </div>

          {/* Izvor */}
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5">
              Izvor / referenca <span className="text-zinc-400 font-normal">(opciono)</span>
            </label>
            <input
              type="text" value={source} onChange={e => setSource(e.target.value)}
              placeholder={
                type === 'ajet'   ? 'npr. Kur\'an, 2:261' :
                type === 'hadis'  ? 'npr. Buhari, Muslim' :
                'npr. Ibn Kajjim el-Džewzijje'
              }
              className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand text-sm" />
          </div>

          {/* Preview */}
          {text.trim() && (
            <div className="p-5 rounded-2xl" style={{ background: '#FAF7F2', border: '1px solid #E8E1DB' }}>
              <p className="font-mono text-[10px] uppercase tracking-widest mb-3"
                style={{ color: TYPES.find(t => t.key === type)?.color }}>
                Preview — {TYPES.find(t => t.key === type)?.label}
              </p>
              <span className="text-4xl leading-none select-none block mb-2" style={{ color: '#D6CCC3', fontFamily: 'Georgia' }}>"</span>
              <p className="text-sm leading-relaxed" style={{ color: '#3F3733' }}>{text}</p>
              {source && <p className="font-mono text-[11px] mt-3" style={{ color: '#A89888' }}>— {source}</p>}
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-3 pt-1">
            <Link href="/admin/dashboard"
              className="flex-1 text-center bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold py-2.5 rounded-xl text-sm transition-colors">
              Odustani
            </Link>
            <button onClick={handleSave} disabled={saving || !text.trim()}
              className="flex-1 flex items-center justify-center gap-2 text-white font-semibold py-2.5 rounded-xl text-sm disabled:opacity-40"
              style={{ background: '#8B1E3F' }}>
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              {saving ? 'Dodavanje...' : 'Objavi'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
