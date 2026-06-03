import Link from 'next/link'
import { prisma } from '@/lib/db'
import { BookOpen } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function IlahijeTekstoviPage() {
  const tekstovi = await prisma.ilahijaText.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16" style={{ minHeight: '60vh' }}>
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2" style={{ color: '#241F1D' }}>
          Tekstovi ilahija
        </h1>
        <p className="text-sm" style={{ color: '#978A81' }}>
          Tekstovi i stihovi ilahija i kasida
        </p>
      </div>

      {tekstovi.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24"
          style={{ background: '#FAF7F2', border: '1px dashed #E8E1DB', borderRadius: 8 }}>
          <BookOpen size={40} className="mb-3" style={{ color: '#D6CCC3' }} />
          <p className="font-mono text-sm" style={{ color: '#978A81' }}>Nema tekstova još uvijek</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {tekstovi.map(t => (
            <Link key={t.id} href={`/ilahije/tekstovi/${t.id}`} className="group block">
              <div
                className="flex items-center gap-4 px-6 py-5 transition-all group-hover:-translate-y-0.5"
                style={{ background: '#FAF7F2', border: '1px solid #E8E1DB', borderRadius: 8 }}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: '#8B1E3F15' }}>
                  <BookOpen size={18} style={{ color: '#8B1E3F' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-base leading-snug group-hover:text-brand transition-colors truncate"
                    style={{ color: '#241F1D' }}>
                    {t.title}
                  </h2>
                  {t.author && (
                    <p className="text-sm mt-0.5" style={{ color: '#978A81' }}>{t.author}</p>
                  )}
                </div>
                <span className="text-sm font-medium flex-shrink-0" style={{ color: '#8B1E3F' }}>
                  Čitaj →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
