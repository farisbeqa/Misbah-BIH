import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { ArrowLeft } from 'lucide-react'
import Link from '@/i18n/navigation'
import { getLocale, formatDate } from '@/i18n/server'
import { prisma } from '@/lib/db'
import { localizeRow } from '@/lib/translations'

export const dynamic = 'force-dynamic'
import VideoEmbed from '@/components/VideoEmbed'
import LikeButton from '@/components/LikeButton'
import CommentsSection from '@/components/CommentsSection'
import MachineTranslationNote from '@/components/MachineTranslationNote'
import { getPlatformLabel } from '@/lib/videoUtils'
import MoreFromAuthor from '@/components/MoreFromAuthor'

interface PageProps { params: { id: string } }

export async function generateMetadata({ params }: PageProps) {
  try {
    const v = await localizeRow('video', await prisma.video.findUnique({ where: { id: parseInt(params.id) } }), getLocale())
    return v ? { title: `${v.title} - Misbah EDU` } : { title: 'Misbah EDU' }
  } catch { return { title: 'Misbah EDU' } }
}

export default async function VideoDetailPage({ params }: PageProps) {
  const locale = getLocale()
  const t = await getTranslations('videos')
  const original = await prisma.video.findUnique({
    where: { id: parseInt(params.id), published: true },
    include: { _count: { select: { likes: true, comments: true } } },
  })
  const video = await localizeRow('video', original, locale)
  if (!original || !video) notFound()

  // Brand names (YouTube, TikTok, ...) stay as they are; "Upload"/"Nepoznato" are translated
  const platformKey = `platforms.${video.platform}`
  const platformLabel = t.has(platformKey) ? t(platformKey) : getPlatformLabel(video.platform)

  const platformColors: Record<string, string> = {
    youtube:   'var(--bg-fef2f2) / var(--fg-dc2626)',
    instagram: 'var(--bg-fdf4ff) / var(--fg-9333ea)',
    tiktok:    'var(--bg-f5f2ef) / var(--fg-5a4f49)',
    facebook:  'var(--bg-eff6ff) / var(--fg-2563eb)',
    upload:    'var(--bg-f5f2ef) / var(--fg-374151)',
  }
  const [bg, fg] = (platformColors[video.platform] || 'var(--bg-f5f2ef) / var(--fg-5a4f49)').split(' / ')

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Link href="/videos"
        className="inline-flex items-center gap-2 text-[var(--fg-b8aca2)] hover:text-[var(--fg-5a4f49)] text-sm mb-8 transition-colors font-mono tracking-wide">
        <ArrowLeft size={14} className="flip-rtl" /> {t('detail.back')}
      </Link>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--fg-241f1d)] leading-tight tracking-tight mb-4 break-words">
        {video.title}
      </h1>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <time className="font-mono text-xs text-[var(--fg-a94a61)] tracking-wider">
          {formatDate(video.createdAt)}
        </time>
        <span className="w-1 h-1 rounded-full bg-[var(--bg-d6ccc3)]" />
        <span className="font-mono text-xs px-2.5 py-1 font-medium" style={{ background: bg, color: fg, borderRadius: 4 }}>
          {platformLabel}
        </span>
        {video.isShortForm && (
          <span className="font-mono text-xs px-2.5 py-1" style={{ background: 'var(--bg-f6efe7)', color: 'var(--fg-8b1e3f)', borderRadius: 4 }}>
            {t('detail.shortContent')}
          </span>
        )}
      </div>

      {/* Embed */}
      <div className="mb-8">
        <VideoEmbed platform={video.platform} embedUrl={video.embedUrl}
          isShortForm={video.isShortForm} originalUrl={video.url} title={video.title} />
      </div>

      {/* Description (the note appears only when title/description are a translation) */}
      {video.description ? (
        <div className="mb-8 p-6" style={{ background: 'var(--bg-faf7f2)', border: '1px solid var(--line-e8e1db)', borderRadius: 8 }}>
          <p className="font-mono text-[11px] text-[var(--fg-b8aca2)] uppercase tracking-widest mb-3">{t('detail.description')}</p>
          <p className="text-[var(--fg-746860)] text-sm leading-relaxed whitespace-pre-line break-words">{video.description}</p>
          <MachineTranslationNote show={video.translated} className="mt-4" />
        </div>
      ) : (
        <MachineTranslationNote show={video.translated} className="mb-8" />
      )}

      {/* Authors are recognised from the original (Bosnian) title */}
      <MoreFromAuthor author={video.author} title={original.title} className="mb-8" />

      {/* Likes + Comments */}
      <div style={{ borderTop: '1px solid var(--line-e8e1db)', paddingTop: 32 }} className="space-y-8">
        <LikeButton targetType="video" targetId={video.id} initialCount={video._count.likes} />
        <CommentsSection targetType="video" targetId={video.id} />
      </div>
    </div>
  )
}
