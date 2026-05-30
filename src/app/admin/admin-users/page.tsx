import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, ShieldCheck, ShieldOff } from 'lucide-react'
import { requireSuperAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'
import AdminUsersClient from './AdminUsersClient'

function fmt(d: Date) {
  return d.toLocaleDateString('bs-BA', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function AdminUsersPage() {
  const session = await requireSuperAdmin()
  if (!session) redirect('/admin/dashboard')

  const admins = await prisma.adminUser.findMany({
    select: { id: true, username: true, isSuperAdmin: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  })

  return (
    <div className="min-h-screen bg-zinc-50">
      <nav className="bg-zinc-950 text-white px-4 sm:px-6 py-4 sticky top-0 z-30 border-b border-zinc-800">
        <div className="max-w-4xl mx-auto flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center text-white font-black text-sm">م</div>
          <span className="font-black text-sm">Misbah BIH</span>
          <span className="text-zinc-500 text-xs font-medium px-2 py-0.5 bg-zinc-800 rounded-md">Admin</span>
          <span className="text-amber-400 text-xs font-medium px-2 py-0.5 bg-amber-400/10 rounded-md flex items-center gap-1">
            <ShieldCheck size={10} /> Super Admin
          </span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/admin/dashboard"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-800 mb-6 text-sm transition-colors">
          <ArrowLeft size={15} /> Nazad na dashboard
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-zinc-900">Upravljanje adminima</h1>
            <p className="text-zinc-500 text-sm mt-1">
              Samo <span className="font-semibold text-amber-600">Hamdo</span> može dodavati i brisati admin korisnike
            </p>
          </div>
        </div>

        <AdminUsersClient initialAdmins={admins.map(a => ({ ...a, createdAt: a.createdAt.toISOString() }))} />

        {/* Legend */}
        <div className="mt-6 flex items-center gap-6 text-xs text-zinc-400 font-mono">
          <span className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-amber-500" /> Super Admin — puni pristup</span>
          <span className="flex items-center gap-1.5"><ShieldOff size={12} className="text-zinc-400" /> Admin — upravljanje sadržajem</span>
        </div>
      </div>
    </div>
  )
}
