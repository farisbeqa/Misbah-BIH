import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import Link from '@/i18n/navigation'
import { ArrowLeft, Calendar, MapPin } from 'lucide-react'
import { prisma } from '@/lib/db'
import { localizeRow } from '@/lib/translations'
import { getLocale, formatDate } from '@/i18n/server'
import MachineTranslationNote from '@/components/MachineTranslationNote'

export const dynamic = 'force-dynamic'

interface PageProps { params: { id: string } }

export async function generateMetadata({ params }: PageProps) {
  try {
    const row = await prisma.activity.findUnique({ where: { id: parseInt(params.id) } })
    const a = await localizeRow('activity', row, getLocale())
    return a ? { title: `${a.title} - Misbah EDU` } : { title: 'Misbah EDU' }
  } catch { return { title: 'Misbah EDU' } }
}

export default async function ActivityPage({ params }: PageProps) {
  const locale = getLocale()
  const t = await getTranslations('community.activities')
  const row = await prisma.activity.findUnique({ where: { id: parseInt(params.id), published: true } })
  const activity = await localizeRow('activity', row, locale)
  if (!activity) notFound()

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Link href="/aktivnosti"
        className="inline-flex items-center gap-2 text-[var(--fg-b8aca2)] hover:text-[var(--fg-5a4f49)] text-sm mb-8 transition-colors font-mono tracking-wide">
        <ArrowLeft size={14} className="flip-rtl" /> {t('backToList')}
      </Link>

      {activity.videoUrl ? (
        <div className="mb-8 overflow-hidden" style={{ borderRadius: 8 }}>
          <video src={activity.videoUrl} controls playsInline
            className="w-full max-h-[70vh] object-contain bg-black rounded-lg" />
        </div>
      ) : activity.imageUrl ? (
        <div className="mb-8 overflow-hidden" style={{ borderRadius: 8, aspectRatio: '16/9' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={activity.imageUrl} alt={activity.title} className="w-full h-full object-cover" />
        </div>
      ) : null}

      <div className="flex items-center gap-2 mb-4">
        <Calendar size={13} style={{ color: 'var(--fg-a94a61)' }} />
        <time className="font-mono text-xs tracking-wider" style={{ color: 'var(--fg-a94a61)' }}>{formatDate(activity.date)}</time>
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--fg-241f1d)] leading-tight tracking-tight mb-8 break-words">
        {activity.title}
      </h1>

      <MachineTranslationNote show={activity.translated} className="mb-6" />

      <div className="prose-blog">
        {activity.content.split('\n').map((line, i) =>
          line.trim() ? <p key={i}>{line}</p> : <div key={i} className="h-2" />
        )}
      </div>

      <div className="mt-10 pt-6 flex justify-center" style={{ borderTop: '1px solid var(--line-e8e1db)' }}>
        <Link href="/aktivnosti"
          className="inline-flex items-center gap-2 font-mono text-xs text-[var(--fg-b8aca2)] hover:text-[var(--fg-5a4f49)] transition-colors px-4 py-2"
          style={{ border: '1px solid var(--line-e8e1db)', borderRadius: 6 }}>
          <MapPin size={11} /> {t('allActivities')}
        </Link>
      </div>
    </div>
  )
}
