import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import Link from '@/i18n/navigation'
import { ArrowLeft } from 'lucide-react'
import { BIOS, biosFor } from '@/lib/bios'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const bio = BIOS[params.slug]
  if (!bio) return { title: 'Misbah EDU' }
  return { title: `${bio.name} - Misbah EDU` }
}

export default async function TimBioPage({ params }: { params: { slug: string } }) {
  // Biography texts in the visitor's language (server-only `bios` messages)
  const bio = biosFor((await getTranslations('bios')).raw('people'))[params.slug]
  if (!bio) notFound()
  const t = await getTranslations('about.teamMember')

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Link href="/o-nama/impressum"
        className="inline-flex items-center gap-2 text-[var(--fg-b8aca2)] hover:text-[var(--fg-5a4f49)] text-sm mb-8 transition-colors font-mono">
        <ArrowLeft size={14} className="flip-rtl" /> {t('back')}
      </Link>

      {/* Header card */}
      <div className="flex flex-col sm:flex-row gap-6 items-start mb-10 p-6 rounded-2xl"
        style={{ background: 'var(--bg-faf7f2)', border: '1px solid var(--line-e8e1db)' }}>
        {bio.photo && (
          <div className="w-28 h-28 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={bio.photo} alt={bio.name} className="w-full h-full object-cover object-top" />
          </div>
        )}
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest mb-1" style={{ color: 'var(--fg-a94a61)' }}>
            {bio.role}
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--fg-241f1d)] tracking-tight mb-2">{bio.name}</h1>
          {bio.born && (
            <p className="text-sm text-[var(--fg-978a81)]">
              <span className="font-medium">{t('born')}</span> {bio.born}
            </p>
          )}
        </div>
      </div>

      {/* Bio sections */}
      <div className="space-y-6">
        {bio.sections.map(section => (
          <section key={section.title} className="p-6 rounded-2xl"
            style={{ background: 'var(--bg-faf7f2)', border: '1px solid var(--line-e8e1db)' }}>
            <h2 className="font-bold text-[var(--fg-241f1d)] mb-4 text-base">{section.title}</h2>
            <ul className="space-y-2.5">
              {section.items.map((item, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-[var(--fg-5a4f49)] leading-relaxed">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--bg-8b1e3f)' }} />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="font-mono text-xs text-[var(--fg-d6ccc3)] mt-10 text-center">
        © {new Date().getFullYear()} Misbah EDU
      </p>
    </div>
  )
}
