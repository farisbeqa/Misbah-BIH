import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import Link from '@/i18n/navigation'
import { resolveAuthors } from '@/lib/authors'
import { BIOS } from '@/lib/bios'

function initials(name: string) {
  const parts = name.replace(/\b(hfz|ef)\.?\s*/gi, '').split(/\s+/).filter(Boolean)
  return parts.length >= 2 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : (parts[0]?.[0] ?? '?').toUpperCase()
}

/**
 * "Vidi više od ovog autora" box shown under any published content item.
 * Pass the original (Bosnian) title: it is used to find the author when the
 * author field is empty.
 */
export default function MoreFromAuthor({ author, title, className = '' }: { author?: string | null; title?: string | null; className?: string }) {
  const t = useTranslations('blog')
  const authors = resolveAuthors(author, title)
  if (authors.length === 0) return null

  return (
    <div className={`space-y-3 ${className}`}>
      {authors.map(a => {
        const photo = a.bioSlug ? BIOS[a.bioSlug]?.photo : undefined
        return (
          <Link key={a.slug} href={`/autori/${a.slug}`}
            className="group flex items-center gap-4 p-4 sm:p-5 transition-colors hover:bg-[var(--bg-f3ece4)]"
            style={{ background: 'var(--bg-faf7f2)', border: '1px solid var(--line-e8e1db)', borderRadius: 8 }}>
            {photo
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={photo} alt={a.name} className="w-12 h-12 rounded-full object-cover object-top flex-shrink-0" />
              : <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ background: 'var(--bg-8b1e3f)' }}>
                  {initials(a.name)}
                </div>
            }
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--fg-b8aca2)]">{t('moreFromAuthor.label')}</p>
              <p className="font-semibold text-[var(--fg-241f1d)] truncate">{a.name}</p>
            </div>
            <span className="flex items-center gap-1.5 text-sm font-medium whitespace-nowrap" style={{ color: 'var(--fg-8b1e3f)' }}>
              <span className="hidden sm:inline">{t('moreFromAuthor.seeMore')}</span>
              <span className="sm:hidden">{t('moreFromAuthor.seeMoreShort')}</span>
              {/* rtl: keeps the arrow mirrored while it moves towards the end on hover */}
              <ArrowRight size={15} className="flip-rtl transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
            </span>
          </Link>
        )
      })}
    </div>
  )
}
