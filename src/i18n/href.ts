import { DEFAULT_LOCALE, PREFIXED_LOCALES, type Locale } from './config'

// Pure helpers shared by the middleware, server components and client
// components (no React, no Next imports).

const PREFIX_RE = new RegExp(`^/(${PREFIXED_LOCALES.join('|')})(?=/|$|\\?|#)`)

/** Paths that exist once for all languages (API, admin, app preview, files) */
function isUnlocalizedPath(path: string): boolean {
  return (
    /^\/(api|admin|app|_next)(\/|$|\?|#)/.test(path) ||
    // a file in /public: /logo.jpg, /pozovite-nas/i/x.jpg, /sitemap.xml
    /\/[^/?#]+\.[a-z0-9]{2,5}(\?|#|$)/i.test(path)
  )
}

/** "/en/blog/5" -> { locale: "en", path: "/blog/5" }; "/blog" -> { locale: null, path: "/blog" } */
export function splitLocale(path: string): { locale: Locale | null; path: string } {
  const m = path.match(PREFIX_RE)
  if (!m) return { locale: null, path }
  const rest = path.slice(m[0].length)
  return { locale: m[1] as Locale, path: rest === '' ? '/' : rest.startsWith('/') ? rest : '/' + rest }
}

/** Removes a language prefix: "/de/videos/3" -> "/videos/3" */
export function stripLocale(path: string): string {
  return splitLocale(path).path
}

/**
 * Internal link for the given language: "/blog" -> "/en/blog" (English),
 * "/blog" (Bosnian). External links, anchors, files, /api and /admin are
 * returned unchanged.
 */
export function localizeHref(href: string, locale: Locale): string {
  if (!href.startsWith('/') || href.startsWith('//')) return href
  if (isUnlocalizedPath(href)) return href
  const bare = stripLocale(href)
  if (locale === DEFAULT_LOCALE) return bare
  return bare === '/' ? `/${locale}` : bare.startsWith('/?') || bare.startsWith('/#') ? `/${locale}${bare.slice(1)}` : `/${locale}${bare}`
}
