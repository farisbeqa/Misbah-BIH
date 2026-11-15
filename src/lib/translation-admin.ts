import 'server-only'
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda'
import { prisma } from './db'
import { ENTITIES, ENTITY_NAMES, sourceFields, sourceHash, type Entity } from './translation-spec'

// Data for /admin/prijevodi: which items are translated into which language.

export const TARGETS = ['en', 'ar', 'de', 'tr'] as const
export type Target = (typeof TARGETS)[number]

export const TARGET_LABELS: Record<Target, string> = { en: 'Engleski', ar: 'Arapski', de: 'Njemački', tr: 'Turski' }

export const ENTITY_LABELS: Record<Entity, string> = {
  video: 'Videa',
  blog: 'Blog',
  prica: 'Poučne priče',
  dua: 'Dove',
  ilahija: 'Ilahije (tekstovi)',
  zikr: 'Zikrovi (tekstovi)',
  quote: 'Misli dana',
  activity: 'Aktivnosti',
  gallery: 'Galerija',
  mekteb: 'Mekteb',
}

export const FIELD_LABELS: Record<string, string> = {
  title: 'Naslov',
  description: 'Opis',
  content: 'Tekst',
  text: 'Citat',
  source: 'Izvor',
}

/** Public page of an item (Bosnian address; prefix with /en etc. for a language) */
export function publicPath(entity: Entity, id: number): string {
  switch (entity) {
    case 'video': return `/videos/${id}`
    case 'blog': return `/blog/${id}`
    case 'prica': return `/price/${id}`
    case 'dua': return `/zikrovi/tekstovi/${id}`
    case 'ilahija': return `/ilahije/tekstovi/${id}`
    case 'zikr': return `/zikrovi/tekst/${id}`
    case 'mekteb': return `/mekteb/${id}`
    case 'activity': return `/aktivnosti/${id}`
    case 'gallery': return '/galerija'
    case 'quote': return '/'
  }
}

export type LangStatus = 'done' | 'manual' | 'stale' | 'outdated' | 'error' | 'missing'

export type ItemStatus = {
  entity: Entity
  id: number
  title: string
  published: boolean
  langs: Record<Target, LangStatus>
}

type AnyRow = Record<string, unknown> & { id: number; published?: boolean }

async function rowsOf(entity: Entity): Promise<AnyRow[]> {
  const order = { orderBy: { id: 'desc' as const } }
  switch (entity) {
    case 'video': return prisma.video.findMany(order)
    case 'blog': return prisma.blogPost.findMany(order)
    case 'activity': return prisma.activity.findMany(order)
    case 'quote': return prisma.quote.findMany(order)
    case 'gallery': return prisma.galleryImage.findMany(order)
    case 'ilahija': return prisma.ilahijaText.findMany(order)
    case 'dua': return prisma.duaText.findMany(order)
    case 'mekteb': return prisma.mektebPost.findMany(order)
    case 'zikr': return prisma.zikrText.findMany(order)
    case 'prica': return prisma.prica.findMany(order)
  }
}

export async function rowOf(entity: Entity, id: number): Promise<AnyRow | null> {
  const where = { where: { id } }
  switch (entity) {
    case 'video': return prisma.video.findUnique(where)
    case 'blog': return prisma.blogPost.findUnique(where)
    case 'activity': return prisma.activity.findUnique(where)
    case 'quote': return prisma.quote.findUnique(where)
    case 'gallery': return prisma.galleryImage.findUnique(where)
    case 'ilahija': return prisma.ilahijaText.findUnique(where)
    case 'dua': return prisma.duaText.findUnique(where)
    case 'mekteb': return prisma.mektebPost.findUnique(where)
    case 'zikr': return prisma.zikrText.findUnique(where)
    case 'prica': return prisma.prica.findUnique(where)
  }
}

export function itemTitle(entity: Entity, row: AnyRow): string {
  const pick = (k: string) => (typeof row[k] === 'string' && (row[k] as string).trim() ? (row[k] as string).trim() : '')
  const t = entity === 'quote' ? pick('text') : pick('title') || pick('description')
  const title = t || `#${row.id}`
  return title.length > 110 ? title.slice(0, 107) + '…' : title
}

function langStatus(hash: string, t: { sourceHash: string; status: string; manual: boolean } | undefined): LangStatus {
  if (!t) return 'missing'
  if (t.status === 'error') return 'error'
  if (t.manual) return t.sourceHash === hash ? 'manual' : 'stale'
  return t.sourceHash === hash ? 'done' : 'outdated'
}

/** Translation status of every item of the given entities */
export async function loadStatuses(entities: Entity[] = ENTITY_NAMES): Promise<ItemStatus[]> {
  const out: ItemStatus[] = []
  for (const entity of entities) {
    const [rows, translations] = await Promise.all([
      rowsOf(entity),
      prisma.translation.findMany({
        where: { entity },
        select: { entityId: true, locale: true, sourceHash: true, status: true, manual: true },
      }),
    ])
    const byKey = new Map(translations.map(t => [`${t.entityId}:${t.locale}`, t]))
    for (const row of rows) {
      const fields = sourceFields(entity, row)
      if (Object.keys(fields).length === 0) continue
      const hash = sourceHash(fields)
      const langs = Object.fromEntries(TARGETS.map(l => [l, langStatus(hash, byKey.get(`${row.id}:${l}`))])) as Record<Target, LangStatus>
      out.push({ entity, id: row.id, title: itemTitle(entity, row), published: row.published !== false, langs })
    }
  }
  return out
}

export function translatedFieldNames(entity: Entity): readonly string[] {
  return ENTITIES[entity].fields
}

let lambda: LambdaClient | null = null

/** Ask the translator worker to do something now (in the background) */
export async function invokeTranslator(payload: Record<string, unknown>): Promise<void> {
  lambda ??= new LambdaClient({ region: process.env.TRANSLATOR_REGION ?? 'eu-central-1' })
  await lambda.send(new InvokeCommand({
    FunctionName: process.env.TRANSLATOR_FUNCTION ?? 'misbah-translator',
    InvocationType: 'Event',
    Payload: Buffer.from(JSON.stringify(payload)),
  }))
}
