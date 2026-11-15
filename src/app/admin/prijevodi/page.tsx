import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, Languages, Pencil, Search } from 'lucide-react'
import { requireAuth } from '@/lib/auth'
import { ENTITY_NAMES, isEntity, type Entity } from '@/lib/translation-spec'
import { ENTITY_LABELS, TARGETS, TARGET_LABELS, loadStatuses, type ItemStatus, type LangStatus } from '@/lib/translation-admin'
import SweepButton from './SweepButton'

export const dynamic = 'force-dynamic'

const STATUS_STYLE: Record<LangStatus, { label: string; cls: string; title: string }> = {
  done:     { label: '✓', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', title: 'Prevedeno automatski' },
  manual:   { label: '✎', cls: 'bg-sky-50 text-sky-700 border-sky-200', title: 'Ručno ispravljeno' },
  outdated: { label: '↻', cls: 'bg-amber-50 text-amber-700 border-amber-200', title: 'Bosanski tekst je promijenjen, novi prijevod je u toku' },
  stale:    { label: '!', cls: 'bg-orange-50 text-orange-700 border-orange-300', title: 'Ručni prijevod, a bosanski tekst je u međuvremenu promijenjen: provjerite' },
  error:    { label: '✗', cls: 'bg-red-50 text-red-700 border-red-200', title: 'Greška pri prevođenju' },
  missing:  { label: '–', cls: 'bg-zinc-50 text-zinc-400 border-zinc-200', title: 'Još nije prevedeno' },
}

const PAGE = 60

function needsAttention(s: ItemStatus) {
  return TARGETS.some(l => s.langs[l] !== 'done' && s.langs[l] !== 'manual')
}

export default async function AdminPrijevodiPage({ searchParams }: { searchParams: { tip?: string; q?: string; status?: string; str?: string } }) {
  const session = await requireAuth()
  if (!session) redirect('/admin')

  const tip: Entity | 'all' = isEntity(searchParams.tip) ? searchParams.tip : 'all'
  const q = (searchParams.q ?? '').trim().toLowerCase()
  const onlyProblems = searchParams.status === 'problemi'
  const page = Math.max(1, parseInt(searchParams.str ?? '1') || 1)

  let statuses: ItemStatus[] = []
  let loadError: string | null = null
  try {
    statuses = await loadStatuses()
  } catch (err) {
    console.error('[admin/prijevodi]', err)
    loadError = 'Tabela prijevoda još ne postoji ili baza nije dostupna (pokrenite scripts/aws/add-translation-table.js).'
  }

  // Summary per language over everything
  const summary = TARGETS.map(l => ({
    locale: l,
    done: statuses.filter(s => s.langs[l] === 'done' || s.langs[l] === 'manual').length,
    total: statuses.length,
    problems: statuses.filter(s => s.langs[l] === 'error' || s.langs[l] === 'stale').length,
  }))
  const counts = Object.fromEntries(ENTITY_NAMES.map(e => [e, statuses.filter(s => s.entity === e).length])) as Record<Entity, number>

  const filtered = statuses.filter(s =>
    (tip === 'all' || s.entity === tip) &&
    (!q || s.title.toLowerCase().includes(q)) &&
    (!onlyProblems || needsAttention(s)),
  )
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE))
  const shown = filtered.slice((page - 1) * PAGE, page * PAGE)

  const href = (over: Record<string, string | undefined>) => {
    const p = new URLSearchParams()
    const merged = { tip: tip === 'all' ? undefined : tip, q: q || undefined, status: onlyProblems ? 'problemi' : undefined, ...over }
    for (const [k, v] of Object.entries(merged)) if (v) p.set(k, v)
    const s = p.toString()
    return `/admin/prijevodi${s ? `?${s}` : ''}`
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <nav className="bg-zinc-950 text-white px-4 sm:px-6 py-4 sticky top-0 z-30 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center text-white font-black text-sm">م</div>
          <span className="font-black text-sm">Misbah EDU</span>
          <span className="text-zinc-500 text-xs font-medium px-2 py-0.5 bg-zinc-800 rounded-md">Admin</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-800 mb-6 text-sm transition-colors">
          <ArrowLeft size={15} /> Nazad na dashboard
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-dim rounded-xl flex items-center justify-center flex-shrink-0">
              <Languages size={20} className="text-brand" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-zinc-900">Prijevodi</h1>
              <p className="text-zinc-500 text-sm max-w-2xl">
                Sav sadržaj se automatski prevodi na engleski, arapski, njemački i turski (Claude na AWS-u), u roku od minute-dvije nakon objave ili izmjene.
                Ovdje možete pregledati i ručno ispraviti prijevode.
              </p>
            </div>
          </div>
          <SweepButton />
        </div>

        {loadError && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm mb-6">{loadError}</div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {summary.map(s => (
            <div key={s.locale} className="bg-white rounded-2xl p-4 border border-zinc-100 shadow-card">
              <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wide">{TARGET_LABELS[s.locale]}</p>
              <p className="text-2xl font-black text-zinc-900 mt-1">{s.done}<span className="text-zinc-300 text-base font-bold"> / {s.total}</span></p>
              <p className={`text-xs mt-0.5 ${s.problems ? 'text-orange-600' : 'text-zinc-400'}`}>
                {s.problems ? `${s.problems} za provjeru` : s.done === s.total && s.total > 0 ? 'Sve prevedeno' : 'prevedeno'}
              </p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Link href={href({ tip: undefined, str: undefined })}
            className={`px-3 py-1.5 rounded-lg text-sm border ${tip === 'all' ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'}`}>
            Sve ({statuses.length})
          </Link>
          {ENTITY_NAMES.filter(e => counts[e] > 0).map(e => (
            <Link key={e} href={href({ tip: e, str: undefined })}
              className={`px-3 py-1.5 rounded-lg text-sm border ${tip === e ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'}`}>
              {ENTITY_LABELS[e]} ({counts[e]})
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <form action="/admin/prijevodi" className="flex items-center gap-2 bg-white border border-zinc-200 rounded-xl px-3 py-2 flex-1 min-w-[220px] max-w-md">
            {tip !== 'all' && <input type="hidden" name="tip" value={tip} />}
            {onlyProblems && <input type="hidden" name="status" value="problemi" />}
            <Search size={15} className="text-zinc-400" />
            <input name="q" defaultValue={searchParams.q ?? ''} placeholder="Traži po naslovu…" className="flex-1 outline-none text-sm bg-transparent" />
          </form>
          <Link href={href({ status: onlyProblems ? undefined : 'problemi', str: undefined })}
            className={`px-3 py-2 rounded-xl text-sm border ${onlyProblems ? 'bg-orange-50 text-orange-700 border-orange-300' : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'}`}>
            {onlyProblems ? '✓ ' : ''}Samo nepotpuni
          </Link>
          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
            {(Object.keys(STATUS_STYLE) as LangStatus[]).map(s => (
              <span key={s} className="inline-flex items-center gap-1">
                <span className={`inline-flex w-5 h-5 items-center justify-center rounded border text-[11px] font-bold ${STATUS_STYLE[s].cls}`}>{STATUS_STYLE[s].label}</span>
                {STATUS_STYLE[s].title.split(',')[0].split(':')[0]}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-100 shadow-card overflow-hidden">
          <div className="hidden sm:grid grid-cols-[1fr_auto_auto] gap-4 px-4 py-2.5 border-b border-zinc-100 text-xs font-semibold text-zinc-400 uppercase tracking-wide">
            <span>Sadržaj</span>
            <span className="grid grid-cols-4 gap-1.5 w-[132px] text-center">{TARGETS.map(l => <span key={l}>{l}</span>)}</span>
            <span className="w-16" />
          </div>
          {shown.length === 0 && <p className="text-center text-zinc-400 text-sm py-10">Nema stavki za ovaj filter.</p>}
          {shown.map(s => (
            <div key={`${s.entity}-${s.id}`} className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_auto_auto] gap-x-4 gap-y-2 items-center px-4 py-3 border-b border-zinc-50 last:border-0 hover:bg-zinc-50/60">
              <div className="min-w-0">
                <p className="text-sm font-medium text-zinc-800 truncate">{s.title}</p>
                <p className="text-xs text-zinc-400">{ENTITY_LABELS[s.entity]} · #{s.id}{s.published ? '' : ' · nije objavljeno'}</p>
              </div>
              <div className="grid grid-cols-4 gap-1.5 w-[132px] order-3 sm:order-none col-span-2 sm:col-span-1">
                {TARGETS.map(l => (
                  <span key={l} title={`${TARGET_LABELS[l]}: ${STATUS_STYLE[s.langs[l]].title}`}
                    className={`inline-flex h-7 items-center justify-center rounded-md border text-xs font-bold ${STATUS_STYLE[s.langs[l]].cls}`}>
                    <span className="sm:hidden me-1 font-semibold uppercase opacity-60">{l}</span>{STATUS_STYLE[s.langs[l]].label}
                  </span>
                ))}
              </div>
              <Link href={`/admin/prijevodi/${s.entity}/${s.id}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline justify-self-end w-16">
                <Pencil size={12} /> Uredi
              </Link>
            </div>
          ))}
        </div>

        {pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-5 text-sm">
            {page > 1 && <Link href={href({ str: String(page - 1) })} className="px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:border-zinc-400">← Prethodna</Link>}
            <span className="text-zinc-500">Stranica {page} od {pages}</span>
            {page < pages && <Link href={href({ str: String(page + 1) })} className="px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:border-zinc-400">Sljedeća →</Link>}
          </div>
        )}
      </div>
    </div>
  )
}
