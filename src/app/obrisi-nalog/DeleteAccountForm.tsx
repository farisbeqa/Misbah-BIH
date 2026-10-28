'use client'

import { useState } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'

export default function DeleteAccountForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!confirmed) return setError('Potvrdite da želite trajno obrisati nalog.')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) setDone(true)
      else setError(data.error || 'Greška pri brisanju naloga')
    } catch {
      setError('Greška pri konekciji')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="flex items-start gap-3 p-5" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8 }}>
        <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-green-800">Vaš nalog i svi povezani podaci su trajno obrisani.</p>
      </div>
    )
  }

  const inputCls = 'w-full px-4 py-2.5 text-sm text-warm-900 outline-none focus:border-brand'
  const inputStyle = { background: '#FAF7F2', border: '1px solid #E8E1DB', borderRadius: 6 }

  return (
    <form onSubmit={submit} className="space-y-4 p-6" style={{ background: '#FCFBFA', border: '1px solid #E8E1DB', borderRadius: 12 }}>
      <div>
        <label className="block font-mono text-[11px] text-warm-500 uppercase tracking-widest mb-2">Korisničko ime</label>
        <input value={username} onChange={e => setUsername(e.target.value)} required autoComplete="username" className={inputCls} style={inputStyle} />
      </div>
      <div>
        <label className="block font-mono text-[11px] text-warm-500 uppercase tracking-widest mb-2">Lozinka</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" className={inputCls} style={inputStyle} />
      </div>
      <label className="flex items-start gap-2 text-sm text-warm-600">
        <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} className="mt-1" />
        Razumijem da se nalog, komentari i lajkovi trajno brišu.
      </label>
      {error ? (
        <div className="text-xs px-4 py-3 font-mono" style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 6, color: '#991B1B' }}>
          {error}
        </div>
      ) : null}
      <button type="submit" disabled={loading}
        className="w-full text-white font-semibold py-2.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
        style={{ background: '#B91C1C', borderRadius: 8 }}>
        {loading ? <Loader2 size={14} className="animate-spin" /> : null}
        Trajno obriši nalog
      </button>
    </form>
  )
}
