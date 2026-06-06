'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Upload, X } from 'lucide-react'

export default function NewDuaTextPage() {
  const router = useRouter()
  const audioInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle]       = useState('')
  const [content, setContent]   = useState('')
  const [author, setAuthor]     = useState('')
  const [audioUrl, setAudioUrl] = useState('')
  const [audioUrlInput, setAudioUrlInput] = useState('')
  const [audioMode, setAudioMode] = useState<'url' | 'upload'>('url')
  const [uploading, setUploading] = useState(false)
  const [published, setPublished] = useState(true)
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState('')

  const handleAudioUpload = async (file: File) => {
    setUploading(true)
    setError('')
    try {
      // Try R2 presigned URL first (production); fallback to local filesystem (dev)
      const presignRes = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, contentType: file.type, folder: 'audio' }),
      })
      if (presignRes.ok) {
        const { uploadUrl, publicUrl } = await presignRes.json()
        const r2Res = await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } })
        if (!r2Res.ok) throw new Error('R2 upload failed')
        setAudioUrl(publicUrl)
        return
      }
      // Development fallback: FormData to local filesystem
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      setAudioUrl(data.publicUrl)
    } catch {
      setError('Greška pri uploadu audio fajla')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) { setError('Naslov i tekst su obavezni'); return }
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/dua-tekstovi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, author, audioUrl: audioUrl || null, published }),
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

        <h1 className="text-2xl font-black text-gray-900 mb-6">Dodaj tekst dove</h1>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Naziv dove *</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Npr. Dova za berićet"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand text-sm" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Autor <span className="text-gray-400 font-normal">(opciono)</span>
            </label>
            <input type="text" value={author} onChange={e => setAuthor(e.target.value)}
              placeholder="Npr. Imam Hamdo Solo"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand text-sm" />
          </div>

          {/* Audio section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">
                Snimak / Audio <span className="text-gray-400 font-normal">(opciono)</span>
              </label>
              <div className="flex gap-1">
                <button onClick={() => setAudioMode('url')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${audioMode === 'url' ? 'bg-brand text-white' : 'bg-gray-100 text-gray-600'}`}>
                  URL
                </button>
                <button onClick={() => setAudioMode('upload')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${audioMode === 'upload' ? 'bg-brand text-white' : 'bg-gray-100 text-gray-600'}`}>
                  Upload
                </button>
              </div>
            </div>

            {audioMode === 'url' ? (
              <div className="flex gap-2">
                <input type="url" value={audioUrlInput} onChange={e => setAudioUrlInput(e.target.value)}
                  placeholder="https://example.com/snimak.mp3"
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand text-sm"
                  onKeyDown={e => e.key === 'Enter' && audioUrlInput.trim() && setAudioUrl(audioUrlInput.trim())} />
                <button onClick={() => audioUrlInput.trim() && setAudioUrl(audioUrlInput.trim())}
                  disabled={!audioUrlInput.trim()}
                  className="px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm disabled:opacity-40 hover:bg-gray-700 transition-colors">
                  Primijeni
                </button>
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-brand transition-colors"
                onClick={() => audioInputRef.current?.click()}>
                <input ref={audioInputRef} type="file" accept="audio/*" className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleAudioUpload(f) }} />
                {uploading ? (
                  <div className="flex flex-col items-center gap-2 text-gray-500">
                    <Loader2 size={24} className="animate-spin text-brand" />
                    <p className="text-sm">Uploadanje...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <Upload size={24} />
                    <p className="text-sm">Klikni za upload audio fajla</p>
                    <p className="text-xs">MP3, OGG, WAV, M4A</p>
                  </div>
                )}
              </div>
            )}

            {audioUrl && (
              <div className="mt-3 flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2.5">
                <audio controls src={audioUrl} className="flex-1 h-8" style={{ minWidth: 0 }} />
                <button onClick={() => { setAudioUrl(''); setAudioUrlInput('') }}
                  className="flex-shrink-0 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                  <X size={12} />
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tekst *</label>
            <textarea value={content} onChange={e => setContent(e.target.value)}
              placeholder="Unesite cijeli tekst dove..."
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
