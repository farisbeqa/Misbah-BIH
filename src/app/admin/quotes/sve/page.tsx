import Link from 'next/link'
import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { ArrowLeft, Calendar } from 'lucide-react'
import DeleteButton from '../../dashboard/DeleteButton'

function fmt(d: Date) {
  return d.toLocaleDateString('bs-BA', { day: 'numeric', month: 'short', year: 'numeric' })
}

const TYPE_COLORS: Record<string, string> = { ajet: '#8B1E3F', hadis: '#2563EB', izreka: '#059669' }
const TYPE_LABELS: Record<string, string> = { ajet: 'Ajet', hadis: 'Hadis', izreka: 'Izreka' }

export default async function AdminQuotesSvePage() {
  const session = await requireAuth()
  if (!session) redirect('/admin')

  const quotes = await prisma.quote.findMany({ orderBy: { createdAt: 'desc' } })

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
          <h1 className="text-xl font-black text-zinc-900">
            Misao dana <span className="text-zinc-400 font-normal text-base">({quotes.length})</span>
          </h1>
          <Link href="/admin/quotes/new"
            className="text-sm font-semibold px-4 py-2 rounded-xl text-white transition-opacity hover:opacity-90"
            style={{ background: '#7C3AED' }}>
            + Dodaj misao
          </Link>
        </div>

        {quotes.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-zinc-200">
            <p className="text-zinc-400">Nema misli. Dodaj prvu.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-zinc-100 shadow-card overflow-hidden">
            {quotes.map((q, i) => (
              <div key={q.id}
                className={`flex items-start gap-3 px-4 py-3 hover:bg-zinc-50 transition-colors ${i > 0 ? 'border-t border-zinc-100' : ''}`}>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-full mt-0.5 shrink-0"
                  style={{ background: `${TYPE_COLORS[q.type] ?? '#7C3AED'}15`, color: TYPE_COLORS[q.type] ?? '#7C3AED' }}>
                  {TYPE_LABELS[q.type] ?? q.type}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-zinc-900 text-sm line-clamp-2">{q.text}</p>
                  <div className="flex items-center gap-1.5 text-zinc-400 text-xs mt-0.5">
                    {q.source && <span>{q.source} ·</span>}
                    <Calendar size={9} /><span>{fmt(q.createdAt)}</span>
                  </div>
                </div>
                <DeleteButton id={q.id} type="quote" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
