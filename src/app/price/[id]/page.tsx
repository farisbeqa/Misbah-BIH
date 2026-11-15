import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import Link from '@/i18n/navigation'
import { getLocale, formatDate } from '@/i18n/server'
import { LOCALE_INFO } from '@/i18n/config'
import { prisma } from '@/lib/db'
import { localizeRow, localizeRows } from '@/lib/translations'
import { ArrowLeft, BookOpen } from 'lucide-react'
import MoreFromAuthor from '@/components/MoreFromAuthor'
import MachineTranslationNote from '@/components/MachineTranslationNote'

// Rendered per request: the database is reachable at runtime, not during the build
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { id: string } }) {
  const found = await prisma.prica.findUnique({ where: { id: parseInt(params.id) } }).catch(() => null)
  const prica = await localizeRow('prica', found, getLocale())
  if (!prica) {
    const t = await getTranslations('blog')
    return { title: t('story.notFound') }
  }
  return {
    title: prica.title,
    description: prica.content.slice(0, 160).replace(/\n/g, ' '),
  }
}

export default async function PricaDetailPage({ params }: { params: { id: string } }) {
  const found = await prisma.prica.findUnique({
    where: { id: parseInt(params.id), published: true },
  }).catch(() => null)

  if (!found) notFound()

  const locale = getLocale()
  const t = await getTranslations('blog')
  const [prica] = await localizeRows('prica', [found], locale)
  const rtl = LOCALE_INFO[locale].dir === 'rtl'

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <Link href="/price"
        className="inline-flex items-center gap-2 text-[var(--fg-978a81)] hover:text-[var(--fg-8b1e3f)] mb-8 text-sm transition-colors">
        <ArrowLeft size={15} className="flip-rtl" /> {t('story.back')}
      </Link>

      {prica.imageUrl && (
        <div className="mb-8 overflow-hidden rounded-sm" style={{ maxHeight: 400 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={prica.imageUrl} alt={prica.title} className="w-full object-cover" />
        </div>
      )}

      {!prica.imageUrl && (
        <div className="mb-8 h-48 flex items-center justify-center rounded-sm"
          style={{ background: 'linear-gradient(135deg,var(--bg-8b1e3f),var(--bg-5a1429))' }}>
          <BookOpen size={48} className="text-white/20" />
        </div>
      )}

      <p className="font-medium text-[var(--fg-8b1e3f)] text-xs uppercase tracking-widest mb-3">
        {t('story.kicker', { date: formatDate(prica.createdAt) })}
      </p>

      <h1 className="font-semibold text-[var(--fg-141110)] mb-4"
        style={{ fontSize: 'clamp(26px, 4vw, 40px)', lineHeight: 1.25, letterSpacing: '-0.4px' }}>
        {prica.title}
      </h1>

      {prica.author && (
        <p className="text-[var(--fg-8b1e3f)] font-medium text-base mb-8">— {prica.author}</p>
      )}

      <MachineTranslationNote show={prica.translated} className="mb-6" />

      <div className="prose prose-stone max-w-none">
        {prica.content.split('\n').filter(Boolean).map((para, i) => (
          // Right-to-left pages: a paragraph left untranslated keeps its own direction
          <p key={i} dir={rtl ? 'auto' : undefined} className="text-[var(--fg-5a4f49)] leading-relaxed mb-4" style={{ fontSize: 17 }}>
            {para}
          </p>
        ))}
      </div>

      {/* Author lookup uses the original (Bosnian) title */}
      <MoreFromAuthor author={prica.author} title={found.title} className="mt-10" />

      <div className="mt-12 pt-8 border-t border-[var(--line-e8e1db)]">
        <Link href="/price"
          className="inline-flex items-center gap-2 text-[var(--fg-8b1e3f)] hover:underline font-medium text-sm">
          <ArrowLeft size={14} className="flip-rtl" /> {t('story.allStories')}
        </Link>
      </div>
    </div>
  )
}
