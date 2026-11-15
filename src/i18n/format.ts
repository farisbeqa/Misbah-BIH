import { DEFAULT_LOCALE, LOCALE_INFO, type Locale } from './config'

// Date formatting per language. Bosnian keeps the exact formats the site used
// before translations existed; other languages use their usual Intl format.

const BS_SHORT_MONTHS = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec']

/**
 * "15. nov 2026." (Bosnian, as on the home page cards) / "15 Nov 2026" /
 * "15. Nov. 2026" / "15 Kas 2026" / "١٥ نوفمبر ٢٠٢٦"
 */
export function formatShortDate(date: Date | string, locale: Locale): string {
  const d = new Date(date)
  if (locale === DEFAULT_LOCALE) return `${d.getDate()}. ${BS_SHORT_MONTHS[d.getMonth()]} ${d.getFullYear()}.`
  return d.toLocaleDateString(LOCALE_INFO[locale].intl, { day: 'numeric', month: 'short', year: 'numeric' })
}

/** Date with the given Intl options in the language's format (bs-BA for Bosnian) */
export function formatDateIntl(
  date: Date | string,
  locale: Locale,
  options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' },
): string {
  return new Date(date).toLocaleDateString(LOCALE_INFO[locale].intl, options)
}
