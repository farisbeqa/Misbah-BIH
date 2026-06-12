import { prisma } from '@/lib/db'
import { BookOpen } from 'lucide-react'
import MektebGrid from './MektebGrid'

export const dynamic = 'force-dynamic'

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
        <MektebGrid posts={posts} />
      )}
    </div>
  )
}
