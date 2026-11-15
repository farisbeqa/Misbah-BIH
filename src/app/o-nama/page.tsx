import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Link from '@/i18n/navigation'
import { FileText, Mail, ArrowRight } from 'lucide-react'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('about.aboutUs.meta')
  return {
    title: t('title'),
    description: t('description'),
  }
}

// Weekly study circles (halke) and who leads them
const STUDY_CIRCLES = [
  { key: 'tafsir', name: 'hfz. Hamdo Solo' },
  { key: 'sira',   name: 'Hamza ef. Bajraktarević' },
  { key: 'hadith', name: 'Zeko ef. Hasanović' },
] as const

export default async function ONamaPage() {
  const t = await getTranslations('about.aboutUs')

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <div className="mb-12">
        <p className="font-mono text-[11px] text-brand-light uppercase tracking-widest mb-2">{t('tag')}</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-warm-900 tracking-tight mb-4">{t('title')}</h1>
        <p className="text-warm-500 leading-relaxed">
          {t('intro')}
        </p>
        <br />
        <p className="text-warm-500 leading-relaxed">
          {t('studyCircles.intro')}
        </p>
        <ul className="mt-4 space-y-4 text-warm-500 leading-relaxed list-none">
          {STUDY_CIRCLES.map(circle => (
            <li key={circle.key}>
              {t.rich(`studyCircles.${circle.key}`, {
                name: circle.name,
                b: chunks => <span className="font-semibold text-warm-900">{chunks}</span>,
              })}
            </li>
          ))}
        </ul>
        <p className="text-warm-500 leading-relaxed mt-4">
          {t('studyCircles.outro')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { href: '/o-nama/impressum', icon: <FileText size={22} />, title: t('cards.impressum.title'), desc: t('cards.impressum.description') },
          { href: '/o-nama/kontakt',   icon: <Mail size={22} />,     title: t('cards.contact.title'),   desc: t('cards.contact.description') },
        ].map(card => (
          <Link key={card.href} href={card.href}
            className="group flex items-center gap-4 p-5 rounded-2xl transition-all hover:-translate-y-0.5"
            style={{ background: '#FAF7F2', border: '1px solid #E8E1DB' }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: '#8B1E3F', color: 'white' }}>
              {card.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-warm-900">{card.title}</p>
              <p className="text-sm text-warm-500 mt-0.5">{card.desc}</p>
            </div>
            <ArrowRight size={16} className="text-warm-300 group-hover:text-brand transition-colors flex-shrink-0 flip-rtl" />
          </Link>
        ))}
      </div>
    </div>
  )
}
