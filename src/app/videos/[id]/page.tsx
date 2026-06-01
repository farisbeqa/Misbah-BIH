import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'
import VideoEmbed from '@/components/VideoEmbed'
import LikeButton from '@/components/LikeButton'
import CommentsSection from '@/components/CommentsSection'
import { getPlatformLabel } from '@/lib/videoUtils'

interface PageProps { params: { id: string } }

export async function generateMetadata({ params }: PageProps) {
  try {
    const v = await prisma.video.findUnique({ where: { id: parseInt(params.id) } })
    return v ? { title: `${v.title} - Misbah EDU` } : { title: 'Misbah EDU' }
  } catch { return { title: 'Misbah EDU' } }
}

function formatDate(d: Date) {
  return d.toLocaleDateString('bs-BA', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function VideoDetailPage({ params }: PageProps) {
  const video = await prisma.video.findUnique({
    where: { id: parseInt(params.id), published: true },
    include: { _count: { select: { likes: true, comments: true } } },
  })
  if (!video) notFound()

  const platformColors: Record<string, string> = {
    youtube:   '#fef2f2 / #dc2626',
    instagram: '#fdf4ff / #9333ea',
    tiktok:    '#f5f2ef / #5a4f49',
    facebook:  '#eff6ff / #2563eb',
    upload:    '#f5f2ef / #374151',
  }
  const [bg, fg] = (platformColors[video.platform] || '#f5f2ef / #5a4f49').split(' / ')

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Link href="/videos"
        className="inline-flex items-center gap-2 text-warm-400 hover:text-warm-700 text-sm mb-8 transition-colors font-mono tracking-wide">
        <ArrowLeft size={14} /> Nazad na predavanja
      </Link>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-warm-900 leading-tight tracking-tight mb-4 break-words">
        {video.title}
      </h1>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <time className="font-mono text-xs text-brand-light tracking-wider">
          {formatDate(video.createdAt)}
        </time>
        <span className="w-1 h-1 rounded-full bg-warm-300" />
        <span className="font-mono text-xs px-2.5 py-1 font-medium" style={{ background: bg, color: fg, borderRadius: 4 }}>
          {getPlatformLabel(video.platform)}
        </span>
        {video.isShortForm && (
          <span className="font-mono text-xs px-2.5 py-1" style={{ background: '#F6EFE7', color: '#8B1E3F', borderRadius: 4 }}>
            Kratki sadržaj
          </span>
        )}
      </div>

      {/* Embed */}
      <div className="mb-8">
        <VideoEmbed platform={video.platform} embedUrl={video.embedUrl}
          isShortForm={video.isShortForm} originalUrl={video.url} title={video.title} />
      </div>

      {/* Description */}
      {video.description && (
        <div className="mb-8 p-6" style={{ background: '#FAF7F2', border: '1px solid #E8E1DB', borderRadius: 8 }}>
          <p className="font-mono text-[11px] text-warm-400 uppercase tracking-widest mb-3">Opis</p>
          <p className="text-warm-600 text-sm leading-relaxed whitespace-pre-line break-words">{video.description}</p>
        </div>
      )}

      {/* Likes + Comments */}
      <div style={{ borderTop: '1px solid #E8E1DB', paddingTop: 32 }} className="space-y-8">
        <LikeButton targetType="video" targetId={video.id} initialCount={video._count.likes} />
        <CommentsSection targetType="video" targetId={video.id} />
      </div>
    </div>
  )
}
