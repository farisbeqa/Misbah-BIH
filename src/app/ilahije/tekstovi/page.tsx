import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { prisma } from '@/lib/db'
import { localizeRows } from '@/lib/translations'
import { getLocale } from '@/i18n/server'
import IlahijaTekstoviSearch from '@/components/IlahijaTekstoviSearch'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('texts')
  return {
    title: t('ilahijePage.meta.title'),
    description: t('ilahijePage.meta.description'),
  }
}

export default async function IlahijeTekstoviPage() {
  const t = await getTranslations('texts')
  const rows = await prisma.ilahijaText.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true, author: true },
  }).catch(() => [])
  // Only what the list shows (a translation also carries the meaning of the lyrics)
  const tekstovi = (await localizeRows('ilahija', rows, getLocale()))
    .map(({ id, title, author }) => ({ id, title, author }))

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16" style={{ minHeight: '60vh' }}>
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2" style={{ color: '#241F1D' }}>
          {t('ilahijePage.title')}
        </h1>
        <p className="text-sm" style={{ color: '#978A81' }}>
          {t('ilahijePage.subtitle')}
        </p>
      </div>

      <IlahijaTekstoviSearch tekstovi={tekstovi} />
    </div>
  )
}
