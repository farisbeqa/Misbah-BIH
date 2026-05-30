'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Loader2, Trash2, Send } from 'lucide-react'
import AuthModal from './AuthModal'

interface Comment { id: number; content: string; createdAt: string; user: { username: string }; userId: number }
interface AuthUser { id: number; username: string }
interface Props { targetType: 'video' | 'blog'; targetId: number }

function fmt(d: string) {
  return new Date(d).toLocaleDateString('bs-BA', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function CommentsSection({ targetType, targetId }: Props) {
  const [comments, setComments] = useState<Comment[]>([])
  const [user, setUser] = useState<AuthUser | null>(null)
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'login' | 'register'>('login')

  const ep = targetType === 'video' ? `/api/comments/video/${targetId}` : `/api/comments/blog/${targetId}`

  useEffect(() => {
    Promise.all([fetch(ep), fetch('/api/auth/me')]).then(async ([cRes, mRes]) => {
      setComments(await cRes.json()); setUser((await mRes.json()).user); setLoading(false)
    })
  }, [ep])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!draft.trim()) return
    setSubmitting(true); setError('')
    try {
      const res = await fetch(ep, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: draft.trim() }) })
      const data = await res.json()
      if (res.ok) { setComments(p => [data, ...p]); setDraft('') }
      else setError(data.error || 'Greška')
    } catch { setError('Greška') }
    finally { setSubmitting(false) }
  }

  const handleDelete = async (commentId: number) => {
    setDeletingId(commentId)
    try {
      await fetch(ep, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ commentId }) })
      setComments(p => p.filter(c => c.id !== commentId))
    } finally { setDeletingId(null) }
  }

  return (
    <>
      <div>
        {/* Section header */}
        <div className="flex items-center gap-2 mb-6">
          <MessageCircle size={16} className="text-warm-400" />
          <h3 className="font-bold text-warm-800 text-base">
            Komentari{' '}
            {!loading && <span className="font-mono text-[11px] text-warm-400 font-normal">({comments.length})</span>}
          </h3>
        </div>

        {/* Comment form */}
        {user ? (
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-brand flex-shrink-0 flex items-center justify-center text-white text-[11px] font-bold mt-0.5">
                {user.username[0].toUpperCase()}
              </div>
              <div className="flex-1">
                <textarea value={draft} onChange={e => setDraft(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit(e) }}
                  placeholder="Napiši komentar..." rows={3}
                  className="w-full px-4 py-3 text-sm text-warm-900 resize-none outline-none transition-all focus:ring-2 focus:ring-brand/15 focus:border-brand"
                  style={{ background: '#FAF7F2', border: '1px solid #E8E1DB', borderRadius: 8 }} />
                {error && <p className="font-mono text-[11px] text-red-600 mt-1">{error}</p>}
                <div className="flex items-center justify-between mt-2">
                  <p className="font-mono text-[10px] text-warm-400">Ctrl+Enter za slanje</p>
                  <button type="submit" disabled={submitting || !draft.trim()}
                    className="flex items-center gap-1.5 text-white text-xs font-semibold px-4 py-1.5 transition-colors disabled:opacity-40"
                    style={{ background: '#8B1E3F', borderRadius: 6 }}>
                    {submitting ? <Loader2 size={11} className="animate-spin" /> : <Send size={11} />}
                    Objavi
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="text-sm text-warm-500 text-center py-5 mb-6 font-mono text-[12px]"
            style={{ background: '#FAF7F2', border: '1px solid #E8E1DB', borderRadius: 8 }}>
            <button onClick={() => { setModalMode('login'); setModalOpen(true) }}
              className="text-brand hover:text-brand-light transition-colors font-semibold">Prijavi se</button>
            {' '}ili{' '}
            <button onClick={() => { setModalMode('register'); setModalOpen(true) }}
              className="text-brand hover:text-brand-light transition-colors font-semibold">registruj se</button>
            {' '}da komentarišeš
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-8"><Loader2 size={20} className="animate-spin text-warm-300" /></div>
        ) : comments.length === 0 ? (
          <p className="font-mono text-[11px] text-warm-400 text-center py-8">Nema komentara. Budi prvi!</p>
        ) : (
          <div className="space-y-5">
            {comments.map(c => (
              <div key={c.id} className="flex gap-3 group">
                <div className="w-7 h-7 rounded-full bg-warm-200 flex-shrink-0 flex items-center justify-center text-warm-600 text-[10px] font-bold mt-0.5">
                  {c.user.username[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-warm-800 text-sm">{c.user.username}</span>
                    <time className="font-mono text-[10px] text-warm-400">{fmt(c.createdAt)}</time>
                  </div>
                  <p className="text-warm-600 text-sm leading-relaxed break-words">{c.content}</p>
                </div>
                {user?.id === c.userId && (
                  <button onClick={() => handleDelete(c.id)} disabled={deletingId === c.id}
                    className="sm:opacity-0 sm:group-hover:opacity-100 text-warm-300 hover:text-red-400 transition-all flex-shrink-0 p-2">
                    {deletingId === c.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <AuthModal open={modalOpen} mode={modalMode} onClose={() => setModalOpen(false)}
        onSuccess={u => { setUser(u); setModalOpen(false) }} onSwitchMode={setModalMode} />
    </>
  )
}
