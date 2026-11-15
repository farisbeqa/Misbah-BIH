'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Heart, Loader2 } from 'lucide-react'
import AuthModal from './AuthModal'

interface AuthUser { id: number; username: string }
interface Props { targetType: 'video' | 'blog'; targetId: number; initialCount: number }

export default function LikeButton({ targetType, targetId, initialCount }: Props) {
  const t = useTranslations('auth')
  const [count, setCount] = useState(initialCount)
  const [liked, setLiked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'login' | 'register'>('login')

  const endpoint = targetType === 'video' ? `/api/likes/video/${targetId}` : `/api/likes/blog/${targetId}`

  useEffect(() => {
    Promise.all([fetch(endpoint), fetch('/api/auth/me')]).then(async ([lRes, mRes]) => {
      const l = await lRes.json(); const m = await mRes.json()
      setCount(l.count); setLiked(l.liked); setUser(m.user); setLoading(false)
    })
  }, [endpoint])

  const handleClick = async () => {
    if (!user) { setModalMode('login'); setModalOpen(true); return }
    setToggling(true)
    try {
      const res = await fetch(endpoint, { method: 'POST' })
      const data = await res.json()
      if (res.ok) { setCount(data.count); setLiked(data.liked) }
    } finally { setToggling(false) }
  }

  return (
    <>
      <div className="flex items-center gap-4">
        <button onClick={handleClick} disabled={loading || toggling}
          className="flex items-center gap-2 px-5 py-2.5 font-medium text-sm transition-all"
          style={{
            borderRadius: 8,
            border: liked ? '1px solid var(--line-fecdd3)' : '1px solid var(--line-e8e1db)',
            background: liked ? 'var(--bg-fff1f2)' : 'var(--bg-faf7f2)',
            color: liked ? 'var(--fg-be123c)' : 'var(--fg-746860)',
            opacity: loading ? 0.6 : 1,
          }}>
          {toggling
            ? <Loader2 size={15} className="animate-spin" />
            : <Heart size={15} fill={liked ? 'currentColor' : 'none'} />
          }
          <span className="font-mono text-xs">{count}</span>
          <span className="text-xs opacity-60">{t('likes.label', { count })}</span>
        </button>

        {!user && !loading && (
          <p className="text-[var(--fg-b8aca2)] text-xs font-mono">
            {t.rich('likes.loginPrompt', {
              login: chunks => (
                <button onClick={() => { setModalMode('login'); setModalOpen(true) }}
                  className="text-[var(--fg-8b1e3f)] hover:text-[var(--fg-a94a61)] transition-colors">{chunks}</button>
              ),
            })}
          </p>
        )}
      </div>

      <AuthModal open={modalOpen} mode={modalMode} onClose={() => setModalOpen(false)}
        onSuccess={u => { setUser(u); setModalOpen(false) }} onSwitchMode={setModalMode} />
    </>
  )
}
