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
        className="inline-flex items-center gap-2 text-sm mb-8 hover:text-brand transition-colors"
        style={{ color: '#978A81' }}>
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
          <Calendar size={12} style={{ color: '#A94A61' }} />
          <time className="text-xs font-mono tracking-wide" style={{ color: '#A94A61' }}>{formatDate(post.createdAt)}</time>
        </div>
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-warm-900 leading-tight tracking-tight mb-3 break-words">
        {post.title}
      </h1>
      {post.author && (
        <p className="text-sm font-medium mb-8" style={{ color: '#1D4ED8' }}>{post.author}</p>
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

      <div className="mt-10 pt-6 flex justify-center" style={{ borderTop: '1px solid #E8E1DB' }}>
        <Link href="/mekteb"
          className="inline-flex items-center gap-2 font-mono text-xs text-warm-400 hover:text-warm-700 transition-colors px-4 py-2"
          style={{ border: '1px solid #E8E1DB', borderRadius: 6 }}>
          {`${rtl ? '→' : '←'} ${t('mektebPost.allPosts')}`}
        </Link>
      </div>
    </div>
  )
}
