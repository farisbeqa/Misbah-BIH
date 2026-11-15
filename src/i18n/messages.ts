import { DEFAULT_LOCALE, type Locale } from './config'
import { NAMESPACES, SERVER_ONLY_NAMESPACES, type Namespace } from './namespaces'

// Interface texts live in messages/<locale>/<namespace>.json. Bosnian
// (messages/bs) is the source; the other languages are generated from it with
// `npm run i18n:translate` (Claude on Amazon Bedrock) and can be edited by hand.
// A text missing in a language falls back to Bosnian.

export { NAMESPACES, SERVER_ONLY_NAMESPACES, type Namespace }

type Messages = Record<string, unknown>

async function loadNamespace(locale: Locale, ns: Namespace): Promise<Messages> {
  try {
    return (await import(`../../messages/${locale}/${ns}.json`)).default as Messages
  } catch {
    return {}
  }
}

function isPlainObject(v: unknown): v is Messages {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

/** Deep merge: values from `over` win, missing keys come from `base` */
function merge(base: Messages, over: Messages): Messages {
  const out: Messages = { ...base }
  for (const [k, v] of Object.entries(over)) {
    out[k] = isPlainObject(v) && isPlainObject(base[k]) ? merge(base[k] as Messages, v) : v
  }
  return out
}

const cache = new Map<Locale, Promise<Messages>>()

async function build(locale: Locale): Promise<Messages> {
  const entries = await Promise.all(
    NAMESPACES.map(async ns => {
      const own = await loadNamespace(locale, ns)
      if (locale === DEFAULT_LOCALE) return [ns, own] as const
      return [ns, merge(await loadNamespace(DEFAULT_LOCALE, ns), own)] as const
    }),
  )
  return Object.fromEntries(entries)
}

export function loadMessages(locale: Locale): Promise<Messages> {
  // Re-read on every request in development so edits show up immediately
  if (process.env.NODE_ENV !== 'production') return build(locale)
  let p = cache.get(locale)
  if (!p) {
    p = build(locale)
    cache.set(locale, p)
  }
  return p
}

/** The messages client components may need (everything except the long server-only texts) */
export function clientMessages(messages: Messages): Messages {
  return Object.fromEntries(
    Object.entries(messages).filter(([ns]) => !SERVER_ONLY_NAMESPACES.includes(ns as Namespace)),
  )
}
