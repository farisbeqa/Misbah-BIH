'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, RefreshCw, ExternalLink } from 'lucide-react'

export type EditorLang = {
  locale: 'en' | 'ar' | 'de' | 'tr'
  fields: Record<string, string>
  exists: boolean
  manual: boolean
  upToDate: boolean
  status: string
  model: string | null
  error: string | null
  updatedAt: string | null
}

const LABEL: Record<EditorLang['locale'], string> = { en: 'Engleski', ar: 'Arapski', de: 'Njemački', tr: 'Turski' }

// The translator starts the error text with "[attempt N abcd1234]" or
// "[no retry abcd1234]"; after 3 paid attempts (MAX_PAID_ATTEMPTS in
// lambda/translator/index.ts) or a refusal it stops retrying on its own.
function describeError(error: string | null): string {
  const text = error ?? ''
  const m = text.match(/^\[(?:attempt (\d+)|no retry) [0-9a-f]{8}\]\s*/)
  const detail = m ? text.slice(m[0].length) : text
  const stopped = m && (m[1] === undefined || Number(m[1]) >= 3)
  return `Greška pri zadnjem prevođenju: ${detail}${stopped ? ' Automatski pokušaji su zaustavljeni (da ne bi bilo nepotrebnih troškova): kliknite "Prevedi ponovo" ili upišite prijevod ručno.' : ''}`
}

function describe(l: EditorLang): { text: string; cls: string } {
  if (!l.exists) return { text: 'Još nije prevedeno (prijevod stiže automatski).', cls: 'text-zinc-500' }
  if (l.status === 'error') return { text: describeError(l.error), cls: 'text-red-600' }
  if (l.manual && !l.upToDate) return { text: 'Ručno ispravljen prijevod, ali je bosanski tekst u međuvremenu promijenjen. Provjerite ga ili kliknite "Prevedi ponovo".', cls: 'text-orange-600' }
  if (!l.upToDate) return { text: 'Bosanski tekst je promijenjen; novi prijevod je u toku.', cls: 'text-amber-600' }
  if (l.manual) return { text: 'Ručno ispravljeno: automatsko prevođenje ga neće mijenjati.', cls: 'text-sky-700' }
  return { text: 'Prevedeno automatski.', cls: 'text-emerald-700' }
}

export default function TranslationEditor({ entity, id, fieldNames, fieldLabels, langs, publicPath }: {
  entity: string
  id: number
  fieldNames: string[]
  fieldLabels: Record<string, string>
  langs: EditorLang[]
  publicPath: string
}) {
  const router = useRouter()
  const [active, setActive] = useState<EditorLang['locale']>('en')
  const [drafts, setDrafts] = useState<Record<string, Record<string, string>>>(
    Object.fromEntries(langs.map(l => [l.locale, { ...l.fields }])),
  )
  const [busy, setBusy] = useState<'save' | 'retranslate' | null>(null)
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null)

  const lang = langs.find(l => l.locale === active)!
  const info = describe(lang)
  const rtl = active === 'ar'

  const save = async () => {
    setBusy('save'); setMessage(null)
    const res = await fetch(`/api/admin/translations/${entity}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locale: active, fields: drafts[active] }),
    }).catch(() => null)
    setBusy(null)
    if (res?.ok) { setMessage({ text: 'Sačuvano.', ok: true }); router.refresh() }
    else setMessage({ text: (await res?.json().catch(() => null))?.error ?? 'Greška pri čuvanju.', ok: false })
  }

  const retranslate = async () => {
    if (lang.manual && !confirm('Ručno ispravljeni prijevod će biti zamijenjen novim automatskim prijevodom. Nastaviti?')) return
    setBusy('retranslate'); setMessage(null)
    const res = await fetch(`/api/admin/translations/${entity}/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locale: active }),
    }).catch(() => null)
    setBusy(null)
    setMessage(res?.ok
      ? { text: 'Prijevod je zatražen. Osvježite stranicu za oko minutu.', ok: true }
      : { text: 'Prevodilac trenutno nije dostupan.', ok: false })
  }

  return (
    <section className="bg-white rounded-2xl border border-zinc-100 shadow-card">
      <div className="flex flex-wrap gap-1 border-b border-zinc-100 px-3 pt-3">
        {langs.map(l => (
          <button key={l.locale} onClick={() => { setActive(l.locale); setMessage(null) }}
            className={`px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 -mb-px ${active === l.locale ? 'border-brand text-brand' : 'border-transparent text-zinc-500 hover:text-zinc-800'}`}>
            {LABEL[l.locale]}
            {!l.exists && <span className="ms-1.5 text-zinc-300">–</span>}
            {l.exists && l.status === 'error' && <span className="ms-1.5 text-red-500">✗</span>}
            {l.exists && l.manual && !l.upToDate && <span className="ms-1.5 text-orange-500">!</span>}
          </button>
        ))}
      </div>

      <div className="p-5 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className={`text-sm ${info.cls}`}>{info.text}</p>
          <a href={`/${active}${publicPath === '/' ? '' : publicPath}`} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800">
            <ExternalLink size={12} /> Pogledaj na stranici ({active.toUpperCase()})
          </a>
        </div>

        {fieldNames.map(f => (
          <label key={f} className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">{fieldLabels[f] ?? f}</span>
            <textarea
              dir={rtl ? 'rtl' : 'ltr'}
              lang={active}
              value={drafts[active]?.[f] ?? ''}
              onChange={e => setDrafts(d => ({ ...d, [active]: { ...d[active], [f]: e.target.value } }))}
              rows={f === 'title' || f === 'source' ? 2 : 12}
              placeholder={lang.exists ? '' : 'Još nema prijevoda'}
              className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-800 focus:outline-none focus:border-brand"
            />
          </label>
        ))}

        <div className="flex flex-wrap items-center gap-3">
          <button onClick={save} disabled={busy !== null}
            className="inline-flex items-center gap-2 text-white font-semibold px-4 py-2.5 rounded-xl text-sm hover:opacity-90 disabled:opacity-60"
            style={{ background: '#8B1E3F' }}>
            <Save size={15} /> {busy === 'save' ? 'Čuvam…' : 'Sačuvaj ispravku'}
          </button>
          <button onClick={retranslate} disabled={busy !== null}
            className="inline-flex items-center gap-2 font-semibold px-4 py-2.5 rounded-xl text-sm border border-zinc-200 text-zinc-700 hover:border-zinc-400 disabled:opacity-60">
            <RefreshCw size={15} className={busy === 'retranslate' ? 'animate-spin' : ''} /> Prevedi ponovo
          </button>
          {message && <p className={`text-sm ${message.ok ? 'text-emerald-600' : 'text-red-600'}`}>{message.text}</p>}
        </div>
        {lang.updatedAt && (
          <p className="text-xs text-zinc-400">
            Zadnja izmjena: {new Date(lang.updatedAt).toLocaleString('bs-BA')}{lang.model ? ` · ${lang.model.startsWith('ručno') ? lang.model : 'Claude (automatski)'}` : ''}
          </p>
        )}
      </div>
    </section>
  )
}
