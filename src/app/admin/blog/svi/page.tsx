import Link from 'next/link'
import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { ArrowLeft, BookOpen, Calendar, ExternalLink, Pencil } from 'lucide-react'
import DeleteButton from '../../dashboard/DeleteButton'

function fmt(d: Date) {
  return d.toLocaleDateString('bs-BA', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function AdminBlogSviPage() {
  const session = await requireAuth()
  if (!session) redirect('/admin')

  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div className="min-h-screen bg-zinc-50">
      <nav className="bg-zinc-950 text-white px-4 sm:px-6 py-4 sticky top-0 z-30 border-b border-zinc-800">
        <div className="max-w-4xl mx-auto flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center text-white font-black text-sm">م</div>
          <span className="font-black text-sm">Misbah EDU</span>
          <span className="text-zinc-500 text-xs px-2 py-0.5 bg-zinc-800 rounded-md">Admin</span>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-800 mb-6 text-sm">
          <ArrowLeft size={15} /> Nazad na dashboard
        </Link>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-black text-zinc-900">Blog postovi <span className="text-zinc-400 font-normal text-base">({posts.length})</span></h1>
          <Link href="/admin/blog/new"
            className="text-sm font-semibold px-4 py-2 rounded-xl text-zinc-900 transition-opacity hover:opacity-90 bg-amber-400">
            + Dodaj
          </Link>
        </div>
        {posts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-zinc-200">
            <p className="text-zinc-400">Nema blog postova.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-zinc-100 shadow-card overflow-hidden">
            {posts.map((p, i) => (
              <div key={p.id}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 transition-colors ${i > 0 ? 'border-t border-zinc-100' : ''}`}>
                <BookOpen size={15} className="text-amber-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-zinc-900 text-sm truncate">{p.title}</p>
                  <div className="flex items-center gap-1.5 text-zinc-400 text-xs mt-0.5">
                    <Calendar size={9} /><span>{fmt(p.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Link href={`/admin/blog/${p.id}/edit`} title="Uredi" className="p-1.5 text-zinc-300 hover:text-amber-500 transition-colors"><Pencil size={13} /></Link>
                  <Link href={`/blog/${p.id}`} target="_blank" title="Pregledaj" className="p-1.5 text-zinc-300 hover:text-zinc-600 transition-colors"><ExternalLink size={13} /></Link>
                  <DeleteButton id={p.id} type="blog" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
