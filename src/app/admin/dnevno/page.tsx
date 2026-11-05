import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, BellRing, Plus, Pencil } from 'lucide-react'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { addDays, DAILY_RUBRICS, rubricOf, todayKey, weekdayOf, WEEKDAYS } from '@/lib/daily'

export const dynamic = 'force-dynamic'

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec']
function fmtDay(key: string) {
  const [, m, d] = key.split('-').map(Number)
  return `${d}. ${MONTHS[m - 1]}`
}

// Plan of the app's daily notifications: the next 14 days (gaps are easy to
// spot and fill) and the posts that already went out.
export default async function AdminDnevnoPage() {
  const session = await requireAuth()
  if (!session) redirect('/admin')

  const today = todayKey()
  const days = Array.from({ length: 14 }, (_, i) => addDays(today, i))
  const [upcoming, past] = await Promise.all([
    prisma.dailyPost.findMany({ where: { date: { gte: today, lte: days[13] } }, orderBy: [{ date: 'asc' }, { id: 'asc' }] }),
    prisma.dailyPost.findMany({ where: { date: { lt: today } }, orderBy: [{ date: 'desc' }, { id: 'desc' }], take: 60 }),
  ])
  const later = await prisma.dailyPost.count({ where: { date: { gt: days[13] } } })

  return (
    <div className="min-h-screen bg-zinc-50">
      <nav className="bg-zinc-950 text-white px-4 sm:px-6 py-4 sticky top-0 z-30 border-b border-zinc-800">
        <div className="max-w-5xl mx-auto flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center text-white font-black text-sm">م</div>
          <span className="font-black text-sm">Misbah EDU</span>
          <span className="text-zinc-500 text-xs font-medium px-2 py-0.5 bg-zinc-800 rounded-md">Admin</span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-800 mb-6 text-sm transition-colors">
          <ArrowLeft size={15} /> Nazad na dashboard
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-dim rounded-xl flex items-center justify-center flex-shrink-0">
              <BellRing size={20} className="text-brand" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-zinc-900">Dnevne poruke</h1>
              <p className="text-zinc-500 text-sm">Obavijesti u mobilnoj aplikaciji · jedna rubrika svaki dan</p>
            </div>
          </div>
          <Link href="/admin/dnevno/nova"
            className="inline-flex items-center gap-2 text-white font-semibold px-4 py-2.5 rounded-xl text-sm hover:opacity-90"
            style={{ background: '#8B1E3F' }}>
            <Plus size={16} /> Nova poruka
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-100 p-5 mb-8 text-sm text-zinc-600 leading-relaxed">
          <p>
            Aplikacija šalje obavijest <strong>na dan poruke</strong>, u vrijeme koje korisnik izabere (zadano 08:00).
            Korisnici mogu isključiti svaku rubriku posebno. Poruke unesite <strong>barem dan ranije</strong>. Aplikacija ih
            preuzme unaprijed, pa obavijest stiže i bez interneta.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3 text-xs text-zinc-500">
            {DAILY_RUBRICS.map(r => (
              <span key={r.key}><strong className="text-zinc-700">{WEEKDAYS[r.weekday]}:</strong> {r.name}</span>
            ))}
          </div>
        </div>

        <h2 className="text-lg font-black text-zinc-900 mb-3">Narednih 14 dana</h2>
        <div className="bg-white rounded-2xl border border-zinc-100 divide-y divide-zinc-100 mb-2">
          {days.map(day => {
            const posts = upcoming.filter(p => p.date === day)
            const expected = DAILY_RUBRICS.find(r => r.weekday === weekdayOf(day))!
            return (
              <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-4 py-3">
                <div className="sm:w-40 flex-shrink-0">
                  <p className="font-semibold text-zinc-800 text-sm">{WEEKDAYS[weekdayOf(day)]}{day === today ? ' · danas' : ''}</p>
                  <p className="text-zinc-400 text-xs">{fmtDay(day)}</p>
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  {posts.length === 0 ? (
                    <Link href={`/admin/dnevno/nova?date=${day}&rubric=${expected.key}`}
                      className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-brand border border-dashed border-zinc-200 hover:border-brand/40 rounded-lg px-3 py-1.5">
                      <Plus size={14} /> {expected.name}
                    </Link>
                  ) : posts.map(p => (
                    <Link key={p.id} href={`/admin/dnevno/${p.id}`} className="flex items-center gap-2 group">
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-brand bg-brand-dim rounded px-2 py-0.5 flex-shrink-0">
                        {rubricOf(p.rubric)?.short ?? p.rubric}
                      </span>
                      <span className="text-sm text-zinc-800 truncate group-hover:underline">{p.title}</span>
                      {!p.published && <span className="text-[11px] text-amber-600 bg-amber-50 rounded px-1.5 py-0.5 flex-shrink-0">draft</span>}
                      <Pencil size={13} className="text-zinc-300 group-hover:text-zinc-500 flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
        {later > 0 && <p className="text-xs text-zinc-400 mb-8">+ {later} poruka zakazano za kasnije</p>}

        <h2 className="text-lg font-black text-zinc-900 mt-8 mb-3">Ranije poslano</h2>
        {past.length === 0 ? (
          <p className="text-sm text-zinc-400">Još nema poslanih poruka.</p>
        ) : (
          <div className="bg-white rounded-2xl border border-zinc-100 divide-y divide-zinc-100">
            {past.map(p => (
              <Link key={p.id} href={`/admin/dnevno/${p.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-50">
                <span className="text-xs text-zinc-400 w-16 flex-shrink-0">{fmtDay(p.date)}</span>
                <span className="text-[11px] font-semibold uppercase tracking-wide text-brand bg-brand-dim rounded px-2 py-0.5 flex-shrink-0">
                  {rubricOf(p.rubric)?.short ?? p.rubric}
                </span>
                <span className="text-sm text-zinc-800 truncate">{p.title}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
