import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'
import LikeButton from '@/components/LikeButton'
import CommentsSection from '@/components/CommentsSection'
import BlogImage from '@/components/BlogImage'

interface PageProps { params: { id: string } }

export async function generateMetadata({ params }: PageProps) {
  try {
    const post = await prisma.blogPost.findUnique({ where: { id: parseInt(params.id) } })
    if (!post) return { title: 'Post nije pronađen' }
    return { title: `${post.title} - Misbah EDU`, description: post.content.slice(0, 160) }
  } catch { return { title: 'Misbah EDU' } }
}

function formatDate(d: Date) {
  return d.toLocaleDateString('bs-BA', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await prisma.blogPost.findUnique({
    where: { id: parseInt(params.id), published: true },
    include: { _count: { select: { likes: true, comments: true } } },
  })
  if (!post) notFound()

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Link href="/blog"
        className="inline-flex items-center gap-2 text-warm-400 hover:text-warm-700 text-sm mb-10 transition-colors font-mono tracking-wide">
        <ArrowLeft size={14} /> Nazad na blog
      </Link>

      <article>
        {/* Cover image */}
        {post.imageUrl && (
          <div className="mb-10 overflow-hidden" style={{ borderRadius: 8 }}>
            <BlogImage src={post.imageUrl} alt={post.title} />
          </div>
        )}

        {/* Header */}
        <header className="mb-10">
          {/* Date */}
          <time className="font-mono text-xs text-brand-light tracking-widest block mb-4">
            {formatDate(post.createdAt)}
          </time>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-[2rem] font-extrabold text-warm-900 leading-[1.2] tracking-tight mb-6 break-words">
            {post.title}
          </h1>

          {/* Author */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              HS
            </div>
            <div>
              <p className="font-semibold text-warm-800 text-sm">Hamdo Solo</p>
              <p className="font-mono text-warm-400 text-[11px]">Imam džamije Carina · Sarajevo</p>
            </div>
          </div>

          {/* Rule */}
          <div className="mt-8 h-px"
            style={{ background: 'linear-gradient(to right, #8B1E3F, #C8A96B40, transparent)' }} />
        </header>

        {/* Body - premium reading experience */}
        <div className="prose-blog">
          {post.content.split('\n').map((line, i) =>
            line.trim()
              ? <p key={i}>{line}</p>
              : <div key={i} className="h-2" />
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 flex items-center justify-between flex-wrap gap-4"
          style={{ borderTop: '1px solid #E8E1DB' }}>
          <time className="font-mono text-[11px] text-warm-400">{formatDate(post.createdAt)}</time>
          <Link href="/blog" className="font-mono text-xs text-brand hover:text-brand-light transition-colors tracking-wide">
            ← Sve objave
          </Link>
        </footer>
      </article>

      {/* Likes + Comments */}
      <div className="mt-12 space-y-8" style={{ borderTop: '1px solid #E8E1DB', paddingTop: 32 }}>
        <LikeButton targetType="blog" targetId={post.id} initialCount={post._count.likes} />
        <CommentsSection targetType="blog" targetId={post.id} />
      </div>
    </div>
  )
}
