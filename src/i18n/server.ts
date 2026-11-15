import 'server-only'
import { redirect as nextRedirect } from 'next/navigation'
import { headers } from 'next/headers'
import type { Metadata } from 'next'
import { DEFAULT_LOCALE, LOCALES, LOCALE_INFO, PATH_HEADER, type Locale } from './config'
import { localizeHref, stripLocale } from './href'
import { requestLocale } from './request'

// Server-side helpers. Translations themselves come from next-intl:
//   const t = await getTranslations('blog')

export { requestLocale as getLocale }

/** Path of the page being rendered, without the language prefix ("/blog/5") */
export function requestPath(): string {
  return headers().get(PATH_HEADER) || '/'
}

/** redirect() that keeps the visitor's language */
export function redirect(path: string): never {
  return nextRedirect(localizeHref(path, requestLocale()))
}

/** Internal href for the current request's language */
export function href(path: string): string {
  return localizeHref(path, requestLocale())
}

/**
 * canonical + hreflang links for a page, e.g. alternates('/blog/5') in the
 * current language: canonical "/en/blog/5", languages for all five + x-default.
 */
export function alternates(path: string, locale: Locale = requestLocale()): NonNullable<Metadata['alternates']> {
  const bare = stripLocale(path)
  const languages: Record<string, string> = {}
  for (const l of LOCALES) languages[l] = localizeHref(bare, l)
  languages['x-default'] = localizeHref(bare, DEFAULT_LOCALE)
  return { canonical: localizeHref(bare, locale), languages }
}

export function ogLocale(locale: Locale = requestLocale()): string {
  return LOCALE_INFO[locale].og
}

/** Intl formatting tag for the current language ("bs-BA", "de-DE", ...) */
export function intlLocale(locale: Locale = requestLocale()): string {
  return LOCALE_INFO[locale].intl
}

/** "15. novembra 2026." / "15 November 2026" / "15. November 2026" ... */
export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' },
  locale: Locale = requestLocale(),
): string {
  return new Date(date).toLocaleDateString(LOCALE_INFO[locale].intl, { timeZone: 'Europe/Sarajevo', ...options })
}
