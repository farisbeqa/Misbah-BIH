import { prisma } from '@/lib/db'
import DuaTekstoviSearch from '@/components/DuaTekstoviSearch'

export const dynamic = 'force-dynamic'

export default async function ZikroviTekstoviPage() {
  const tekstovi = await prisma.duaText.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true, author: true },
  }).catch(() => [])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16" style={{ minHeight: '60vh' }}>
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2" style={{ color: '#241F1D' }}>
          Tekstovi dova
        </h1>
      </div>

      <DuaTekstoviSearch tekstovi={tekstovi} />
    </div>
  )
}
