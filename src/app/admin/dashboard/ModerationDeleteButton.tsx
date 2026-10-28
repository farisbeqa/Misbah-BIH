'use client'

import { useState } from 'react'
import { Check, Loader2, Trash2, UserX } from 'lucide-react'

/** Deletes a comment or a user from the admin moderation lists */
export default function ModerationDeleteButton({
  endpoint,
  confirmText,
  kind = 'comment',
}: {
  endpoint: string
  confirmText: string
  kind?: 'comment' | 'user' | 'dismiss'
}) {
  const [loading, setLoading] = useState(false)

  const handle = async () => {
    if (!confirm(confirmText)) return
    setLoading(true)
    try {
      const res = await fetch(endpoint, { method: 'DELETE' })
      if (res.ok) window.location.reload()
      else alert('Greška pri brisanju')
    } catch {
      alert('Greška pri brisanju')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handle}
      disabled={loading}
      title={kind === 'user' ? 'Obriši korisnika i sve njegove komentare' : kind === 'dismiss' ? 'Odbaci prijavu' : 'Obriši komentar'}
      className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40">
      {loading ? (
        <Loader2 size={13} className="animate-spin" />
      ) : kind === 'user' ? (
        <UserX size={13} />
      ) : kind === 'dismiss' ? (
        <Check size={13} />
      ) : (
        <Trash2 size={13} />
      )}
      {kind === 'user' ? 'Obriši korisnika' : kind === 'dismiss' ? 'Odbaci' : 'Obriši'}
    </button>
  )
}
