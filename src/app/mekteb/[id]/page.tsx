import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { ArrowLeft, Calendar } from 'lucide-react'
import Link from '@/i18n/navigation'
import { getLocale, formatDate } from '@/i18n/server'
import { LOCALE_INFO } from '@/i18n/config'
import { prisma } from '@/lib/db'
import { localizeRow, localizeRows } from '@/lib/translations'
import MoreFromAuthor from '@/components/MoreFromAuthor'
import MachineTranslationNote from '@/components/MachineTranslationNote'

export const dynamic = 'force-dynamic'

/** Categories with a label in blog.mektebCategories; any other value is shown as is */
const CATEGORIES: readonly string[] = ['opste', 'program', 'kviz', 'materijali']

interface PageProps { params: { id: string } }

export async function generateMetadata({ params }: PageProps) {
  try {
    const p = await localizeRow('mekteb', await prisma.mektebPost.findUnique({ where: { id: parseInt(params.id) } }), getLocale())
    return p ? { title: `${p.title} — Mekteb EDU` } : { title: 'Misbah EDU' }
  } catch { return { title: 'Misbah EDU' } }
}

export default async function MektebPostPage({ params }: PageProps) {
  const id = parseInt(params.id)
  if (isNaN(id)) notFound()

  const found = await prisma.mektebPost.findUnique({ where: { id, published: true } }).catch(() => null)
  if (!found) notFound()

  const locale = getLocale()
  const t = await getTranslations('blog')
  const [post] = await localizeRows('mekteb', [found], locale)
  const rtl = LOCALE_INFO[locale].dir === 'rtl'

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12" style={{ minHeight: '60vh' }}>
      <Link href="/mekteb"
        className="inline-flex items-center gap-2 text-sm mb-8 hover:text-[var(--fg-8b1e3f)] transition-colors"
        style={{ color: 'var(--fg-978a81)' }}>
        <ArrowLeft size={14} className="flip-rtl" /> Mekteb EDU
      </Link>

      {post.imageUrl && (
        <div className="mb-8 overflow-hidden rounded-xl" style={{ aspectRatio: '16/9' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
          {CATEGORIES.includes(post.category) ? t(`mektebCategories.${post.category}`) : post.category}
        </span>
        <div className="flex items-center gap-1.5">
          <Calendar size={12} style={{ color: 'var(--fg-a94a61)' }} />
          <time className="text-xs font-mono tracking-wide" style={{ color: 'var(--fg-a94a61)' }}>{formatDate(post.createdAt)}</time>
        </div>
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--fg-241f1d)] leading-tight tracking-tight mb-3 break-words">
        {post.title}
      </h1>
      {post.author && (
        <p className="text-sm font-medium mb-8" style={{ color: 'var(--fg-1d4ed8)' }}>{post.author}</p>
      )}

      <MachineTranslationNote show={post.translated} className="mb-6" />

      <div className="prose-blog">
        {post.content.split('\n').map((line, i) =>
          // Right-to-left pages: a paragraph left untranslated keeps its own direction
          line.trim() ? <p key={i} dir={rtl ? 'auto' : undefined}>{line}</p> : <div key={i} className="h-2" />
        )}
      </div>

      {/* Author lookup uses the original (Bosnian) title */}
      <MoreFromAuthor author={post.author} title={found.title} className="mt-10" />

      <div className="mt-10 pt-6 flex justify-center" style={{ borderTop: '1px solid var(--line-e8e1db)' }}>
        <Link href="/mekteb"
          className="inline-flex items-center gap-2 font-mono text-xs text-[var(--fg-b8aca2)] hover:text-[var(--fg-5a4f49)] transition-colors px-4 py-2"
          style={{ border: '1px solid var(--line-e8e1db)', borderRadius: 6 }}>
          {`${rtl ? '→' : '←'} ${t('mektebPost.allPosts')}`}
        </Link>
      </div>
    </div>
  )
}
