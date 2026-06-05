'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2 } from 'lucide-react'

interface DeleteButtonProps {
  id: number
  type: 'video' | 'blog' | 'activity' | 'gallery' | 'quote'
}

export default function DeleteButton({ id, type }: DeleteButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    const labels: Record<string, string> = { video: 'predavanje', blog: 'blog post', activity: 'aktivnost', gallery: 'sliku', quote: 'misao' }
    if (!confirm(`Jesi li siguran da želiš obrisati ovo ${labels[type]}?`)) return

    setLoading(true)
    try {
      const endpoints: Record<string, string> = {
        video: `/api/videos/${id}`, blog: `/api/blog/${id}`,
        activity: `/api/activities/${id}`, gallery: `/api/gallery/${id}`,
        quote: `/api/quotes/${id}`,
      }
      const endpoint = endpoints[type]
      const res = await fetch(endpoint, { method: 'DELETE' })
      if (res.ok) {
        window.location.reload()
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
