'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookOpen, Calendar } from 'lucide-react'

interface MektebPost {
  id: number; title: string; content: string; author: string | null
  imageUrl: string | null; category: string; createdAt: Date | string
}

const CAT_LABELS: Record<string, string> = {
  opste: 'Opšte', program: 'Plan i program', kviz: 'Kviz', materijali: 'Materijali',
}
const MONTHS = ['jan','feb','mar','apr','maj','jun','jul','aug','sep','okt','nov','dec']
function fmt(d: Date | string) {
  const dt = new Date(d)
  return `${dt.getDate()}. ${MONTHS[dt.getMonth()]} ${dt.getFullYear()}.`
}

const PAGE = 12

export default function MektebGrid({ posts }: { posts: MektebPost[] }) {
  const [visible, setVisible] = useState(PAGE)
  const shown = posts.slice(0, visible)

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {shown.map(post => (
          <Link key={post.id} href={`/mekteb/${post.id}`} className="group block h-full">
            <div className="bg-[#f5f2ef] overflow-hidden border border-black/5 flex flex-col h-full">
              <div className="relative h-[228px] w-full shrink-0 overflow-hidden">
                {post.imageUrl
                  ? <img src={post.imageUrl} alt={post.title} loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  : <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#1D4ED8,#1e3a8a)' }}>
                      <BookOpen size={36} className="text-white/30" />
                    </div>
                }
                <div className="absolute top-4 left-4 bg-[#faf5f5] px-2.5 py-1.5">
                  <span className="text-[#1D4ED8] uppercase" style={{ fontSize: 10, letterSpacing: '0.3px' }}>
                    {CAT_LABELS[post.category] ?? post.category}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2.5 px-6 py-7 flex-1">
                <div className="flex items-center gap-1.5">
                  <Calendar size={10} style={{ color: '#8B1E3F' }} />
                  <p className="font-medium text-[#8b1e3f] text-xs uppercase tracking-wide">{fmt(post.createdAt)}</p>
                </div>
                <p className="font-medium text-[#241f1d] leading-[1.12] line-clamp-2 group-hover:text-[#8b1e3f] transition-colors"
                  style={{ fontSize: 20, letterSpacing: '-0.6px' }}>
                  {post.title}
                </p>
                {post.author && (
                  <p className="font-normal text-[#5a4f49] text-base leading-normal">{post.author}</p>
                )}
                <p className="font-normal text-[#5a4f49] text-sm leading-normal line-clamp-3 mt-auto">
                  {post.content.replace(/\n+/g, ' ').trim()}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {visible < posts.length && (
        <div className="flex flex-col items-center gap-2 mt-10">
          <button onClick={() => setVisible(v => v + PAGE)}
            className="px-8 py-3 border border-[#D6CCC3] text-[#5a4f49] text-sm font-medium hover:border-[#8b1e3f] hover:text-[#8b1e3f] transition-colors">
            Učitaj još ({posts.length - visible} preostalih)
          </button>
          <p className="text-xs text-[#a89888]">Prikazano {shown.length} od {posts.length}</p>
        </div>
      )}
    </>
  )
}
