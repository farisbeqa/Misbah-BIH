import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { prisma } from '@/lib/db'
import { localizeRows } from '@/lib/translations'
import { getLocale } from '@/i18n/server'
import DuaTekstoviSearch from '@/components/DuaTekstoviSearch'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('texts')
  return {
    title: t('duasPage.meta.title'),
    description: t('duasPage.meta.description'),
  }
}

export default async function ZikroviTekstoviPage() {
  const t = await getTranslations('texts')
  const rows = await prisma.duaText.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true, author: true, category: true },
  }).catch(() => [])
  // Only what the list shows (a translation also carries the whole text of the dua)
  const tekstovi = (await localizeRows('dua', rows, getLocale()))
    .map(({ id, title, author, category }) => ({ id, title, author, category }))

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16" style={{ minHeight: '60vh' }}>
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2" style={{ color: '#241F1D' }}>
          {t('duasPage.title')}
        </h1>
      </div>

      <DuaTekstoviSearch tekstovi={tekstovi} />
    </div>
  )
}
