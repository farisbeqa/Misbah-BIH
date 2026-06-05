'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookOpen, Calendar, ExternalLink, Pencil, Search } from 'lucide-react'
import DeleteButton from '../../dashboard/DeleteButton'

interface Post {
  id: number
  title: string
  createdAt: Date | string
}

function fmt(d: Date | string) {
  return new Date(d).toLocaleDateString('bs-BA', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function BlogListSearch({ posts }: { posts: Post[] }) {
  const [query, setQuery] = useState('')
  const filtered = query.trim()
    ? posts.filter(p => p.title.toLowerCase().includes(query.toLowerCase()))
    : posts

  return (
    <>
      <div className="relative mb-5">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
        <input value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Pretraži po naslovu..."
          className="w-full pl-9 pr-4 py-2 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand bg-white" />
      </div>
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-zinc-200">
          <p className="text-zinc-400">
            {query.trim() ? `Nema rezultata za "${query}"` : 'Nema blog postova.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-card overflow-hidden">
          {filtered.map((p, i) => (
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
    </>
  )
}
