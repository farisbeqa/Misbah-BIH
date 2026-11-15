import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'
import Link from '@/i18n/navigation'
import { formatDate, href } from '@/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('legal.privacy.meta')
  return {
    title: t('title'),
    description: t('description'),
  }
}

const UPDATED = '2026-11-15'
const EMAIL = 'misbah.bosna@gmail.com'
const SITE = 'misbah-edu.com'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="font-bold text-[var(--fg-241f1d)] text-lg mb-3">{title}</h2>
      <div className="space-y-3 text-[var(--fg-746860)] leading-relaxed">{children}</div>
    </section>
  )
}

export default async function PrivatnostPage() {
  const t = await getTranslations('legal')
  // Markup and fixed values (e-mail and web addresses) used inside the texts
  const rich = {
    b: (chunks: ReactNode) => <b>{chunks}</b>,
    mail: (chunks: ReactNode) => <a href={`mailto:${EMAIL}`} className="text-[var(--fg-8b1e3f)] hover:underline">{chunks}</a>,
    deleteLink: (chunks: ReactNode) => <Link href="/obrisi-nalog" className="text-[var(--fg-8b1e3f)] hover:underline">{chunks}</Link>,
    termsLink: (chunks: ReactNode) => <Link href="/pravila-koristenja" className="text-[var(--fg-8b1e3f)] hover:underline">{chunks}</Link>,
    email: EMAIL,
    site: SITE,
    deleteUrl: `${SITE}${href('/obrisi-nalog')}`,
    prayerTimesSite: 'vaktija.ba',
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <p className="font-mono text-[11px] text-[var(--fg-a94a61)] uppercase tracking-widest mb-2">{t('tag')}</p>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--fg-241f1d)] tracking-tight mb-3">{t('privacy.title')}</h1>
      <p className="text-[var(--fg-978a81)] text-sm mb-10">{t('updated', { date: formatDate(UPDATED) })}</p>

      <Section title={t('privacy.about.title')}>
        <p>{t.rich('privacy.about.scope', rich)}</p>
        <p>{t('privacy.about.noAccountNeeded')}</p>
      </Section>

      <Section title={t('privacy.collected.title')}>
        <p>{t.rich('privacy.collected.account', rich)}</p>
        <p>{t.rich('privacy.collected.content', rich)}</p>
        <p>{t.rich('privacy.collected.technical', rich)}</p>
      </Section>

      <Section title={t('privacy.onDevice.title')}>
        <p>{t('privacy.onDevice.storage')}</p>
        <p>{t('privacy.onDevice.reminders')}</p>
      </Section>

      <Section title={t('privacy.notDone.title')}>
        <p>{t('privacy.notDone.text')}</p>
      </Section>

      <Section title={t('privacy.thirdParty.title')}>
        <p>{t.rich('privacy.thirdParty.text', rich)}</p>
      </Section>

      <Section title={t('privacy.retention.title')}>
        <p>{t('privacy.retention.text')}</p>
      </Section>

      <Section title={t('privacy.rights.title')}>
        <p>{t.rich('privacy.rights.text', rich)}</p>
      </Section>

      <Section title={t('privacy.children.title')}>
        <p>{t('privacy.children.text')}</p>
      </Section>

      <Section title={t('privacy.changes.title')}>
        <p>{t.rich('privacy.changes.text', rich)}</p>
      </Section>
    </div>
  )
}
