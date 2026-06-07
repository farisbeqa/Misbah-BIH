import Link from 'next/link'
import { prisma } from '@/lib/db'
import { BookOpen, Calendar } from 'lucide-react'

export const dynamic = 'force-dynamic'

const MONTHS = ['jan','feb','mar','apr','maj','jun','jul','aug','sep','okt','nov','dec']
function fmt(d: Date) { return `${d.getDate()}. ${MONTHS[d.getMonth()]} ${d.getFullYear()}.` }

const CAT_LABELS: Record<string, string> = {
  opste: 'Opšte', program: 'Plan i program', kviz: 'Kviz', materijali: 'Materijali',
}

export default async function MektebPage() {
  const posts = await prisma.mektebPost.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  }).catch(() => [])

  return (
    <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20 py-12 sm:py-16" style={{ minHeight: '60vh' }}>
      <div className="mb-12">
        <p className="font-medium text-[#8b1e3f] text-base mb-2">ISLAMSKO OBRAZOVANJE</p>
        <h1 className="font-semibold text-[#141110] mb-3"
          style={{ fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.3, letterSpacing: '-0.44px' }}>
          Mekteb EDU
        </h1>
        <p className="font-normal text-[#746860]" style={{ fontSize: 18 }}>
          Planovi, programi, kvizovi i materijali za mektebsku nastavu.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-[#f5f2ef] border border-black/5">
          <BookOpen size={36} className="text-[#D6CCC3] mb-3" />
          <p className="text-sm text-[#a89888]">Nema sadržaja još uvijek</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <Link key={post.id} href={`/mekteb/${post.id}`} className="group block h-full">
              <div className="bg-[#f5f2ef] overflow-hidden border border-black/5 flex flex-col h-full">
                <div className="relative h-[228px] w-full shrink-0 overflow-hidden">
                  {post.imageUrl
                    ? <img src={post.imageUrl} alt={post.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
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
      )}
    </div>
  )
}
