import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, MapPin } from 'lucide-react'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

interface PageProps { params: { id: string } }

export async function generateMetadata({ params }: PageProps) {
  try {
    const a = await prisma.activity.findUnique({ where: { id: parseInt(params.id) } })
    return a ? { title: `${a.title} - Misbah EDU`, alternates: { canonical: `/aktivnosti/${params.id}` } } : { title: 'Misbah EDU' }
  } catch { return { title: 'Misbah EDU' } }
}

const MONTHS = ['januar','februar','mart','april','maj','juni','juli','august','septembar','oktobar','novembar','decembar']
function fmt(d: Date) { return `${d.getDate()}. ${MONTHS[d.getMonth()]} ${d.getFullYear()}.` }

export default async function ActivityPage({ params }: PageProps) {
  const activity = await prisma.activity.findUnique({ where: { id: parseInt(params.id), published: true } })
  if (!activity) notFound()

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Link href="/aktivnosti"
        className="inline-flex items-center gap-2 text-warm-400 hover:text-warm-700 text-sm mb-8 transition-colors font-mono tracking-wide">
        <ArrowLeft size={14} /> Nazad na aktivnosti
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
        <Calendar size={13} style={{ color: '#A94A61' }} />
        <time className="font-mono text-xs tracking-wider" style={{ color: '#A94A61' }}>{fmt(activity.date)}</time>
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-warm-900 leading-tight tracking-tight mb-8 break-words">
        {activity.title}
      </h1>

      <div className="prose-blog">
        {activity.content.split('\n').map((line, i) =>
          line.trim() ? <p key={i}>{line}</p> : <div key={i} className="h-2" />
        )}
      </div>

      <div className="mt-10 pt-6 flex justify-center" style={{ borderTop: '1px solid #E8E1DB' }}>
        <Link href="/aktivnosti"
          className="inline-flex items-center gap-2 font-mono text-xs text-warm-400 hover:text-warm-700 transition-colors px-4 py-2"
          style={{ border: '1px solid #E8E1DB', borderRadius: 6 }}>
          <MapPin size={11} /> Sve aktivnosti
        </Link>
      </div>
    </div>
  )
}
