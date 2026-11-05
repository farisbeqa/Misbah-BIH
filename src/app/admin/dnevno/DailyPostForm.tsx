'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Bell, Check, Loader2, Plus, Save, Trash2, Upload, X } from 'lucide-react'
import { DAILY_RUBRICS, rubricOf, weekdayOf, WEEKDAYS, type QuizQuestion } from '@/lib/daily'

export interface DailyPostValues {
  rubric: string
  date: string
  title: string
  teaser: string
  body: string
  source: string
  videoUrl: string
  link: string
  quiz: QuizQuestion[]
  published: boolean
}

// "za ponedjeljak", "za srijedu" …
const WEEKDAYS_ACC = ['', 'ponedjeljak', 'utorak', 'srijedu', 'četvrtak', 'petak', 'subotu', 'nedjelju']

const emptyQuestion = (): QuizQuestion => ({ q: '', options: ['', '', ''], answer: 0, explanation: '' })

const input = 'w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand text-sm'
const label = 'block text-sm font-semibold text-zinc-700 mb-1.5'
const optional = <span className="text-zinc-400 font-normal">(opciono)</span>

/** Create / edit form for a daily post (rubric-specific fields, quiz editor, notification preview) */
export default function DailyPostForm({ id, initial }: { id?: number; initial: DailyPostValues }) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [v, setV] = useState<DailyPostValues>(() => ({
    ...initial,
    quiz: initial.quiz.length ? initial.quiz : [emptyQuestion(), emptyQuestion(), emptyQuestion()],
  }))
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const set = (patch: Partial<DailyPostValues>) => setV(prev => ({ ...prev, ...patch }))
  const rubric = rubricOf(v.rubric)
  const isQuiz = v.rubric === 'kviz'
  const wrongDay = rubric && v.date && weekdayOf(v.date) !== rubric.weekday

  const setQuestion = (i: number, patch: Partial<QuizQuestion>) =>
    set({ quiz: v.quiz.map((q, k) => (k === i ? { ...q, ...patch } : q)) })

  const uploadVideo = async (file: File) => {
    setUploading(true)
    setError('')
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, contentType: file.type, folder: 'videos' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload nije uspio')
      const put = await fetch(data.uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } })
      if (!put.ok) throw new Error('Upload nije uspio')
      set({ videoUrl: data.publicUrl })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload nije uspio')
    } finally {
      setUploading(false)
    }
  }

  const save = async () => {
    setSaving(true)
    setError('')
    try {
      const res = await fetch(id ? `/api/dnevno/${id}` : '/api/dnevno', {
        method: id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...v, quiz: isQuiz ? v.quiz : undefined }),
      })
      if (res.ok) {
        router.push('/admin/dnevno')
        router.refresh()
      } else setError((await res.json()).error || 'Greška')
    } catch {
      setError('Greška pri konekciji')
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    if (!id || !confirm('Obrisati ovu poruku?')) return
    const res = await fetch(`/api/dnevno/${id}`, { method: 'DELETE' })
    if (res.ok) {
      router.push('/admin/dnevno')
      router.refresh()
    } else setError('Brisanje nije uspjelo')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-zinc-950 text-white px-4 sm:px-6 py-4 sticky top-0 z-30 border-b border-zinc-800">
        <div className="max-w-3xl mx-auto flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center text-white font-black text-sm">م</div>
          <span className="font-black text-sm">Misbah EDU</span>
          <span className="text-zinc-500 text-xs px-2 py-0.5 bg-zinc-800 rounded-md">Admin</span>
        </div>
      </nav>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/admin/dnevno" className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-800 mb-6 text-sm">
          <ArrowLeft size={15} /> Dnevne poruke
        </Link>
        <h1 className="text-2xl font-black text-zinc-900 mb-6">{id ? 'Uredi poruku' : 'Nova dnevna poruka'}</h1>

        <div className="bg-white rounded-2xl p-6 border border-zinc-100 shadow-sm space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={label}>Rubrika *</label>
              <select value={v.rubric} onChange={e => set({ rubric: e.target.value })} className={input}>
                {DAILY_RUBRICS.map(r => (
                  <option key={r.key} value={r.key}>{r.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={label}>Datum slanja *</label>
              <input type="date" value={v.date} onChange={e => set({ date: e.target.value })} className={input} />
              {v.date && (
                <p className={`text-xs mt-1 ${wrongDay ? 'text-amber-600' : 'text-zinc-400'}`}>
                  {WEEKDAYS[weekdayOf(v.date)]}
                  {wrongDay && rubric ? ` · ova rubrika je inače za ${WEEKDAYS_ACC[rubric.weekday]}` : ''}
                </p>
              )}
            </div>
          </div>
          {rubric && <p className="text-xs text-zinc-500 -mt-2">{rubric.hint}</p>}

          <div>
            <label className={label}>Naslov *</label>
            <input type="text" value={v.title} maxLength={120} onChange={e => set({ title: e.target.value })}
              placeholder={isQuiz ? 'npr. Koliko znaš o Ramazanu?' : 'npr. Osmijeh je sadaka'} className={input} />
          </div>

          <div>
            <label className={label}>Tekst obavijesti {optional}</label>
            <input type="text" value={v.teaser} maxLength={180} onChange={e => set({ teaser: e.target.value })}
              placeholder="Jedna rečenica koja se vidi u obavijesti. Ako ostane prazno, koristi se naslov."
              className={input} />
            <p className="text-xs text-zinc-400 mt-1 text-right">{v.teaser.length}/180</p>
          </div>

          <div>
            <label className={label}>{isQuiz ? 'Uvod u kviz' : 'Sadržaj'} {isQuiz ? optional : null}</label>
            <textarea value={v.body} onChange={e => set({ body: e.target.value })} rows={isQuiz ? 3 : 10}
              placeholder={v.rubric === 'hadis' ? 'Tekst hadisa (arapski u posebnom redu), zatim kratak komentar i pouka.' : 'Kratko i jasno — da se pročita za minutu.'}
              className={`${input} resize-y`} />
          </div>

          {!isQuiz && (
            <div>
              <label className={label}>Izvor {optional}</label>
              <input type="text" value={v.source} onChange={e => set({ source: e.target.value })}
                placeholder="npr. Buhari i Muslim · El-Bekare, 286 · autor teksta" className={input} />
            </div>
          )}

          {v.rubric === 'preporuka' && (
            <div>
              <label className={label}>Link preporučenog sadržaja</label>
              <input type="url" value={v.link} onChange={e => set({ link: e.target.value })}
                placeholder="https://www.misbah-edu.com/videos/262" className={input} />
              <p className="text-xs text-zinc-400 mt-1">Otvorite predavanje ili tekst na misbah-edu.com i kopirajte link iz preglednika. Aplikacija ga otvara direktno.</p>
            </div>
          )}

          <div>
            <label className={label}>Kratki video {optional}</label>
            <input ref={fileRef} type="file" accept="video/*" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) uploadVideo(f); e.target.value = '' }} />
            <div className="flex gap-2">
              <input type="url" value={v.videoUrl} onChange={e => set({ videoUrl: e.target.value })}
                placeholder="YouTube / Instagram link ili uploadujte snimak" className={`${input} flex-1`} />
              <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                className="flex items-center gap-1.5 px-4 py-2.5 border border-zinc-200 rounded-xl text-sm text-zinc-600 hover:bg-zinc-50 whitespace-nowrap disabled:opacity-50">
                {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />} Upload
              </button>
              {v.videoUrl && (
                <button type="button" onClick={() => set({ videoUrl: '' })} className="px-3 text-zinc-400 hover:text-red-500" aria-label="Ukloni video">
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {isQuiz && (
            <div className="space-y-4">
              <p className={label}>Pitanja *</p>
              {v.quiz.map((q, i) => (
                <div key={i} className="border border-zinc-200 rounded-xl p-4 space-y-3 bg-zinc-50/50">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-400 w-6">{i + 1}.</span>
                    <input type="text" value={q.q} onChange={e => setQuestion(i, { q: e.target.value })} placeholder="Pitanje" className={`${input} flex-1 bg-white`} />
                    {v.quiz.length > 1 && (
                      <button type="button" onClick={() => set({ quiz: v.quiz.filter((_, k) => k !== i) })} className="p-2 text-zinc-400 hover:text-red-500" aria-label="Ukloni pitanje">
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                  {q.options.map((o, k) => (
                    <div key={k} className="flex items-center gap-2 pl-8">
                      <button type="button" onClick={() => setQuestion(i, { answer: k })} aria-label="Tačan odgovor"
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${q.answer === k ? 'bg-green-600 border-green-600 text-white' : 'border-zinc-300 bg-white'}`}>
                        {q.answer === k && <Check size={13} />}
                      </button>
                      <input type="text" value={o} placeholder={`Odgovor ${k + 1}`}
                        onChange={e => setQuestion(i, { options: q.options.map((x, j) => (j === k ? e.target.value : x)) })}
                        className={`${input} flex-1 bg-white py-2`} />
                      {q.options.length > 2 && (
                        <button type="button" aria-label="Ukloni odgovor" className="p-1.5 text-zinc-300 hover:text-red-500"
                          onClick={() => setQuestion(i, { options: q.options.filter((_, j) => j !== k), answer: q.answer === k ? 0 : q.answer > k ? q.answer - 1 : q.answer })}>
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                  <div className="pl-8 flex items-center justify-between">
                    {q.options.length < 5 ? (
                      <button type="button" onClick={() => setQuestion(i, { options: [...q.options, ''] })} className="text-xs text-brand font-semibold">
                        + Dodaj odgovor
                      </button>
                    ) : <span />}
                    <span className="text-xs text-zinc-400">Zeleni krug = tačan odgovor</span>
                  </div>
                  <div className="pl-8">
                    <textarea value={q.explanation ?? ''} rows={2} onChange={e => setQuestion(i, { explanation: e.target.value })}
                      placeholder="Kratko pojašnjenje tačnog odgovora (opciono)" className={`${input} bg-white resize-y`} />
                  </div>
                </div>
              ))}
              {v.quiz.length < 10 && (
                <button type="button" onClick={() => set({ quiz: [...v.quiz, emptyQuestion()] })}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
                  <Plus size={15} /> Dodaj pitanje
                </button>
              )}
            </div>
          )}

          {/* Notification preview */}
          <div>
            <p className={label}>Kako izgleda obavijest</p>
            <div className="flex gap-3 items-start bg-zinc-100 rounded-2xl p-3 max-w-md">
              <div className="w-9 h-9 rounded-lg bg-brand flex items-center justify-center flex-shrink-0">
                <Bell size={16} className="text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-zinc-900">{rubric?.short ?? 'Misbah EDU'}</p>
                <p className="text-sm text-zinc-600 line-clamp-2">{v.teaser || v.title || 'Tekst obavijesti'}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between py-1">
            <div>
              <p className="font-semibold text-zinc-700 text-sm">Objaviti</p>
              <p className="text-zinc-400 text-xs mt-0.5">{v.published ? 'Šalje se na dan poruke' : 'Skriveno (draft) — ne šalje se'}</p>
            </div>
            <button type="button" onClick={() => set({ published: !v.published })}
              className={`relative w-11 h-6 rounded-full transition-colors ${v.published ? 'bg-brand' : 'bg-zinc-200'}`}>
              <span className={`absolute left-0 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${v.published ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            {id ? (
              <button type="button" onClick={remove} className="px-4 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 font-semibold flex items-center gap-1.5">
                <Trash2 size={15} /> Obriši
              </button>
            ) : null}
            <Link href="/admin/dnevno" className="flex-1 text-center bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold py-2.5 rounded-xl text-sm">
              Odustani
            </Link>
            <button type="button" onClick={save} disabled={saving || uploading || !v.title.trim() || !v.date}
              className="flex-1 flex items-center justify-center gap-2 text-white font-semibold py-2.5 rounded-xl text-sm disabled:opacity-40"
              style={{ background: '#8B1E3F' }}>
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              {saving ? 'Snimanje...' : 'Sačuvaj'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
