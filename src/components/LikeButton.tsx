'use client'

import { useState, useEffect } from 'react'
import { Heart, Loader2 } from 'lucide-react'
import AuthModal from './AuthModal'

interface AuthUser { id: number; username: string }
interface Props { targetType: 'video' | 'blog'; targetId: number; initialCount: number }

export default function LikeButton({ targetType, targetId, initialCount }: Props) {
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
            border: liked ? '1px solid #FECDD3' : '1px solid #E8E1DB',
            background: liked ? '#FFF1F2' : '#FAF7F2',
            color: liked ? '#BE123C' : '#746860',
            opacity: loading ? 0.6 : 1,
          }}>
          {toggling
            ? <Loader2 size={15} className="animate-spin" />
            : <Heart size={15} fill={liked ? 'currentColor' : 'none'} />
          }
          <span className="font-mono text-xs">{count}</span>
          <span className="text-xs opacity-60">{count === 1 ? 'lajk' : 'lajkova'}</span>
        </button>

        {!user && !loading && (
          <p className="text-warm-400 text-xs font-mono">
            <button onClick={() => { setModalMode('login'); setModalOpen(true) }}
              className="text-brand hover:text-brand-light transition-colors">Prijavi se</button>
            {' '}da lajkaš
          </p>
        )}
      </div>

      <AuthModal open={modalOpen} mode={modalMode} onClose={() => setModalOpen(false)}
        onSuccess={u => { setUser(u); setModalOpen(false) }} onSwitchMode={setModalMode} />
    </>
  )
}
