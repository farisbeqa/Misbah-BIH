import { getTranslations } from 'next-intl/server'
import { prisma } from '@/lib/db'
import { localizeRows } from '@/lib/translations'
import { getLocale } from '@/i18n/server'
import { BookOpen } from 'lucide-react'
import PriceGrid from './PriceGrid'

// Rendered per request: the database is reachable at runtime, not during the build
export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const t = await getTranslations('blog')
  return {
    title: t('storiesPage.meta.title'),
    description: t('storiesPage.meta.description'),
  }
}

export default async function PricePage() {
  const t = await getTranslations('blog')
  const rows = await prisma.prica.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  }).catch(() => [])
  const price = await localizeRows('prica', rows, getLocale())

  return (
    <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20 py-12 sm:py-16" style={{ minHeight: '60vh' }}>
      <div className="mb-12">
        <p className="font-medium text-[var(--fg-8b1e3f)] text-base mb-2">{t('storiesPage.tag')}</p>
        <h1 className="font-semibold text-[var(--fg-141110)] mb-3"
          style={{ fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.3, letterSpacing: '-0.44px' }}>
          {t('storiesPage.title')}
        </h1>
        <p className="font-normal text-[var(--fg-746860)]" style={{ fontSize: 18 }}>
          {t('storiesPage.subtitle')}
        </p>
      </div>

      {price.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-[var(--bg-f5f2ef)] border border-[var(--line-black5)]">
          <BookOpen size={36} className="text-[var(--fg-d6ccc3)] mb-3" />
          <p className="text-sm text-[var(--fg-a89888)]">{t('storiesPage.empty')}</p>
        </div>
      ) : (
        <PriceGrid price={price} />
      )}
    </div>
  )
}
