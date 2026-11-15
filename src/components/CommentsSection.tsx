'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { MessageCircle, Loader2, Trash2, Send, Flag } from 'lucide-react'
import { useCurrentLocale } from '@/i18n/navigation'
import { formatDateIntl } from '@/i18n/format'
import type { Locale } from '@/i18n/config'
import AuthModal, { apiErrorText } from './AuthModal'

interface Comment { id: number; content: string; createdAt: string; user: { username: string }; userId: number }
interface AuthUser { id: number; username: string }
interface Props { targetType: 'video' | 'blog'; targetId: number }

function fmt(d: string, locale: Locale) {
  return formatDateIntl(d, locale, { day: 'numeric', month: 'short', year: 'numeric' })
}

// Comments are written by users and are shown as written (never translated)
export default function CommentsSection({ targetType, targetId }: Props) {
  const t = useTranslations('auth')
  const locale = useCurrentLocale()
  const [comments, setComments] = useState<Comment[]>([])
  const [user, setUser] = useState<AuthUser | null>(null)
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [reported, setReported] = useState<number[]>([])
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
      else setError(apiErrorText(t, data))
    } catch { setError(t('errors.generic')) }
    finally { setSubmitting(false) }
  }

  const handleReport = async (commentId: number) => {
    if (!confirm(t('comments.reportConfirm'))) return
    try {
      await fetch('/api/comments/report', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ commentId }) })
    } finally {
      setReported(p => [...p, commentId])
    }
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
          <MessageCircle size={16} className="text-[var(--fg-b8aca2)]" />
          <h3 className="font-bold text-[var(--fg-3f3733)] text-base">
            {t('comments.title')}{' '}
            {!loading && <span className="font-mono text-[11px] text-[var(--fg-b8aca2)] font-normal">({comments.length})</span>}
          </h3>
        </div>

        {/* Comment form */}
        {user ? (
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--bg-8b1e3f)] flex-shrink-0 flex items-center justify-center text-white text-[11px] font-bold mt-0.5">
                {user.username[0].toUpperCase()}
              </div>
              <div className="flex-1">
                <textarea value={draft} onChange={e => setDraft(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit(e) }}
                  placeholder={t('comments.placeholder')} rows={3}
                  className="w-full px-4 py-3 text-sm text-[var(--fg-241f1d)] resize-none outline-none transition-all focus:ring-2 focus:ring-[color:color-mix(in_srgb,var(--line-8b1e3f)_15%,transparent)] focus:border-[var(--line-8b1e3f)]"
                  style={{ background: 'var(--bg-faf7f2)', border: '1px solid var(--line-e8e1db)', borderRadius: 8 }} />
                {error && <p className="font-mono text-[11px] text-red-600 mt-1">{error}</p>}
                <div className="flex items-center justify-between mt-2">
                  <p className="font-mono text-[10px] text-[var(--fg-b8aca2)]">{t('comments.shortcutHint')}</p>
                  <button type="submit" disabled={submitting || !draft.trim()}
                    className="flex items-center gap-1.5 text-white text-xs font-semibold px-4 py-1.5 transition-colors disabled:opacity-40"
                    style={{ background: 'var(--bg-8b1e3f)', borderRadius: 6 }}>
                    {submitting ? <Loader2 size={11} className="animate-spin" /> : <Send size={11} className="flip-rtl" />}
                    {t('comments.submit')}
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="text-sm text-[var(--fg-978a81)] text-center py-5 mb-6 font-mono text-[12px]"
            style={{ background: 'var(--bg-faf7f2)', border: '1px solid var(--line-e8e1db)', borderRadius: 8 }}>
            {t.rich('comments.loginPrompt', {
              login: chunks => (
                <button onClick={() => { setModalMode('login'); setModalOpen(true) }}
                  className="text-[var(--fg-8b1e3f)] hover:text-[var(--fg-a94a61)] transition-colors font-semibold">{chunks}</button>
              ),
              register: chunks => (
                <button onClick={() => { setModalMode('register'); setModalOpen(true) }}
                  className="text-[var(--fg-8b1e3f)] hover:text-[var(--fg-a94a61)] transition-colors font-semibold">{chunks}</button>
              ),
            })}
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-8"><Loader2 size={20} className="animate-spin text-[var(--fg-d6ccc3)]" /></div>
        ) : comments.length === 0 ? (
          <p className="font-mono text-[11px] text-[var(--fg-b8aca2)] text-center py-8">{t('comments.empty')}</p>
        ) : (
          <div className="space-y-5">
            {comments.map(c => (
              <div key={c.id} className="flex gap-3 group">
                <div className="w-7 h-7 rounded-full bg-[var(--bg-e8e1db)] flex-shrink-0 flex items-center justify-center text-[var(--fg-746860)] text-[10px] font-bold mt-0.5">
                  {c.user.username[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-[var(--fg-3f3733)] text-sm">{c.user.username}</span>
                    <time className="font-mono text-[10px] text-[var(--fg-b8aca2)]">{fmt(c.createdAt, locale)}</time>
                  </div>
                  <p className="text-[var(--fg-746860)] text-sm leading-relaxed break-words">{c.content}</p>
                </div>
                {user?.id !== c.userId && (
                  reported.includes(c.id) ? (
                    <span className="font-mono text-[10px] text-[var(--fg-b8aca2)] flex-shrink-0 p-2">{t('comments.reported')}</span>
                  ) : (
                    <button onClick={() => handleReport(c.id)} title={t('comments.report')}
                      className="sm:opacity-0 sm:group-hover:opacity-100 text-[var(--fg-d6ccc3)] hover:text-red-400 transition-all flex-shrink-0 p-2">
                      <Flag size={12} />
                    </button>
                  )
                )}
                {user?.id === c.userId && (
                  <button onClick={() => handleDelete(c.id)} disabled={deletingId === c.id}
                    className="sm:opacity-0 sm:group-hover:opacity-100 text-[var(--fg-d6ccc3)] hover:text-red-400 transition-all flex-shrink-0 p-2">
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
