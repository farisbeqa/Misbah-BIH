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
    const row = await localizeRow('zikr', await prisma.zikrText.findUnique({ where: { id: parseInt(params.id) } }), getLocale())
    if (!row) return { title: 'Misbah EDU' }
    const t = await getTranslations('texts')
    return { title: t('zikr.metaTitle', { title: row.title }) }
  } catch { return { title: 'Misbah EDU' } }
}

export default async function ZikrTextPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  if (isNaN(id)) notFound()

  const found = await prisma.zikrText.findUnique({ where: { id } }).catch(() => null)
  if (!found || !found.published) notFound()

  const locale = getLocale()
  const t = await getTranslations('texts')
  // Translated as a whole: the Arabic text and the transliteration stay as they are
  const [tekst] = await localizeRows('zikr', [found], locale)
  // Right-to-left pages: every line keeps its own direction, Arabic letters in the site's Arabic font
  const rtlText = LOCALE_INFO[locale].dir === 'rtl'
    ? { unicodeBidi: 'plaintext' as const, fontFamily: 'Georgia, var(--font-arabic), serif' }
    : {}

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16" style={{ minHeight: '60vh' }}>
      <Link href="/zikrovi"
        className="inline-flex items-center gap-2 text-sm mb-8 hover:text-brand transition-colors"
        style={{ color: '#978A81' }}>
        <ArrowLeft size={14} className="flip-rtl" /> {t('zikr.back')}
      </Link>

      {tekst.thumbnailUrl && (
        <div className="mb-6 rounded-xl overflow-hidden max-h-64">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={tekst.thumbnailUrl} alt={tekst.title} className="w-full h-full object-cover" />
        </div>
      )}

      <header className="mb-6">
        <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: '#2563EB' }}>
          {t('zikr.tag')}
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2" style={{ color: '#241F1D' }}>
          {tekst.title}
        </h1>
        {tekst.author && (
          <p className="text-sm font-medium" style={{ color: '#2563EB' }}>{tekst.author}</p>
        )}
        <MachineTranslationNote show={tekst.translated} className="mt-3" />
      </header>

      {tekst.audioUrl && <IlahijaAudioPlayer audioUrl={tekst.audioUrl} />}

      {tekst.content && (
        <div
          className="prose prose-sm sm:prose max-w-none leading-relaxed whitespace-pre-wrap mt-6"
          style={{ color: '#3F3733', fontFamily: 'Georgia, serif', fontSize: '1rem', lineHeight: 1.9, ...rtlText }}
        >
          {tekst.content}
        </div>
      )}

      {/* Author lookup uses the original (Bosnian) title */}
      <MoreFromAuthor author={tekst.author} title={found.title} className="mt-10" />
    </div>
  )
}
