import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/db'
import { MapPin, Calendar } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const metadata = { title: "Aktivnosti — Misbah EDU" }

const MONTHS = ['jan','feb','mar','apr','maj','jun','jul','aug','sep','okt','nov','dec']
function fmt(d: Date) { return `${d.getDate()}. ${MONTHS[d.getMonth()]} ${d.getFullYear()}.` }

async function getActivities() {
  try { return await prisma.activity.findMany({ where: { published: true }, orderBy: { date: 'desc' } })
  } catch { return [] }
}

export default async function AktivnostiPage() {
  const activities = await getActivities()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="mb-12">
        <p className="font-mono text-[11px] text-brand-light uppercase tracking-widest mb-2">Zajednica</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-warm-900 tracking-tight mb-2">Aktivnosti</h1>
        <p className="text-warm-500 text-sm">Obilaske, hikinge, posjete i događaje džemata i omladine</p>
      </div>

      {activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24"
          style={{ background: '#FAF7F2', border: '1px dashed #E8E1DB', borderRadius: 8 }}>
          <MapPin size={40} className="mb-3" style={{ color: '#D6CCC3' }} />
          <p className="font-mono text-sm text-warm-400">Nema aktivnosti još uvijek</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map(a => (
            <Link key={a.id} href={`/aktivnosti/${a.id}`} className="group block">
              <article className="h-full flex flex-col overflow-hidden transition-all duration-200 group-hover:-translate-y-0.5 shadow-card group-hover:shadow-card-hover"
                style={{ background: '#FAF7F2', border: '1px solid #E8E1DB', borderRadius: 8 }}>
                {a.imageUrl ? (
                  <div className="overflow-hidden flex-shrink-0" style={{ borderRadius: '8px 8px 0 0', aspectRatio: '16/9' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={a.imageUrl} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                ) : (
                  <div className="flex-shrink-0 flex items-center justify-center" style={{ borderRadius: '8px 8px 0 0', aspectRatio: '16/9', background: 'linear-gradient(135deg,#8B1E3F,#5E1028)' }}>
                    <MapPin size={36} className="text-white/40" />
                  </div>
                )}
                <div className="px-4 py-4 flex flex-col flex-1">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Calendar size={10} style={{ color: '#A94A61' }} />
                    <time className="font-mono text-[11px] tracking-wide" style={{ color: '#A94A61' }}>{fmt(a.date)}</time>
                  </div>
                  <h3 className="font-bold text-[15px] leading-snug group-hover:text-brand transition-colors line-clamp-2" style={{ color: '#241F1D' }}>
                    {a.title}
                  </h3>
                  <p className="text-sm leading-relaxed line-clamp-3 mt-2" style={{ color: '#978A81' }}>
                    {a.content.replace(/\n+/g, ' ').trim()}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
