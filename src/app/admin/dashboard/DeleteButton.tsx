'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2 } from 'lucide-react'

interface DeleteButtonProps {
  id: number
  type: 'video' | 'blog'
}

export default function DeleteButton({ id, type }: DeleteButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    const label = type === 'video' ? 'predavanje' : 'blog post'
    if (!confirm(`Jesi li siguran da želiš obrisati ovo ${label}?`)) return

    setLoading(true)
    try {
      const endpoint = type === 'video' ? `/api/videos/${id}` : `/api/blog/${id}`
      const res = await fetch(endpoint, { method: 'DELETE' })
      if (res.ok) {
        router.refresh()
      } else {
        alert('Greška pri brisanju')
      }
    } catch {
      alert('Greška pri brisanju')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40"
      title="Obriši"
    >
      {loading ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
    </button>
  )
}
