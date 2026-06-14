import { prisma } from '@/lib/db'
import { BookOpen } from 'lucide-react'
import PriceGrid from './PriceGrid'

export const revalidate = 60
export const metadata = { title: 'Poučne priče' }

export default async function PricePage() {
  const price = await prisma.prica.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  }).catch(() => [])

  return (
    <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20 py-12 sm:py-16" style={{ minHeight: '60vh' }}>
      <div className="mb-12">
        <p className="font-medium text-[#8b1e3f] text-base mb-2">ISLAMSKE PRIČE</p>
        <h1 className="font-semibold text-[#141110] mb-3"
          style={{ fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.3, letterSpacing: '-0.44px' }}>
          Poučne priče
        </h1>
        <p className="font-normal text-[#746860]" style={{ fontSize: 18 }}>
          Priče iz islamske tradicije koje bude srce, ulijevaju nadu i opominju uz podsjećanje na istinske vrijednosti života.
        </p>
      </div>

      {price.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-[#f5f2ef] border border-black/5">
          <BookOpen size={36} className="text-[#D6CCC3] mb-3" />
          <p className="text-sm text-[#a89888]">Nema priča još uvijek</p>
        </div>
      ) : (
        <PriceGrid price={price} />
      )}
    </div>
  )
}
