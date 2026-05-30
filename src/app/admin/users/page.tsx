import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, Calendar, MessageSquare, Heart, Users } from 'lucide-react'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'

function fmt(d: Date) {
  return d.toLocaleDateString('bs-BA', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function AdminUsersPage() {
  const session = await requireAuth()
  if (!session) redirect('/admin')

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { likes: true, comments: true } },
    },
  })

  return (
    <div className="min-h-screen bg-zinc-50">
      <nav className="bg-zinc-950 text-white px-4 sm:px-6 py-4 sticky top-0 z-30 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center text-white font-black text-sm">م</div>
            <span className="font-black text-sm">Misbah BIH</span>
            <span className="text-zinc-500 text-xs font-medium px-2 py-0.5 bg-zinc-800 rounded-md">Admin</span>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/admin/dashboard"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-800 mb-6 text-sm transition-colors">
          <ArrowLeft size={15} /> Nazad na dashboard
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-brand-dim rounded-xl flex items-center justify-center">
            <Users size={20} className="text-brand" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-zinc-900">Korisnici</h1>
            <p className="text-zinc-500 text-sm">{users.length} registrovanih korisnika</p>
          </div>
        </div>

        {users.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-zinc-200">
            <Users size={36} className="text-zinc-200 mx-auto mb-3" />
            <p className="text-zinc-400 text-sm">Nema registrovanih korisnika.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-zinc-100 shadow-card overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-12 gap-3 px-4 py-2.5 bg-zinc-50 border-b border-zinc-100 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              <div className="col-span-1">#</div>
              <div className="col-span-4">Korisnik</div>
              <div className="col-span-3">Registrovan</div>
              <div className="col-span-2 text-center">Lajkovi</div>
              <div className="col-span-2 text-center">Komentari</div>
            </div>

            {users.map((user, i) => (
              <div key={user.id}
                className={`grid grid-cols-12 gap-3 items-center px-4 py-3 hover:bg-zinc-50 transition-colors ${i > 0 ? 'border-t border-zinc-100' : ''}`}>
                <div className="col-span-1 text-zinc-300 text-xs font-mono">{user.id}</div>
                <div className="col-span-4 flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {user.username[0].toUpperCase()}
                  </div>
                  <span className="font-medium text-zinc-900 text-sm truncate">{user.username}</span>
                </div>
                <div className="col-span-3 flex items-center gap-1.5 text-zinc-400 text-xs">
                  <Calendar size={10} />
                  {fmt(user.createdAt)}
                </div>
                <div className="col-span-2 flex items-center justify-center gap-1 text-zinc-500 text-sm">
                  <Heart size={12} className="text-rose-400" />
                  <span className="font-medium">{user._count.likes}</span>
                </div>
                <div className="col-span-2 flex items-center justify-center gap-1 text-zinc-500 text-sm">
                  <MessageSquare size={12} className="text-blue-400" />
                  <span className="font-medium">{user._count.comments}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
