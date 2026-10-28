import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, Flag, MessageSquare } from 'lucide-react'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import ModerationDeleteButton from '../dashboard/ModerationDeleteButton'

export const dynamic = 'force-dynamic'

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec']
function fmt(d: Date) {
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${d.getDate()}. ${MONTHS[d.getMonth()]} ${d.getFullYear()}. ${hh}:${mm}`
}

// Moderation of user comments (web + mobile app): reported comments first,
// then the latest comments. Reports come from the "Prijavi" buttons.
export default async function AdminKomentariPage() {
  const session = await requireAuth()
  if (!session) redirect('/admin')

  const reports = await prisma.commentReport.findMany({ orderBy: { createdAt: 'desc' }, take: 200 })
  const reported = await prisma.comment.findMany({
    where: { id: { in: reports.map(r => r.commentId) } },
    include: { user: { select: { id: true, username: true } } },
  })
  const reportedById = new Map(reported.map(c => [c.id, c]))
  const openReports = reports.filter(r => reportedById.has(r.commentId))

  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: 'desc' },
    take: 300,
    include: {
      user: { select: { id: true, username: true } },
      video: { select: { id: true, title: true } },
      blogPost: { select: { id: true, title: true } },
    },
  })

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

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-brand-dim rounded-xl flex items-center justify-center flex-shrink-0">
            <MessageSquare size={20} className="text-brand" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-zinc-900">Komentari</h1>
            <p className="text-zinc-500 text-sm">Najnovijih {comments.length} komentara s weba i aplikacije</p>
          </div>
        </div>
        <p className="text-zinc-500 text-sm mb-8">
          Komentari koje korisnici prijave pojavljuju se na vrhu ove stranice. Prijavljeni komentar pregledajte i po potrebi obrišite
          najkasnije u roku od 24 sata, a korisnika koji ne poštuje pravila obrišite zajedno sa svim njegovim komentarima.
        </p>

        {openReports.length > 0 ? (
          <div className="mb-10">
            <h2 className="flex items-center gap-2 font-bold text-red-700 mb-3">
              <Flag size={16} /> Prijavljeni komentari ({openReports.length})
            </h2>
            <div className="bg-white rounded-2xl border border-red-200 shadow-card divide-y divide-red-100">
              {openReports.map(r => {
                const c = reportedById.get(r.commentId)!
                return (
                  <div key={r.id} className="p-4 flex flex-col sm:flex-row sm:items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-400 mb-1">
                        <span className="font-semibold text-zinc-800 text-sm">{c.user?.username ?? 'obrisan korisnik'}</span>
                        <span>komentar #{c.id}</span>
                        <span>prijavljeno {fmt(r.createdAt)}{r.reporter ? ` · prijavio: ${r.reporter}` : ''}</span>
                      </div>
                      <p className="text-sm text-zinc-700 whitespace-pre-line break-words">{c.content}</p>
                      {r.reason ? <p className="text-xs text-red-600 mt-1">Razlog: {r.reason}</p> : null}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <ModerationDeleteButton endpoint={`/api/admin/comments/${c.id}`} confirmText="Obrisati prijavljeni komentar?" />
                      {c.user ? (
                        <ModerationDeleteButton
                          kind="user"
                          endpoint={`/api/admin/users/${c.user.id}`}
                          confirmText={`Obrisati korisnika "${c.user.username}" i sve njegove komentare i lajkove?`}
                        />
                      ) : null}
                      <ModerationDeleteButton kind="dismiss" endpoint={`/api/admin/reports/${r.id}`} confirmText="Odbaciti prijavu (komentar ostaje)?" />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : null}

        {comments.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-zinc-200 text-zinc-400 text-sm">Nema komentara.</div>
        ) : (
          <div className="bg-white rounded-2xl border border-zinc-100 shadow-card divide-y divide-zinc-100">
            {comments.map(c => {
              const target = c.video
                ? { href: `/videos/${c.video.id}`, title: c.video.title }
                : c.blogPost
                  ? { href: `/blog/${c.blogPost.id}`, title: c.blogPost.title }
                  : null
              return (
                <div key={c.id} className="p-4 flex flex-col sm:flex-row sm:items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-400 mb-1">
                      <span className="font-semibold text-zinc-800 text-sm">{c.user?.username ?? 'obrisan korisnik'}</span>
                      <span>#{c.id}</span>
                      <span>{fmt(c.createdAt)}</span>
                      {target ? (
                        <Link href={target.href} target="_blank" className="text-brand hover:underline truncate max-w-[280px]">
                          {target.title}
                        </Link>
                      ) : null}
                    </div>
                    <p className="text-sm text-zinc-700 whitespace-pre-line break-words">{c.content}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <ModerationDeleteButton endpoint={`/api/admin/comments/${c.id}`} confirmText="Obrisati ovaj komentar?" />
                    {c.user ? (
                      <ModerationDeleteButton
                        kind="user"
                        endpoint={`/api/admin/users/${c.user.id}`}
                        confirmText={`Obrisati korisnika "${c.user.username}" i sve njegove komentare i lajkove?`}
                      />
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
