import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import IlahijaTekstoviSearch from '@/components/IlahijaTekstoviSearch'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Ilahije – Tekstovi',
  description: 'Tekstovi ilahija, kasida i duhovnih pjesama — čitajte i pratite pjesme koje jačaju ljubav prema vjeri.',
  alternates: { canonical: '/ilahije/tekstovi' },
}

export default async function IlahijeTekstoviPage() {
  const tekstovi = await prisma.ilahijaText.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true, author: true },
  }).catch(() => [])

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

      <IlahijaTekstoviSearch tekstovi={tekstovi} />
    </div>
  )
}
