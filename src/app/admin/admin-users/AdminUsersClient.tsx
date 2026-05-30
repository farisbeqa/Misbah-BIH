'use client'

import { useState } from 'react'
import { ShieldCheck, ShieldOff, Trash2, Plus, Loader2, Eye, EyeOff, Calendar } from 'lucide-react'

interface Admin {
  id: number
  username: string
  isSuperAdmin: boolean
  createdAt: string
}

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec']
function fmtDate(s: string) {
  const d = new Date(s)
  return `${d.getDate()}. ${MONTHS[d.getMonth()]} ${d.getFullYear()}.`
}

export default function AdminUsersClient({ initialAdmins }: { initialAdmins: Admin[] }) {
  const [admins, setAdmins] = useState<Admin[]>(initialAdmins)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [adding, setAdding] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setAdding(true); setError(''); setSuccess('')
    try {
      const res = await fetch('/api/admin/admin-users', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      })
      const data = await res.json()
      if (res.ok) {
        setAdmins(prev => [...prev, data])
        setUsername(''); setPassword('')
        setSuccess(`Admin "${data.username}" je uspješno dodan.`)
      } else {
        setError(data.error || 'Greška')
      }
    } catch { setError('Greška pri conexiji') }
    finally { setAdding(false) }
  }

  const handleDelete = async (admin: Admin) => {
    if (!confirm(`Da li ste sigurni da želite obrisati admina "${admin.username}"?`)) return
    setDeletingId(admin.id); setError(''); setSuccess('')
    try {
      const res = await fetch(`/api/admin/admin-users/${admin.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (res.ok) {
        setAdmins(prev => prev.filter(a => a.id !== admin.id))
        setSuccess(`Admin "${admin.username}" je obrisan.`)
      } else {
        setError(data.error || 'Greška pri brisanju')
      }
    } catch { setError('Greška pri conexiji') }
    finally { setDeletingId(null) }
  }

  return (
    <div className="space-y-6">
      {/* Add new admin */}
      <div className="bg-white rounded-2xl border border-zinc-100 shadow-card p-6">
        <h2 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
          <Plus size={16} className="text-brand" /> Dodaj novog admina
        </h2>
        <form onSubmit={handleAdd} className="grid sm:grid-cols-3 gap-3 items-end">
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
              Korisničko ime
            </label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)}
              placeholder="npr. Ahmed"
              required minLength={3} maxLength={32}
              className="w-full px-3 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
              Lozinka
            </label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Min. 6 karaktera"
                required minLength={6}
                className="w-full px-3 py-2.5 pr-9 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand" />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={adding || !username.trim() || !password}
            className="flex items-center justify-center gap-2 bg-brand hover:bg-brand-light text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-colors disabled:opacity-40">
            {adding ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
            {adding ? 'Dodavanje...' : 'Dodaj admina'}
          </button>
        </form>

        {error && (
          <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">{error}</p>
        )}
        {success && (
          <p className="mt-3 text-sm text-green-700 bg-green-50 border border-green-100 px-3 py-2 rounded-lg">{success}</p>
        )}
      </div>

      {/* List of admins */}
      <div className="bg-white rounded-2xl border border-zinc-100 shadow-card overflow-hidden">
        <div className="px-4 py-3 bg-zinc-50 border-b border-zinc-100">
          <h2 className="font-bold text-zinc-900 text-sm">Admin korisnici ({admins.length})</h2>
        </div>

        {admins.map((admin, i) => (
          <div key={admin.id}
            className={`flex items-center gap-3 px-4 py-3.5 ${i > 0 ? 'border-t border-zinc-100' : ''}`}>
            {/* Avatar */}
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${admin.isSuperAdmin ? 'bg-amber-100 text-amber-700' : 'bg-zinc-100 text-zinc-600'}`}>
              {admin.username[0].toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-zinc-900 text-sm">{admin.username}</span>
                {admin.isSuperAdmin ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-md">
                    <ShieldCheck size={9} /> Super Admin
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 bg-zinc-100 text-zinc-500 rounded-md">
                    <ShieldOff size={9} /> Admin
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-zinc-400 text-xs mt-0.5">
                <Calendar size={9} /> {fmtDate(admin.createdAt)}
              </div>
            </div>

            {/* Delete — only non-super-admins can be deleted */}
            {!admin.isSuperAdmin && (
              <button onClick={() => handleDelete(admin)} disabled={deletingId === admin.id}
                className="p-1.5 text-zinc-300 hover:text-red-500 transition-colors flex-shrink-0">
                {deletingId === admin.id
                  ? <Loader2 size={15} className="animate-spin" />
                  : <Trash2 size={15} />}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
