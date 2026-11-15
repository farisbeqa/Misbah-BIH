'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { CheckCircle2, Loader2 } from 'lucide-react'

// Known error texts of /api/auth/delete-account, shown in the visitor's
// language; any other server text is shown as it comes
const SERVER_ERRORS = new Map([
  ['Korisničko ime i lozinka su obavezni', 'missingCredentials'],
  ['Pogrešno korisničko ime ili lozinka', 'wrongCredentials'],
  ['Greška servera', 'server'],
])

export default function DeleteAccountForm() {
  const t = useTranslations('account.deleteAccount.form')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!confirmed) return setError(t('errors.notConfirmed'))
    setLoading(true)
    try {
      const res = await fetch('/api/auth/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) setDone(true)
      else {
        const known = SERVER_ERRORS.get(data.error)
        setError(known ? t(`errors.${known}`) : data.error || t('errors.deleteFailed'))
      }
    } catch {
      setError(t('errors.connection'))
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="flex items-start gap-3 p-5" style={{ background: 'var(--bg-f0fdf4)', border: '1px solid var(--line-bbf7d0)', borderRadius: 8 }}>
        <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-green-800">{t('done')}</p>
      </div>
    )
  }

  const inputCls = 'w-full px-4 py-2.5 text-sm text-[var(--fg-241f1d)] outline-none focus:border-[var(--line-8b1e3f)]'
  const inputStyle = { background: 'var(--bg-faf7f2)', border: '1px solid var(--line-e8e1db)', borderRadius: 6 }

  return (
    <form onSubmit={submit} className="space-y-4 p-6" style={{ background: 'var(--bg-fcfbfa)', border: '1px solid var(--line-e8e1db)', borderRadius: 12 }}>
      <div>
        <label className="block font-mono text-[11px] text-[var(--fg-978a81)] uppercase tracking-widest mb-2">{t('username')}</label>
        <input value={username} onChange={e => setUsername(e.target.value)} required autoComplete="username" className={inputCls} style={inputStyle} />
      </div>
      <div>
        <label className="block font-mono text-[11px] text-[var(--fg-978a81)] uppercase tracking-widest mb-2">{t('password')}</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" className={inputCls} style={inputStyle} />
      </div>
      <label className="flex items-start gap-2 text-sm text-[var(--fg-746860)]">
        <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} className="mt-1" />
        {t('confirm')}
      </label>
      {error ? (
        <div className="text-xs px-4 py-3 font-mono" style={{ background: 'var(--bg-fef2f2)', border: '1px solid var(--line-fecaca)', borderRadius: 6, color: 'var(--fg-991b1b)' }}>
          {error}
        </div>
      ) : null}
      <button type="submit" disabled={loading}
        className="w-full text-white font-semibold py-2.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
        style={{ background: 'var(--bg-b91c1c)', borderRadius: 8 }}>
        {loading ? <Loader2 size={14} className="animate-spin" /> : null}
        {t('submit')}
      </button>
    </form>
  )
}
