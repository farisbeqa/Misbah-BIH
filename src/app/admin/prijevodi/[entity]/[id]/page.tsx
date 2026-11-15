import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, ExternalLink, Languages } from 'lucide-react'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { isEntity, sourceFields, sourceHash } from '@/lib/translation-spec'
import { ENTITY_LABELS, FIELD_LABELS, TARGETS, itemTitle, publicPath, rowOf, translatedFieldNames } from '@/lib/translation-admin'
import TranslationEditor, { type EditorLang } from './TranslationEditor'

export const dynamic = 'force-dynamic'

export default async function TranslationEditPage({ params }: { params: { entity: string; id: string } }) {
  const session = await requireAuth()
  if (!session) redirect('/admin')
  if (!isEntity(params.entity)) notFound()
  const entity = params.entity
  const id = parseInt(params.id)

  const row = await rowOf(entity, id)
  if (!row) notFound()
  const source = sourceFields(entity, row)
  const hash = sourceHash(source)
  const fieldNames = translatedFieldNames(entity).filter(f => source[f] !== undefined)

  let translations: { locale: string; fields: string; sourceHash: string; status: string; manual: boolean; model: string | null; error: string | null; updatedAt: Date }[] = []
  try {
    translations = await prisma.translation.findMany({ where: { entity, entityId: id } })
  } catch (err) {
    console.error('[admin/prijevodi]', err)
  }

  const langs: EditorLang[] = TARGETS.map(locale => {
    const t = translations.find(x => x.locale === locale)
    let fields: Record<string, string> = {}
    try { fields = t ? JSON.parse(t.fields) : {} } catch { /* broken row */ }
    return {
      locale,
      fields,
      exists: !!t,
      manual: t?.manual ?? false,
      upToDate: t ? t.sourceHash === hash : false,
      status: t?.status ?? 'missing',
      model: t?.model ?? null,
      error: t?.error ?? null,
      updatedAt: t ? t.updatedAt.toISOString() : null,
    }
  })

  const path = publicPath(entity, id)

  return (
    <div className="min-h-screen bg-zinc-50">
      <nav className="bg-zinc-950 text-white px-4 sm:px-6 py-4 sticky top-0 z-30 border-b border-zinc-800">
        <div className="max-w-5xl mx-auto flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center text-white font-black text-sm">م</div>
          <span className="font-black text-sm">Misbah EDU</span>
          <span className="text-zinc-500 text-xs font-medium px-2 py-0.5 bg-zinc-800 rounded-md">Admin</span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <Link href={`/admin/prijevodi?tip=${entity}`} className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-800 mb-6 text-sm transition-colors">
          <ArrowLeft size={15} /> Nazad na prijevode
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-brand-dim rounded-xl flex items-center justify-center flex-shrink-0">
              <Languages size={20} className="text-brand" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wide">{ENTITY_LABELS[entity]} · #{id}</p>
              <h1 className="text-xl font-black text-zinc-900 break-words">{itemTitle(entity, row)}</h1>
            </div>
          </div>
          <Link href={path} target="_blank" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800">
            <ExternalLink size={14} /> Na stranici
          </Link>
        </div>

        <section className="bg-white rounded-2xl border border-zinc-100 shadow-card p-5 mb-6">
          <h2 className="text-sm font-bold text-zinc-900 mb-3">Original (bosanski)</h2>
          <div className="flex flex-col gap-4">
            {fieldNames.map(f => (
              <div key={f}>
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1">{FIELD_LABELS[f] ?? f}</p>
                <div className="text-sm text-zinc-700 whitespace-pre-wrap break-words max-h-72 overflow-y-auto bg-zinc-50 rounded-lg p-3 border border-zinc-100">{source[f]}</div>
              </div>
            ))}
          </div>
        </section>

        <TranslationEditor entity={entity} id={id} fieldNames={[...fieldNames]} fieldLabels={FIELD_LABELS} langs={langs} publicPath={path} />
      </div>
    </div>
  )
}
