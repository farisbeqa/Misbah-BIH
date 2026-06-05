import Link from 'next/link'
import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { ArrowLeft } from 'lucide-react'
import VideoListSearch from './ListSearch'

const CAT_LABELS: Record<string, string> = {
  predavanja: 'Predavanja', kuran: "Kur'an", ilahije: 'Ilahije', zikrovi: 'Zikrovi', podcast: 'Podcasts',
}

export default async function AdminVideosSvePage({
  searchParams,
}: {
  searchParams: { cat?: string }
}) {
  const session = await requireAuth()
  if (!session) redirect('/admin')

  const cat = searchParams.cat || 'predavanja'
  const videos = await prisma.video.findMany({
    where: { category: cat },
    orderBy: { createdAt: 'desc' },
  })

  const label = CAT_LABELS[cat] ?? cat

  return (
    <div className="min-h-screen bg-zinc-50">
      <nav className="bg-zinc-950 text-white px-4 sm:px-6 py-4 sticky top-0 z-30 border-b border-zinc-800">
        <div className="max-w-4xl mx-auto flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center text-white font-black text-sm">م</div>
          <span className="font-black text-sm">Misbah EDU</span>
          <span className="text-zinc-500 text-xs px-2 py-0.5 bg-zinc-800 rounded-md">Admin</span>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-800 mb-6 text-sm">
          <ArrowLeft size={15} /> Nazad na dashboard
        </Link>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-black text-zinc-900">{label} <span className="text-zinc-400 font-normal text-base">({videos.length})</span></h1>
          <Link href={`/admin/videos/new?category=${cat}`}
            className="text-sm font-semibold px-4 py-2 rounded-xl text-white transition-opacity hover:opacity-90"
            style={{ background: '#8B1E3F' }}>
            + Dodaj
          </Link>
        </div>

        <VideoListSearch videos={videos} />
      </div>
    </div>
  )
}
