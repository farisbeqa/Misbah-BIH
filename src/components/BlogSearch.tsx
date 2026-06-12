'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import BlogCard from './BlogCard'

interface Post {
  id: number
  title: string
  content: string
  author?: string | null
  imageUrl?: string | null
  createdAt: Date | string
}

const PAGE = 12

export default function BlogSearch({ posts }: { posts: Post[] }) {
  const [query, setQuery]     = useState('')
  const [visible, setVisible] = useState(PAGE)

  useEffect(() => { setVisible(PAGE) }, [query])

  const filtered = query.trim()
    ? posts.filter(p => p.title.toLowerCase().includes(query.toLowerCase()))
    : posts
  const shown = filtered.slice(0, visible)

  return (
    <>
      {posts.length > 0 && (
        <div className="relative mb-8">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a89888] pointer-events-none" />
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Pretraži po naslovu..."
            className="w-full pl-9 pr-4 py-2.5 border border-[#D6CCC3] bg-white focus:outline-none focus:border-[#8b1e3f] text-sm transition-colors" />
        </div>
      )}
      {filtered.length === 0 ? (
        <div className="flex items-center justify-center py-20 bg-[#f5f2ef] border border-black/5">
          <p className="text-sm text-[#a89888]">
            {query.trim() ? `Nema rezultata za "${query}"` : 'Nema blog postova još uvijek'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {shown.map(p => (
              <BlogCard key={p.id} id={p.id} title={p.title} content={p.content}
                author={p.author} imageUrl={p.imageUrl} createdAt={p.createdAt} />
            ))}
          </div>
          {visible < filtered.length && (
            <div className="flex flex-col items-center gap-2 mt-10">
              <button onClick={() => setVisible(v => v + PAGE)}
                className="px-8 py-3 border border-[#D6CCC3] text-[#5a4f49] text-sm font-medium hover:border-[#8b1e3f] hover:text-[#8b1e3f] transition-colors">
                Učitaj još ({filtered.length - visible} preostalih)
              </button>
              <p className="text-xs text-[#a89888]">Prikazano {shown.length} od {filtered.length}</p>
            </div>
          )}
        </>
      )}
    </>
  )
}
