import Link from 'next/link'
import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { ArrowLeft, Calendar, ExternalLink, Pencil } from 'lucide-react'
import DeleteButton from '../../dashboard/DeleteButton'

function fmt(d: Date) {
  return d.toLocaleDateString('bs-BA', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function AdminActivitiesSvePage() {
  const session = await requireAuth()
  if (!session) redirect('/admin')

  const activities = await prisma.activity.findMany({ orderBy: { date: 'desc' } })

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
          <h1 className="text-xl font-black text-zinc-900">Aktivnosti <span className="text-zinc-400 font-normal text-base">({activities.length})</span></h1>
          <Link href="/admin/activities/new"
            className="text-sm font-semibold px-4 py-2 rounded-xl text-white transition-opacity hover:opacity-90"
            style={{ background: '#2d6a4f' }}>
            + Dodaj
          </Link>
        </div>
        {activities.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-zinc-200">
            <p className="text-zinc-400">Nema aktivnosti.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-zinc-100 shadow-card overflow-hidden">
            {activities.map((a, i) => (
              <div key={a.id}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 transition-colors ${i > 0 ? 'border-t border-zinc-100' : ''}`}>
                <span className="text-base flex-shrink-0">🏔️</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-zinc-900 text-sm truncate">{a.title}</p>
                  <div className="flex items-center gap-1.5 text-zinc-400 text-xs mt-0.5">
                    <Calendar size={9} /><span>{fmt(a.date)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Link href={`/admin/activities/${a.id}/edit`} title="Uredi" className="p-1.5 text-zinc-300 hover:text-green-600 transition-colors"><Pencil size={13} /></Link>
                  <Link href={`/aktivnosti/${a.id}`} target="_blank" title="Pregledaj" className="p-1.5 text-zinc-300 hover:text-zinc-600 transition-colors"><ExternalLink size={13} /></Link>
                  <DeleteButton id={a.id} type="activity" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
