import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'
import Link from '@/i18n/navigation'
import DeleteAccountForm from './DeleteAccountForm'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('account.deleteAccount.meta')
  return {
    title: t('title'),
    description: t('description'),
  }
}

const EMAIL = 'misbah.bosna@gmail.com'

export default async function ObrisiNalogPage() {
  const t = await getTranslations('account.deleteAccount')
  const b = (chunks: ReactNode) => <b>{chunks}</b>
  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(t('mailSubject'))}`

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <p className="font-mono text-[11px] text-[var(--fg-a94a61)] uppercase tracking-widest mb-2">{t('tag')}</p>
      <h1 className="text-3xl font-extrabold text-[var(--fg-241f1d)] tracking-tight mb-4">{t('title')}</h1>
      <div className="space-y-3 text-[var(--fg-746860)] leading-relaxed mb-8">
        <p>{t.rich('whatIsDeleted', { b })}</p>
        <p>{t.rich('inApp', { b })}</p>
      </div>

      <DeleteAccountForm />

      <p className="text-sm text-[var(--fg-978a81)] mt-8">
        {t.rich('cannotLogIn', {
          email: EMAIL,
          mail: chunks => <a href={mailto} className="text-[var(--fg-8b1e3f)] hover:underline">{chunks}</a>,
          privacyLink: chunks => <Link href="/privatnost" className="text-[var(--fg-8b1e3f)] hover:underline">{chunks}</Link>,
        })}
      </p>
    </div>
  )
}
