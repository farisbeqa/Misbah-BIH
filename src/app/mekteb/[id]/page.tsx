import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar } from 'lucide-react'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

const MONTHS = ['januar','februar','mart','april','maj','juni','juli','august','septembar','oktobar','novembar','decembar']
function fmt(d: Date) { return `${d.getDate()}. ${MONTHS[d.getMonth()]} ${d.getFullYear()}.` }

const CAT_LABELS: Record<string, string> = {
  opste: 'Opšte', program: 'Plan i program', kviz: 'Kviz', materijali: 'Materijali',
}

interface PageProps { params: { id: string } }

export async function generateMetadata({ params }: PageProps) {
  try {
    const p = await prisma.mektebPost.findUnique({ where: { id: parseInt(params.id) } })
    return p ? { title: `${p.title} — Mekteb EDU`, alternates: { canonical: `/mekteb/${params.id}` } } : { title: 'Misbah EDU' }
  } catch { return { title: 'Misbah EDU' } }
}

export default async function MektebPostPage({ params }: PageProps) {
  const id = parseInt(params.id)
  if (isNaN(id)) notFound()

  const post = await prisma.mektebPost.findUnique({ where: { id, published: true } }).catch(() => null)
  if (!post) notFound()

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12" style={{ minHeight: '60vh' }}>
      <Link href="/mekteb"
        className="inline-flex items-center gap-2 text-sm mb-8 hover:text-brand transition-colors"
        style={{ color: '#978A81' }}>
        <ArrowLeft size={14} /> Mekteb EDU
      </Link>

      {post.imageUrl && (
        <div className="mb-8 overflow-hidden rounded-xl" style={{ aspectRatio: '16/9' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
          {CAT_LABELS[post.category] ?? post.category}
        </span>
        <div className="flex items-center gap-1.5">
          <Calendar size={12} style={{ color: '#A94A61' }} />
          <time className="text-xs font-mono tracking-wide" style={{ color: '#A94A61' }}>{fmt(post.createdAt)}</time>
        </div>
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-warm-900 leading-tight tracking-tight mb-3 break-words">
        {post.title}
      </h1>
      {post.author && (
        <p className="text-sm font-medium mb-8" style={{ color: '#1D4ED8' }}>{post.author}</p>
      )}

      <div className="prose-blog">
        {post.content.split('\n').map((line, i) =>
          line.trim() ? <p key={i}>{line}</p> : <div key={i} className="h-2" />
        )}
      </div>

      <div className="mt-10 pt-6 flex justify-center" style={{ borderTop: '1px solid #E8E1DB' }}>
        <Link href="/mekteb"
          className="inline-flex items-center gap-2 font-mono text-xs text-warm-400 hover:text-warm-700 transition-colors px-4 py-2"
          style={{ border: '1px solid #E8E1DB', borderRadius: 6 }}>
          ← Svi sadržaji
        </Link>
      </div>
    </div>
  )
}
