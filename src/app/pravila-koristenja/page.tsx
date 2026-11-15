import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'
import Link from '@/i18n/navigation'
import { formatDate, href } from '@/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('legal.terms.meta')
  return {
    title: t('title'),
    description: t('description'),
  }
}

const UPDATED = '2026-10-28'
const EMAIL = 'misbah.bosna@gmail.com'
const SITE = 'misbah-edu.com'

/** Kinds of forbidden comments, in the order they are listed */
const FORBIDDEN = ['insults', 'hate', 'explicit', 'spam', 'personalData'] as const

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="font-bold text-[var(--fg-241f1d)] text-lg mb-3">{title}</h2>
      <div className="space-y-3 text-[var(--fg-746860)] leading-relaxed">{children}</div>
    </section>
  )
}

export default async function PravilaPage() {
  const t = await getTranslations('legal')
  // Markup and fixed values (e-mail and web addresses) used inside the texts
  const rich = {
    b: (chunks: ReactNode) => <b>{chunks}</b>,
    mail: (chunks: ReactNode) => <a href={`mailto:${EMAIL}`} className="text-[var(--fg-8b1e3f)] hover:underline">{chunks}</a>,
    deleteLink: (chunks: ReactNode) => <Link href="/obrisi-nalog" className="text-[var(--fg-8b1e3f)] hover:underline">{chunks}</Link>,
    privacyLink: (chunks: ReactNode) => <Link href="/privatnost" className="text-[var(--fg-8b1e3f)] hover:underline">{chunks}</Link>,
    email: EMAIL,
    site: SITE,
    deleteUrl: `${SITE}${href('/obrisi-nalog')}`,
    prayerTimesSite: 'vaktija.ba',
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <p className="font-mono text-[11px] text-[var(--fg-a94a61)] uppercase tracking-widest mb-2">{t('tag')}</p>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--fg-241f1d)] tracking-tight mb-3">{t('terms.title')}</h1>
      <p className="text-[var(--fg-978a81)] text-sm mb-10">{t('updated', { date: formatDate(UPDATED) })}</p>

      <Section title={t('terms.acceptance.title')}>
        <p>{t.rich('terms.acceptance.text', rich)}</p>
      </Section>

      <Section title={t('terms.account.title')}>
        <p>{t('terms.account.text')}</p>
      </Section>

      <Section title={t('terms.comments.title')}>
        <p>{t.rich('terms.comments.intro', rich)}</p>
        <ul className="list-disc ps-5 space-y-1">
          {FORBIDDEN.map(key => <li key={key}>{t(`terms.comments.forbidden.${key}`)}</li>)}
        </ul>
        <p>{t('terms.comments.moderation')}</p>
      </Section>

      <Section title={t('terms.reporting.title')}>
        <p>{t.rich('terms.reporting.text', rich)}</p>
      </Section>

      <Section title={t('terms.copyright.title')}>
        <p>{t('terms.copyright.text')}</p>
      </Section>

      <Section title={t('terms.disclaimer.title')}>
        <p>{t.rich('terms.disclaimer.text', rich)}</p>
      </Section>

      <Section title={t('terms.deletion.title')}>
        <p>{t.rich('terms.deletion.text', rich)}</p>
      </Section>

      <Section title={t('terms.contact.title')}>
        <p>{t.rich('terms.contact.text', rich)}</p>
      </Section>
    </div>
  )
}
