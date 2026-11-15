import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { isEntity, sourceFields, sourceHash } from '@/lib/translation-spec'
import { TARGETS, invokeTranslator, rowOf, translatedFieldNames, type Target } from '@/lib/translation-admin'

type Params = { params: { entity: string; id: string } }

const isTarget = (v: unknown): v is Target => typeof v === 'string' && (TARGETS as readonly string[]).includes(v)

// Save a translation edited by hand in /admin/prijevodi. It is marked as manual
// and is never overwritten automatically (if the Bosnian text changes later it
// shows up as "zastarjelo" so someone can look at it).
export async function PUT(request: NextRequest, { params }: Params) {
  const session = await requireAuth()
  if (!session) return NextResponse.json({ error: 'Nije autorizovano' }, { status: 401 })
  if (!isEntity(params.entity)) return NextResponse.json({ error: 'Nepoznat tip sadržaja' }, { status: 400 })
  const entity = params.entity
  const id = parseInt(params.id)

  const body = await request.json().catch(() => null) as { locale?: string; fields?: Record<string, unknown> } | null
  if (!body || !isTarget(body.locale) || !body.fields || typeof body.fields !== 'object') {
    return NextResponse.json({ error: 'Neispravan zahtjev' }, { status: 400 })
  }
  const locale = body.locale

  const row = await rowOf(entity, id)
  if (!row) return NextResponse.json({ error: 'Sadržaj nije pronađen' }, { status: 404 })

  const allowed = translatedFieldNames(entity)
  const fields: Record<string, string> = {}
  for (const f of allowed) {
    const v = body.fields[f]
    if (typeof v === 'string' && v.trim() !== '') fields[f] = v
  }
  if (Object.keys(fields).length === 0) return NextResponse.json({ error: 'Prijevod je prazan' }, { status: 400 })

  const hash = sourceHash(sourceFields(entity, row))
  const data = { fields: JSON.stringify(fields), sourceHash: hash, status: 'done', manual: true, model: `ručno (${session.username ?? 'admin'})`, error: null }
  const key = { entity_entityId_locale: { entity, entityId: id, locale } }
  const existing = await prisma.translation.findUnique({ where: key, select: { id: true } })
  if (existing) await prisma.translation.update({ where: { id: existing.id }, data })
  else await prisma.translation.create({ data: { entity, entityId: id, locale, ...data } })

  return NextResponse.json({ ok: true })
}

// Translate again with Claude (replaces a hand-edited translation too)
export async function POST(request: NextRequest, { params }: Params) {
  const session = await requireAuth()
  if (!session) return NextResponse.json({ error: 'Nije autorizovano' }, { status: 401 })
  if (!isEntity(params.entity)) return NextResponse.json({ error: 'Nepoznat tip sadržaja' }, { status: 400 })
  const body = await request.json().catch(() => ({})) as { locale?: string }
  const locale = isTarget(body.locale) ? body.locale : undefined
  try {
    await invokeTranslator({ entity: params.entity, id: parseInt(params.id), locale, force: true })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[translations] invoke failed', err)
    return NextResponse.json({ error: 'Prevodilac trenutno nije dostupan' }, { status: 502 })
  }
}
