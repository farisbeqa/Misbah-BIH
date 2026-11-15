import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import Link from '@/i18n/navigation'
import { getLocale } from '@/i18n/server'
import { LOCALE_INFO } from '@/i18n/config'
import { prisma } from '@/lib/db'
import { localizeRow, localizeRows } from '@/lib/translations'
import { ArrowLeft } from 'lucide-react'
import IlahijaAudioPlayer from '@/components/IlahijaAudioPlayer'
import MoreFromAuthor from '@/components/MoreFromAuthor'
import MachineTranslationNote from '@/components/MachineTranslationNote'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    const row = await localizeRow('ilahija', await prisma.ilahijaText.findUnique({ where: { id: parseInt(params.id) } }), getLocale())
    if (!row) return { title: 'Misbah EDU' }
    const t = await getTranslations('texts')
    return { title: t('ilahija.metaTitle', { title: row.title }) }
  } catch { return { title: 'Misbah EDU' } }
}

export default async function IlahijaTextPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  if (isNaN(id)) notFound()

  const found = await prisma.ilahijaText.findUnique({ where: { id } }).catch(() => null)
  if (!found || !found.published) notFound()

  const locale = getLocale()
  const t = await getTranslations('texts')
  // `content` stays the original lyrics; other languages add the translated `meaning`
  const [tekst] = await localizeRows('ilahija', [found], locale)
  // Right-to-left pages: every line keeps its own direction, Arabic letters in the site's Arabic font
  const rtlText = LOCALE_INFO[locale].dir === 'rtl'
    ? { unicodeBidi: 'plaintext' as const, fontFamily: 'Georgia, var(--font-arabic), serif' }
    : {}

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16" style={{ minHeight: '60vh' }}>
      <Link href="/ilahije/tekstovi"
        className="inline-flex items-center gap-2 text-sm mb-8 hover:text-[var(--fg-8b1e3f)] transition-colors"
        style={{ color: 'var(--fg-978a81)' }}>
        <ArrowLeft size={14} className="flip-rtl" /> {t('ilahija.back')}
      </Link>

      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2" style={{ color: 'var(--fg-241f1d)' }}>
          {tekst.title}
        </h1>
        {tekst.author && (
          <p className="text-sm font-medium" style={{ color: 'var(--fg-8b1e3f)' }}>{tekst.author}</p>
        )}
        <MachineTranslationNote show={tekst.translated} className="mt-3" />
      </header>

      {tekst.audioUrl && <IlahijaAudioPlayer audioUrl={tekst.audioUrl} />}

      <div
        className="prose prose-sm sm:prose max-w-none leading-relaxed whitespace-pre-wrap"
        style={{ color: 'var(--fg-3f3733)', fontFamily: 'Georgia, serif', fontSize: '1rem', lineHeight: 1.9, ...rtlText }}
      >
        {tekst.content}
      </div>

      {tekst.meaning && (
        <div className="mt-10 pt-8" style={{ borderTop: '1px solid var(--line-e8e1db)' }}>
          <h2 className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: 'var(--fg-8b1e3f)' }}>
            {t('ilahija.meaning')}
          </h2>
          <div
            className="prose prose-sm sm:prose max-w-none leading-relaxed whitespace-pre-wrap"
            style={{ color: 'var(--fg-3f3733)', fontFamily: 'Georgia, serif', fontSize: '1rem', lineHeight: 1.9, ...rtlText }}
          >
            {tekst.meaning}
          </div>
        </div>
      )}

      {/* Author lookup uses the original (Bosnian) title */}
      <MoreFromAuthor author={tekst.author} title={found.title} className="mt-10" />
    </div>
  )
}
