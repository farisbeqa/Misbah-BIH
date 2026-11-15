import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Link from '@/i18n/navigation'
import { getAllAuthors } from '@/lib/authorContent'
import { BIOS } from '@/lib/bios'

// Rendered per request: the database is reachable at runtime, not during the build
export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('about.authors.meta')
  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function AutoriPage() {
  const t = await getTranslations('about.authors')
  const authors = await getAllAuthors().catch(() => [])

  return (
    <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20 py-12 sm:py-16">
      <div className="mb-12">
        <p className="font-medium text-[var(--fg-8b1e3f)] text-base mb-2">{t('tag')}</p>
        <h1 className="font-semibold text-[var(--fg-141110)] mb-3"
          style={{ fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.3, letterSpacing: '-0.44px' }}>
          {t('title')}
        </h1>
        <p className="font-normal text-[var(--fg-746860)]" style={{ fontSize: 18 }}>
          {t('text')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {authors.map(a => {
          const photo = a.bioSlug ? BIOS[a.bioSlug]?.photo : undefined
          return (
            <Link key={a.slug} href={`/autori/${a.slug}`}
              className="group flex items-center gap-4 p-4 bg-[var(--bg-f5f2ef)] border border-[var(--line-black5)] hover:border-[color:color-mix(in_srgb,var(--line-8b1e3f)_40%,transparent)] transition-colors">
              {photo
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={photo} alt={a.name} className="w-14 h-14 rounded-full object-cover object-top flex-shrink-0" />
                : <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0" style={{ background: 'var(--bg-8b1e3f)' }}>
                    {a.name.replace(/\b(hfz|ef)\.?\s*/gi, '').trim()[0]?.toUpperCase()}
                  </div>
              }
              <div className="min-w-0">
                <p className="font-semibold text-[var(--fg-241f1d)] truncate group-hover:text-[var(--fg-8b1e3f)] transition-colors">{a.name}</p>
                <p className="text-sm text-[var(--fg-746860)]">{t('posts', { count: a.count })}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
