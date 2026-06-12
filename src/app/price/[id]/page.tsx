import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { ArrowLeft, BookOpen } from 'lucide-react'

export const revalidate = 3600

export async function generateMetadata({ params }: { params: { id: string } }) {
  const prica = await prisma.prica.findUnique({ where: { id: parseInt(params.id) } }).catch(() => null)
  if (!prica) return { title: 'Priča nije pronađena' }
  return {
    title: prica.title,
    description: prica.content.slice(0, 160).replace(/\n/g, ' '),
  }
}

const MONTHS = ['januar','februar','mart','april','maj','juni','juli','august','septembar','oktobar','novembar','decembar']
function fmt(d: Date) { return `${d.getDate()}. ${MONTHS[d.getMonth()]} ${d.getFullYear()}.` }

export default async function PricaDetailPage({ params }: { params: { id: string } }) {
  const prica = await prisma.prica.findUnique({
    where: { id: parseInt(params.id), published: true },
  }).catch(() => null)

  if (!prica) notFound()

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <Link href="/price"
        className="inline-flex items-center gap-2 text-[#978a81] hover:text-[#8b1e3f] mb-8 text-sm transition-colors">
        <ArrowLeft size={15} /> Poučne priče
      </Link>

      {prica.imageUrl && (
        <div className="mb-8 overflow-hidden rounded-sm" style={{ maxHeight: 400 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={prica.imageUrl} alt={prica.title} className="w-full object-cover" />
        </div>
      )}

      {!prica.imageUrl && (
        <div className="mb-8 h-48 flex items-center justify-center rounded-sm"
          style={{ background: 'linear-gradient(135deg,#8B1E3F,#5a1429)' }}>
          <BookOpen size={48} className="text-white/20" />
        </div>
      )}

      <p className="font-medium text-[#8b1e3f] text-xs uppercase tracking-widest mb-3">
        Poučna priča · {fmt(prica.createdAt)}
      </p>

      <h1 className="font-semibold text-[#141110] mb-4"
        style={{ fontSize: 'clamp(26px, 4vw, 40px)', lineHeight: 1.25, letterSpacing: '-0.4px' }}>
        {prica.title}
      </h1>

      {prica.author && (
        <p className="text-[#8b1e3f] font-medium text-base mb-8">— {prica.author}</p>
      )}

      <div className="prose prose-stone max-w-none">
        {prica.content.split('\n').filter(Boolean).map((para, i) => (
          <p key={i} className="text-[#5a4f49] leading-relaxed mb-4" style={{ fontSize: 17 }}>
            {para}
          </p>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-[#e8e1db]">
        <Link href="/price"
          className="inline-flex items-center gap-2 text-[#8b1e3f] hover:underline font-medium text-sm">
          <ArrowLeft size={14} /> Sve priče
        </Link>
      </div>
    </div>
  )
}
