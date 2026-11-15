// Languages of the website. Bosnian is the default and keeps the existing URLs
// (/blog); the others live under a prefix (/en/blog, /ar/blog, /de/blog, /tr/blog).
// The visitor picks the language in the menu; the choice is remembered in a
// cookie. There is no detection by browser language.

export const LOCALES = ['bs', 'en', 'ar', 'de', 'tr'] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'bs'
export const PREFIXED_LOCALES = LOCALES.filter(l => l !== DEFAULT_LOCALE)

/** Remembers the visitor's choice; set only by the language picker */
export const LOCALE_COOKIE = 'NEXT_LOCALE'
/** Set by the middleware on every page request (never trusted from the client) */
export const LOCALE_HEADER = 'x-misbah-locale'
/** Path of the page without the language prefix, for canonical/hreflang links */
export const PATH_HEADER = 'x-misbah-path'

export const LOCALE_INFO: Record<Locale, {
  /** Name of the language in that language, for the picker */
  name: string
  short: string
  dir: 'ltr' | 'rtl'
  /** Open Graph locale */
  og: string
  /** BCP 47 tag for Intl date/number formatting */
  intl: string
}> = {
  bs: { name: 'Bosanski', short: 'BS', dir: 'ltr', og: 'bs_BA', intl: 'bs-BA' },
  en: { name: 'English', short: 'EN', dir: 'ltr', og: 'en_US', intl: 'en-GB' },
  ar: { name: 'العربية', short: 'AR', dir: 'rtl', og: 'ar_AR', intl: 'ar-u-nu-latn' },
  de: { name: 'Deutsch', short: 'DE', dir: 'ltr', og: 'de_DE', intl: 'de-DE' },
  tr: { name: 'Türkçe', short: 'TR', dir: 'ltr', og: 'tr_TR', intl: 'tr-TR' },
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value)
}
