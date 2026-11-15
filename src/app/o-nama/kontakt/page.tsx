import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Link from '@/i18n/navigation'
import { ArrowLeft, Mail, Phone } from 'lucide-react'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('about.contact.meta')
  return { title: t('title') }
}

// ── Ažurirajte kontakt podatke ovdje ──────────────────────────────────────
const KONTAKT = {
  email: 'misbah.bosna@gmail.com',
  telefon: '', // ← unesite broj telefona, npr. '+387 61 000 000'
}
// ─────────────────────────────────────────────────────────────────────────

export default async function KontaktPage() {
  const t = await getTranslations('about.contact')

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Link href="/o-nama"
        className="inline-flex items-center gap-2 text-[var(--fg-b8aca2)] hover:text-[var(--fg-5a4f49)] text-sm mb-8 transition-colors font-mono">
        <ArrowLeft size={14} className="flip-rtl" /> {t('back')}
      </Link>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--fg-241f1d)] tracking-tight mb-3">{t('title')}</h1>
      <p className="text-[var(--fg-978a81)] text-sm mb-10">{t('text')}</p>

      <div className="space-y-4">
        {/* Email */}
        <a href={`mailto:${KONTAKT.email}`}
          className="flex items-center gap-4 p-5 rounded-2xl transition-all hover:-translate-y-0.5 group"
          style={{ background: 'var(--bg-faf7f2)', border: '1px solid var(--line-e8e1db)' }}>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--bg-8b1e3f)' }}>
            <Mail size={20} className="text-white" />
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--fg-b8aca2)] mb-0.5">{t('email')}</p>
            <p className="font-semibold text-[var(--fg-241f1d)] group-hover:text-[var(--fg-8b1e3f)] transition-colors" dir="ltr">{KONTAKT.email}</p>
          </div>
        </a>

        {/* Phone */}
        {KONTAKT.telefon && (
          <a href={`tel:${KONTAKT.telefon.replace(/\s/g, '')}`}
            className="flex items-center gap-4 p-5 rounded-2xl transition-all hover:-translate-y-0.5 group"
            style={{ background: 'var(--bg-faf7f2)', border: '1px solid var(--line-e8e1db)' }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--bg-8b1e3f)' }}>
              <Phone size={20} className="text-white" />
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--fg-b8aca2)] mb-0.5">{t('phone')}</p>
              <p className="font-semibold text-[var(--fg-241f1d)] group-hover:text-[var(--fg-8b1e3f)] transition-colors" dir="ltr">{KONTAKT.telefon}</p>
            </div>
          </a>
        )}
      </div>

      <div className="mt-10 p-5 rounded-2xl text-sm text-[var(--fg-746860)]" style={{ background: 'var(--bg-faf7f2)', border: '1px solid var(--line-e8e1db)' }}>
        <p className="font-bold text-[var(--fg-3f3733)] mb-2">{t('collaboration.title')}</p>
        <p>
          {t('collaboration.text')}
        </p>
      </div>
    </div>
  )
}
