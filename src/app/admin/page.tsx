'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (res.ok) { router.push('/admin/dashboard'); router.refresh() }
      else setError(data.error || 'Greška pri prijavi')
    } catch { setError('Greška pri conexiji') }
    finally { setLoading(false) }
  }

  const inputStyle = { background: '#FAF7F2', border: '1px solid #E8E1DB', borderRadius: 6 }
  const inputCls = "w-full px-4 py-2.5 text-sm text-warm-900 outline-none transition-all focus:ring-2 focus:ring-brand/20 focus:border-brand"

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: '#141110' }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-brand flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-lg">
            م
          </div>
          <h1 className="text-white font-extrabold text-xl tracking-tight">
            Misbah <span className="text-gold">BIH</span>
          </h1>
          <p className="font-mono text-[11px] text-warm-700 mt-1.5 flex items-center justify-center gap-1.5 tracking-widest">
            <ShieldCheck size={10} /> ADMIN PORTAL
          </p>
        </div>

        <div style={{ background: '#FCFBFA', border: '1px solid #E8E1DB', borderRadius: 12, boxShadow: '0 24px 64px rgba(20,17,16,0.3)' }}
          className="p-7">
          <h2 className="font-extrabold text-warm-900 text-lg tracking-tight mb-6">Prijava</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-mono text-[11px] text-warm-500 uppercase tracking-widest mb-2">
                Korisničko ime
              </label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                placeholder="Unesite korisničko ime" required autoComplete="username"
                className={inputCls} style={inputStyle} />
            </div>
            <div>
              <label className="block font-mono text-[11px] text-warm-500 uppercase tracking-widest mb-2">
                Lozinka
              </label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Unesite lozinku" required autoComplete="current-password"
                  className={inputCls + ' pr-10'} style={inputStyle} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-400 hover:text-warm-600 transition-colors">
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            {error && (
              <div className="font-mono text-xs px-4 py-3"
                style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 6, color: '#991B1B' }}>
                {error}
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full text-white font-semibold py-2.5 text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              style={{ background: '#8B1E3F', borderRadius: 8 }}>
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading ? 'Prijava...' : 'Prijavite se'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
