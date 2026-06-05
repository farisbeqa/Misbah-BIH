'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2, Upload, X, AlertCircle } from 'lucide-react'

export default function AddBlogPostPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const errorRef = useRef<HTMLDivElement>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageUrlInput, setImageUrlInput] = useState('')
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (error) errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [error])

  const handleImageUpload = async (file: File) => {
    setUploading(true)
    setError('')
    try {
      // Production: get R2 presigned URL, then PUT directly
      const presignRes = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, contentType: file.type, folder: 'images' }),
      })
      if (presignRes.ok) {
        const { uploadUrl, publicUrl } = await presignRes.json()
        const r2Res = await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } })
        if (!r2Res.ok) throw new Error('R2 upload failed')
        setImageUrl(publicUrl)
      } else {
        // Development: FormData to local filesystem
        const formData = new FormData()
        formData.append('file', file)
        const res = await fetch('/api/upload', { method: 'POST', body: formData })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Upload failed')
        setImageUrl(data.publicUrl)
      }
    } catch {
      setError('Greška pri uploadu slike')
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleImageUpload(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) handleImageUpload(file)
  }

  const applyImageUrl = () => {
    if (imageUrlInput.trim()) {
      setImageUrl(imageUrlInput.trim())
    }
  }

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setError('Naslov i sadržaj su obavezni')
      return
    }
    setSaving(true)
    setError('')

    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          imageUrl: imageUrl || null,
        }),
      })

      const data = await res.json()
      if (res.ok) {
        window.location.href = '/admin/dashboard'
      } else {
        setError(data.error || 'Greška pri snimanju')
      }
    } catch {
      setError('Greška pri conexiji')
    } finally {
      setSaving(false)
    }
  }

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-[#0f3d1d] text-white px-4 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-[#c9a227] flex items-center justify-center text-[#0f3d1d] font-black text-xs">
            م
          </div>
          <span className="font-bold">Misbah EDU</span>
          <span className="text-green-300 text-xs">Admin</span>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm"
        >
          <ArrowLeft size={15} />
          Nazad na dashboard
        </Link>

        <h1 className="text-2xl font-black text-gray-900 mb-6">Dodaj blog post</h1>

        {/* Title */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Naslov *</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)}
            placeholder="Unesite naslov blog posta"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e5f34] text-sm" />
        </div>

        {/* Image */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-gray-700">
              Naslovna slika <span className="text-gray-400 font-normal">(opciono)</span>
            </label>
            <div className="flex gap-1">
              <button
                onClick={() => setImageMode('url')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${imageMode === 'url' ? 'bg-[#1e5f34] text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                URL
              </button>
              <button
                onClick={() => setImageMode('upload')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${imageMode === 'upload' ? 'bg-[#1e5f34] text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                Upload
              </button>
            </div>
          </div>

          {imageMode === 'url' ? (
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="https://example.com/slika.jpg"
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e5f34] text-sm"
                onKeyDown={(e) => e.key === 'Enter' && applyImageUrl()}
              />
              <button
                onClick={applyImageUrl}
                disabled={!imageUrlInput.trim()}
                className="px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm disabled:opacity-40 hover:bg-gray-700 transition-colors"
              >
                Primijeni
              </button>
            </div>
          ) : (
            <div
              className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-[#1e5f34] transition-colors"
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              {uploading ? (
                <div className="flex flex-col items-center gap-2 text-gray-500">
                  <Loader2 size={28} className="animate-spin text-[#1e5f34]" />
                  <p className="text-sm">Uploadanje...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <Upload size={28} />
                  <p className="text-sm">Klikni ili prevuci sliku ovdje</p>
                  <p className="text-xs">PNG, JPG, WebP do 5MB</p>
                </div>
              )}
            </div>
          )}

          {/* Image preview */}
          {imageUrl && (
            <div className="mt-3 relative inline-block">
              <img
                src={imageUrl}
                alt="Preview"
                className="h-32 w-auto rounded-xl object-cover"
              />
              <button
                onClick={() => { setImageUrl(''); setImageUrlInput('') }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">
              Sadržaj *
            </label>
            <span className="text-xs text-gray-400">{wordCount} riječi</span>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Unesite sadržaj blog posta...

Možete koristiti prazne redove za razdvajanje paragrafa."
            rows={15}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e5f34] text-sm resize-none leading-relaxed"
          />
          <p className="text-xs text-gray-400 mt-2">
            Prazni redovi između teksta će se prikazati kao novi odlomci.
          </p>
        </div>

        {error && (
          <div ref={errorRef} className="flex items-start gap-3 bg-red-50 border-2 border-red-300 text-red-800 text-sm px-4 py-4 rounded-xl mb-4 shadow-md">
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5 text-red-500" />
            <div>
              <p className="font-bold mb-0.5">Greška pri objavljivanju</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Preview box */}
        {title && content && (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Pregled</p>
            <h2 className="font-black text-gray-900 text-xl mb-2">{title}</h2>
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
              {content.slice(0, 200)}{content.length > 200 ? '...' : ''}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            href="/admin/dashboard"
            className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl transition-colors text-sm"
          >
            Odustani
          </Link>
          <button
            onClick={handleSave}
            disabled={!title.trim() || !content.trim() || saving}
            className="flex-1 flex items-center justify-center gap-2 bg-[#c9a227] hover:bg-[#e8bf4a] text-[#0f3d1d] font-bold py-2.5 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            {saving ? 'Snimanje...' : 'Objavi post'}
          </button>
        </div>
      </div>
    </div>
  )
}
