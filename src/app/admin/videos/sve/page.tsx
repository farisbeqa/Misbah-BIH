import Link from 'next/link'
import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getPlatformLabel } from '@/lib/videoUtils'
import { ArrowLeft, Calendar, ExternalLink, Pencil, Play, Youtube, Instagram, Facebook } from 'lucide-react'
import DeleteButton from '../../dashboard/DeleteButton'

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.25 8.25 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z" />
  </svg>
)

function PlatformIcon({ platform }: { platform: string }) {
  switch (platform) {
    case 'youtube':   return <Youtube size={15} className="text-red-500" />
    case 'instagram': return <Instagram size={15} className="text-pink-500" />
    case 'facebook':  return <Facebook size={15} className="text-blue-500" />
    case 'tiktok':    return <TikTokIcon />
    default:          return <Play size={15} />
  }
}

const CAT_LABELS: Record<string, string> = {
  predavanja: 'Predavanja', kuran: "Kur'an", ilahije: 'Ilahije', zikrovi: 'Zikrovi', podcast: 'Podcasts',
}

function fmt(d: Date) {
  return d.toLocaleDateString('bs-BA', { day: 'numeric', month: 'short', year: 'numeric' })
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

        {videos.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-zinc-200">
            <p className="text-zinc-400">Nema sadržaja u ovoj kategoriji.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-zinc-100 shadow-card overflow-hidden">
            {videos.map((v, i) => (
              <div key={v.id}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 transition-colors ${i > 0 ? 'border-t border-zinc-100' : ''}`}>
                <PlatformIcon platform={v.platform} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-zinc-900 text-sm truncate">{v.title}</p>
                  <div className="flex items-center gap-2 text-zinc-400 text-xs mt-0.5">
                    <span>{getPlatformLabel(v.platform)}</span>
                    <span>·</span>
                    <Calendar size={9} /><span>{fmt(v.createdAt)}</span>
                    {v.isShortForm && <span className="bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-500">Kratko</span>}
                    {v.topic && <span className="bg-brand/10 text-brand px-1.5 py-0.5 rounded capitalize">{v.topic}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Link href={`/admin/videos/${v.id}/edit`} title="Uredi"
                    className="p-1.5 text-zinc-300 hover:text-brand transition-colors">
                    <Pencil size={13} />
                  </Link>
                  <Link href={`/videos/${v.id}`} target="_blank" title="Pregledaj"
                    className="p-1.5 text-zinc-300 hover:text-zinc-600 transition-colors">
                    <ExternalLink size={13} />
                  </Link>
                  <DeleteButton id={v.id} type="video" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
