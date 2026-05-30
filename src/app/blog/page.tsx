import { prisma } from '@/lib/db'
import BlogCard from '@/components/BlogCard'
import { FileText } from 'lucide-react'

export const metadata = {
  title: 'Blog — Misbah BIH',
  description: 'Islamski tekstovi i razmišljanja',
}

async function getPosts() {
  try {
    return await prisma.blogPost.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' } })
  } catch { return [] }
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="mb-12">
        <p className="font-mono text-[11px] text-brand-light uppercase tracking-widest mb-2">Tekstovi</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-warm-900 tracking-tight mb-2">Blog</h1>
        <p className="text-warm-500 text-sm">Islamski tekstovi, razmišljanja i članci</p>
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-warm-400"
          style={{ background: '#FAF7F2', border: '1px dashed #E8E1DB', borderRadius: 8 }}>
          <FileText size={40} className="text-warm-300 mb-3" />
          <p className="font-mono text-sm">Nema blog postova još uvijek</p>
        </div>
      ) : (
        <>
          <p className="font-mono text-[11px] text-warm-400 mb-6 tracking-wide">
            {posts.length} {posts.length === 1 ? 'objava' : 'objave'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(p => (
              <BlogCard key={p.id} id={p.id} title={p.title} content={p.content}
                imageUrl={p.imageUrl} createdAt={p.createdAt} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
