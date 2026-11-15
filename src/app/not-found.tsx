import { ArrowLeft } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Link from '@/i18n/navigation'

export default async function NotFound() {
  const t = await getTranslations('common.notFound')
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <p className="font-mono text-[11px] text-brand-light uppercase tracking-widest mb-4">{t('tag')}</p>
      <h1 className="text-4xl font-extrabold text-warm-900 tracking-tight mb-3">{t('title')}</h1>
      <p className="text-warm-500 text-sm mb-10 max-w-sm">{t('text')}</p>
      <Link href="/"
        className="inline-flex items-center gap-2 text-sm font-semibold text-white px-6 py-3 transition-colors"
        style={{ background: '#8B1E3F', borderRadius: 8 }}>
        <ArrowLeft size={15} className="flip-rtl" /> {t('back')}
      </Link>
    </div>
  )
}
