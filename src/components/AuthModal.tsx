'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { X, Eye, EyeOff, Loader2, UserPlus, LogIn } from 'lucide-react'
import { useLocalizedHref } from '@/i18n/navigation'

interface AuthUser { id: number; username: string }
interface Props {
  open: boolean; mode: 'login' | 'register'
  onClose: () => void; onSuccess: (u: AuthUser) => void; onSwitchMode: (m: 'login' | 'register') => void
}

type AuthT = ReturnType<typeof useTranslations<'auth'>>

/**
 * Text for an error returned by the auth, comments or likes API: translated by
 * its `code` (auth.errors.<code>) when there is a text for it, otherwise the
 * server's own (Bosnian) `error`, otherwise a generic "error".
 */
export function apiErrorText(t: AuthT, data: { error?: string; code?: string } | null | undefined): string {
  if (data?.code && t.has(`errors.${data.code}`)) return t(`errors.${data.code}`)
  return data?.error || t('errors.generic')
}

export default function AuthModal({ open, mode, onClose, onSuccess, onSwitchMode }: Props) {
  const t = useTranslations('auth')
  const localizeHref = useLocalizedHref()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) { setUsername(''); setPassword(''); setConfirm(''); setError(''); setTimeout(() => inputRef.current?.focus(), 80) }
  }, [open, mode])

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [open, onClose])

  if (!open) return null
  const isReg = mode === 'register'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('')
    if (isReg && password !== confirm) { setError(t('errors.passwordMismatch')); return }
    setLoading(true)
    try {
      const res = await fetch(isReg ? '/api/auth/register' : '/api/auth/user-login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (res.ok) {
        const me = await fetch('/api/auth/me').then(r => r.json())
        onSuccess(me.user)
      } else { setError(apiErrorText(t, data)) }
    } catch { setError(t('errors.connection')) }
    finally { setLoading(false) }
  }

  const inputCls = "w-full px-4 py-2.5 text-sm text-warm-900 outline-none transition-all focus:ring-2 focus:ring-brand/20 focus:border-brand"
  const inputStyle = { background: '#FAF7F2', border: '1px solid #E8E1DB', borderRadius: 6 }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0" style={{ background: 'rgba(20,17,16,0.65)', backdropFilter: 'blur(6px)' }} onClick={onClose} />

      <div className="relative w-full max-w-sm animate-fade-up" style={{ background: '#FCFBFA', borderRadius: 12, boxShadow: '0 24px 64px rgba(20,17,16,0.28)', border: '1px solid #E8E1DB' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4" style={{ borderBottom: '1px solid #E8E1DB' }}>
          <div className="flex items-center gap-2.5">
            {isReg ? <UserPlus size={16} className="text-brand" /> : <LogIn size={16} className="text-brand flip-rtl" />}
            <h2 className="font-extrabold text-warm-900 text-base tracking-tight">
              {isReg ? t('modal.registerTitle') : t('modal.loginTitle')}
            </h2>
          </div>
          <button onClick={onClose} className="text-warm-400 hover:text-warm-700 transition-colors p-1 rounded-lg hover:bg-warm-100">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block font-mono text-[11px] text-warm-500 uppercase tracking-widest mb-2">
              {t('modal.username')}
            </label>
            <input ref={inputRef} type="text" value={username} onChange={e => setUsername(e.target.value)}
              placeholder={isReg ? t('modal.usernamePlaceholderRegister') : t('modal.usernamePlaceholderLogin')}
              required autoComplete="username" className={inputCls} style={inputStyle} />
            {isReg && <p className="font-mono text-[10px] text-warm-400 mt-1.5">{t('modal.usernameHint')}</p>}
          </div>

          <div>
            <label className="block font-mono text-[11px] text-warm-500 uppercase tracking-widest mb-2">{t('modal.password')}</label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder={isReg ? t('modal.passwordPlaceholderRegister') : t('modal.passwordPlaceholderLogin')}
                required autoComplete={isReg ? 'new-password' : 'current-password'}
                className={inputCls + ' pe-10'} style={inputStyle} />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-warm-400 hover:text-warm-600 transition-colors">
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {isReg && (
            <div>
              <label className="block font-mono text-[11px] text-warm-500 uppercase tracking-widest mb-2">{t('modal.confirmPassword')}</label>
              <input type={showPass ? 'text' : 'password'} value={confirm} onChange={e => setConfirm(e.target.value)}
                placeholder={t('modal.confirmPasswordPlaceholder')} required autoComplete="new-password"
                className={inputCls} style={inputStyle} />
            </div>
          )}

          {error && (
            <div className="text-xs px-4 py-3 font-mono" style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 6, color: '#991B1B' }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full text-white font-semibold py-2.5 text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ background: loading ? '#A94A61' : '#8B1E3F', borderRadius: 8 }}>
            {loading && <Loader2 size={14} className="animate-spin" />}
            {loading ? t('modal.pleaseWait') : isReg ? t('modal.createAccount') : t('modal.logIn')}
          </button>
          {isReg && (
            <p className="text-[11px] text-warm-400 text-center leading-relaxed">
              {t.rich('modal.terms', {
                terms: chunks => <a href={localizeHref('/pravila-koristenja')} target="_blank" className="text-brand hover:underline">{chunks}</a>,
                privacy: chunks => <a href={localizeHref('/privatnost')} target="_blank" className="text-brand hover:underline">{chunks}</a>,
              })}
            </p>
          )}
        </form>

        <div className="px-6 pb-5 text-center text-sm text-warm-500">
          {isReg
            ? t.rich('modal.haveAccount', {
                login: chunks => <button onClick={() => onSwitchMode('login')} className="text-brand font-semibold hover:text-brand-light transition-colors">{chunks}</button>,
              })
            : t.rich('modal.noAccount', {
                register: chunks => <button onClick={() => onSwitchMode('register')} className="text-brand font-semibold hover:text-brand-light transition-colors">{chunks}</button>,
              })}
        </div>
      </div>
    </div>
  )
}
