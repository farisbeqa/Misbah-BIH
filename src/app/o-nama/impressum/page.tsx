import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Link from '@/i18n/navigation'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { BIOS } from '@/lib/bios'
import { UREDNICI, DRUSTVENE_MREZE, AUTORI } from '@/lib/team'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('about.impressum.meta')
  return { title: t('title') }
}

function MemberCard({ name, slug, photo, accent, bioLabel }: { name: string; slug?: string; photo?: string; accent: string; bioLabel: string }) {
  const bio = slug ? BIOS[slug] : undefined
  const photoSrc = bio?.photo ?? photo
  return (
    <li className="flex items-center gap-3 py-2">
      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 shadow-sm">
        {photoSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoSrc} alt={name} className="w-full h-full object-cover object-top" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: accent }}>
            {name[0]}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-warm-900 truncate">{name}</p>
      </div>
      {slug && (
        <Link href={`/o-nama/tim/${slug}`}
          className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors hover:opacity-80 flex-shrink-0"
          style={{ background: '#F5EDE8', color: '#8B1E3F' }}>
          {bioLabel} <ExternalLink size={10} className="flip-rtl" />
        </Link>
      )}
    </li>
  )
}

export default async function ImpressumPage() {
  const t = await getTranslations('about.impressum')
  const bioLabel = t('biography')

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Link href="/o-nama"
        className="inline-flex items-center gap-2 text-warm-400 hover:text-warm-700 text-sm mb-8 transition-colors font-mono">
        <ArrowLeft size={14} className="flip-rtl" /> {t('back')}
      </Link>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-warm-900 tracking-tight mb-10">{t('title')}</h1>

      {/* About */}
      <section className="mb-10 p-6 rounded-2xl" style={{ background: '#FAF7F2', border: '1px solid #E8E1DB' }}>
        <h2 className="font-bold text-warm-900 mb-4">{t('platform.title')}</h2>
        <div className="space-y-3 text-sm text-warm-700 leading-relaxed">
          <p>
            {t('platform.text1')}
          </p>
          <p>
            {t('platform.text2')}
          </p>
        </div>
      </section>

      {/* Team */}
      <section className="mb-10">
        <h2 className="font-bold text-warm-900 mb-5 text-lg">{t('editorial.title')}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl" style={{ background: '#FAF7F2', border: '1px solid #E8E1DB' }}>
            <p className="font-mono text-[11px] uppercase tracking-widest mb-3" style={{ color: '#A94A61' }}>{t('editorial.editors')}</p>
            <ul className="divide-y divide-[#EDE5DB]">
              {UREDNICI.map(m => (
                <MemberCard key={m.name} name={m.name} slug={m.slug} accent="#8B1E3F" bioLabel={bioLabel} />
              ))}
            </ul>
          </div>
          <div className="p-5 rounded-2xl" style={{ background: '#FAF7F2', border: '1px solid #E8E1DB' }}>
            <p className="font-mono text-[11px] uppercase tracking-widest mb-3" style={{ color: '#A94A61' }}>{t('editorial.socialMedia')}</p>
            <ul className="divide-y divide-[#EDE5DB]">
              {DRUSTVENE_MREZE.map(m => (
                <MemberCard key={m.name} name={m.name} slug={m.slug} photo={m.photo} accent="#C8A96B" bioLabel={bioLabel} />
              ))}
            </ul>
          </div>
          <div className="p-5 rounded-2xl sm:col-span-2" style={{ background: '#FAF7F2', border: '1px solid #E8E1DB' }}>
            <p className="font-mono text-[11px] uppercase tracking-widest mb-3" style={{ color: '#A94A61' }}>{t('editorial.authors')}</p>
            <ul className="divide-y divide-[#EDE5DB]">
              {AUTORI.map(m => (
                <MemberCard key={m.name} name={m.name} slug={m.slug} photo={m.photo} accent="#8B1E3F" bioLabel={bioLabel} />
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Copyright */}
      <section className="p-6 rounded-2xl" style={{ background: '#FAF7F2', border: '1px solid #E8E1DB' }}>
        <h2 className="font-bold text-warm-900 mb-4">{t('copyright.title')}</h2>
        <div className="space-y-3 text-sm text-warm-600 leading-relaxed">
          <p>
            {t('copyright.text1')}
          </p>
          <p>
            {t('copyright.text2')}
          </p>
          <p>
            {t('copyright.text3')}
          </p>
        </div>
      </section>

      <p className="font-mono text-xs text-warm-300 mt-8 text-center">
        © {new Date().getFullYear()} Strossa d.o.o. · Misbah EDU
      </p>
    </div>
  )
}
