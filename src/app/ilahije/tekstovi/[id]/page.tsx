import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function IlahijaTextPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  if (isNaN(id)) notFound()

  const tekst = await prisma.ilahijaText.findUnique({ where: { id } })
  if (!tekst || !tekst.published) notFound()

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16" style={{ minHeight: '60vh' }}>
      <Link href="/ilahije/tekstovi"
        className="inline-flex items-center gap-2 text-sm mb-8 hover:text-brand transition-colors"
        style={{ color: '#978A81' }}>
        <ArrowLeft size={14} /> Sve ilahije
      </Link>

      <header className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2" style={{ color: '#241F1D' }}>
          {tekst.title}
        </h1>
        {tekst.author && (
          <p className="text-sm font-medium" style={{ color: '#8B1E3F' }}>{tekst.author}</p>
        )}
      </header>

      <div
        className="prose prose-sm sm:prose max-w-none leading-relaxed whitespace-pre-wrap"
        style={{ color: '#3F3733', fontFamily: 'Georgia, serif', fontSize: '1rem', lineHeight: 1.9 }}
      >
        {tekst.content}
      </div>
    </div>
  )
}
