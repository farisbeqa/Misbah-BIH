import 'server-only'
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda'
import { prisma } from './db'
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/i18n/config'
import { ENTITIES, type Entity } from './translation-spec'

// Translations of database content (videos, blog posts, duas, ...).
//
// Reading: pages pass the rows they show through localizeRows()/localizeRow();
// in Bosnian nothing changes, in another language the translated fields are
// laid over the Bosnian ones (Bosnian stays when there is no translation yet).
//
// Writing: after an admin creates or edits content, queueTranslation() asks the
// translator worker (AWS Lambda "misbah-translator", Claude on Amazon Bedrock)
// to translate it into every language in the background. A daily sweep of the
// same worker catches anything missed. Each text is translated once and saved:
// visitors never cause a Claude request.

export type Localized<T> = T & {
  /** true when the shown fields are a translation (not the Bosnian original) */
  translated?: boolean
  /** ilahije: translated meaning shown under the original lyrics */
  meaning?: string
}

function overlay<T extends { id: number }>(entity: Entity, row: T, fields: Record<string, string> | undefined): Localized<T> {
  if (!fields) return row
  const spec = ENTITIES[entity] as { fields: readonly string[]; rename?: Record<string, string> }
  const out: Record<string, unknown> = { ...row }
  let applied = false
  for (const f of spec.fields) {
    const v = fields[f]
    if (typeof v !== 'string' || v.trim() === '') continue
    // A "translation" equal to the original adds nothing (names; ilahije whose
    // lyrics are already in this language would otherwise repeat as their meaning)
    if (v.trim() === String((row as Record<string, unknown>)[f] ?? '').trim()) continue
    out[spec.rename?.[f] ?? f] = v
    applied = true
  }
  if (applied) out.translated = true
  return out as Localized<T>
}

export async function localizeRows<T extends { id: number }>(entity: Entity, rows: T[], locale: Locale): Promise<Localized<T>[]> {
  if (locale === DEFAULT_LOCALE || rows.length === 0) return rows
  try {
    const found = await prisma.translation.findMany({
      where: { entity, locale, entityId: { in: rows.map(r => r.id) } },
      select: { entityId: true, fields: true },
    })
    const byId = new Map<number, Record<string, string>>()
    for (const t of found) {
      try { byId.set(t.entityId, JSON.parse(t.fields)) } catch { /* ignore a broken row */ }
    }
    return rows.map(r => overlay(entity, r, byId.get(r.id)))
  } catch (err) {
    // Never break a page because of translations: show Bosnian
    console.error('[translations] read failed:', err)
    return rows
  }
}

export async function localizeRow<T extends { id: number }>(entity: Entity, row: T | null, locale: Locale): Promise<Localized<T> | null> {
  if (!row) return null
  const [out] = await localizeRows(entity, [row], locale)
  return out
}

/** Language requested by a client component from an API route (?lang=en); Bosnian by default */
export function apiLocale(request: Request): Locale {
  const lang = new URL(request.url).searchParams.get('lang')
  return isLocale(lang) ? lang : DEFAULT_LOCALE
}

let lambda: LambdaClient | null = null

/**
 * Translate (or re-translate) one item in the background. Never throws: if the
 * worker cannot be reached, the daily sweep translates the item later.
 */
export async function queueTranslation(entity: Entity, id: number): Promise<void> {
  if (process.env.TRANSLATIONS_DISABLED === '1') return
  try {
    lambda ??= new LambdaClient({ region: process.env.TRANSLATOR_REGION ?? 'eu-central-1' })
    await lambda.send(new InvokeCommand({
      FunctionName: process.env.TRANSLATOR_FUNCTION ?? 'misbah-translator',
      InvocationType: 'Event',
      Payload: Buffer.from(JSON.stringify({ entity, id })),
    }))
  } catch (err) {
    console.error(`[translations] could not queue ${entity} ${id}:`, err)
  }
}

/** Remove the translations of deleted content */
export async function deleteTranslations(entity: Entity, id: number): Promise<void> {
  try {
    await prisma.translation.deleteMany({ where: { entity, entityId: id } })
  } catch (err) {
    console.error(`[translations] could not delete ${entity} ${id}:`, err)
  }
}
