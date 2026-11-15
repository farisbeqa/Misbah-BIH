'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Search } from 'lucide-react'
import BlogCard, { BLOG_CATEGORIES } from './BlogCard'

interface Post {
  id: number
  title: string
  content: string
  author?: string | null
  imageUrl?: string | null
  category: string
  createdAt: Date | string
}

const CATEGORIES = [
  { value: 'sve', key: 'all' },
  ...BLOG_CATEGORIES,
]

const PAGE = 12

export default function BlogSearch({ posts }: { posts: Post[] }) {
  const t = useTranslations('blog')
  const [query, setQuery]       = useState('')
  const [category, setCategory] = useState('sve')
  const [visible, setVisible]   = useState(PAGE)

  useEffect(() => { setVisible(PAGE) }, [query, category])

  const filtered = posts
    .filter(p => category === 'sve' || p.category === category)
    .filter(p => !query.trim() || p.title.toLowerCase().includes(query.toLowerCase()))
  const shown = filtered.slice(0, visible)

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map(c => (
          <button key={c.value} onClick={() => setCategory(c.value)}
            className={`px-4 py-2 text-sm font-medium transition-colors border ${
              category === c.value
                ? 'bg-[var(--bg-8b1e3f)] text-white border-[var(--line-8b1e3f)]'
                : 'bg-[var(--bg-ffffff)] text-[var(--fg-5a4f49)] border-[var(--line-d6ccc3)] hover:border-[var(--line-8b1e3f)]'
            }`}>
            {t(`categories.${c.key}`)}
          </button>
        ))}
      </div>

      {posts.length > 0 && (
        <div className="relative mb-8">
          <Search size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-[var(--fg-a89888)] pointer-events-none" />
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder={t('list.searchByTitle')}
            className="w-full ps-9 pe-4 py-2.5 border border-[var(--line-d6ccc3)] bg-[var(--bg-ffffff)] focus:outline-none focus:border-[var(--line-8b1e3f)] text-sm transition-colors" />
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="flex items-center justify-center py-20 bg-[var(--bg-f5f2ef)] border border-[var(--line-black5)]">
          <p className="text-sm text-[var(--fg-a89888)]">
            {query.trim() ? t('list.noResults', { query }) : t('blogPage.empty')}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {shown.map(p => (
              <BlogCard key={p.id} id={p.id} title={p.title} content={p.content}
                author={p.author} imageUrl={p.imageUrl} category={p.category} createdAt={p.createdAt} />
            ))}
          </div>
          {visible < filtered.length && (
            <div className="flex flex-col items-center gap-2 mt-10">
              <button onClick={() => setVisible(v => v + PAGE)}
                className="px-8 py-3 border border-[var(--line-d6ccc3)] text-[var(--fg-5a4f49)] text-sm font-medium hover:border-[var(--line-8b1e3f)] hover:text-[var(--fg-8b1e3f)] transition-colors">
                {t('list.loadMore', { count: filtered.length - visible })}
              </button>
              <p className="text-xs text-[var(--fg-a89888)]">{t('list.shown', { shown: shown.length, total: filtered.length })}</p>
            </div>
          )}
        </>
      )}
    </>
  )
}
