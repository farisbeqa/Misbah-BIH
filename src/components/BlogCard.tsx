'use client'
import { useTranslations } from 'next-intl'
import Link, { useCurrentLocale } from '@/i18n/navigation'
import { formatShortDate } from '@/i18n/format'

/** Blog categories in display order: database value → message key (blog.categories.*) */
export const BLOG_CATEGORIES = [
  { value: 'hutbe',         key: 'hutbe' },
  { value: 'aktuelne-teme', key: 'aktuelneTeme' },
  { value: 'duhovnost',     key: 'duhovnost' },
  { value: 'tefsir-kuran',  key: 'tefsirKuran' },
  { value: 'sira',          key: 'sira' },
  { value: 'fikh',          key: 'fikh' },
  { value: 'savjeti',       key: 'savjeti' },
  { value: 'odgoj',         key: 'odgoj' },
] as const

interface BlogCardProps {
  id: number
  title: string
  content: string
  author?: string | null
  imageUrl?: string | null
  category?: string | null
  createdAt: string | Date
}

export default function BlogCard({ id, title, content, author, imageUrl, category, createdAt }: BlogCardProps) {
  const t = useTranslations('blog')
  const locale = useCurrentLocale()
  const cat = BLOG_CATEGORIES.find(c => c.value === category)

  return (
    <Link href={`/blog/${id}`} className="group block h-full">
      <div className="bg-[var(--bg-f5f2ef)] overflow-hidden border border-[var(--line-black5)] flex flex-col h-full">
        <div className="relative h-[228px] w-full shrink-0 overflow-hidden">
          {imageUrl
            ? <img alt={title} src={imageUrl} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
            : <div className="absolute inset-0 bg-[var(--bg-e0d8d0)]" />
          }
          {cat && (
            <div className="absolute top-4 start-4 bg-[var(--bg-faf5f5)] px-2.5 py-1.5">
              <span className="text-[var(--fg-8b1e3f)] uppercase" style={{ fontSize: 10, letterSpacing: '0.3px' }}>
                {t(`categories.${cat.key}`)}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2.5 px-6 py-7 flex-1">
          <p className="font-medium text-[var(--fg-8b1e3f)] text-xs uppercase tracking-wide">{formatShortDate(createdAt, locale)}</p>
          <p className="font-medium text-[var(--fg-241f1d)] leading-[1.12] line-clamp-2 group-hover:text-[var(--fg-8b1e3f)] transition-colors"
            style={{ fontSize: 20, letterSpacing: '-0.6px' }}>
            {title}
          </p>
          {author && (
            <p className="font-normal text-[var(--fg-5a4f49)] text-base leading-normal">{author}</p>
          )}
          <p className="font-normal text-[var(--fg-5a4f49)] text-base leading-normal line-clamp-3 mt-auto">
            {content.replace(/\n+/g, ' ').trim()}
          </p>
        </div>
      </div>
    </Link>
  )
}
