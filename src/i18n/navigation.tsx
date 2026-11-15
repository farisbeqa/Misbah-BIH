'use client'

// Drop-in replacements for next/link and next/navigation in the public site:
// internal links keep the visitor in the language they are reading.
//   import Link from '@/i18n/navigation'                 (instead of next/link)
//   import { usePathname, useRouter } from '@/i18n/navigation'
// usePathname() returns the path without the language prefix ("/blog", never
// "/en/blog"), so active-menu checks work the same in every language.

import NextLink from 'next/link'
import { usePathname as useNextPathname, useRouter as useNextRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { forwardRef, useMemo, type ComponentProps } from 'react'
import { isLocale, DEFAULT_LOCALE, type Locale } from './config'
import { localizeHref, stripLocale } from './href'

export function useCurrentLocale(): Locale {
  const locale = useLocale()
  return isLocale(locale) ? locale : DEFAULT_LOCALE
}

type LinkProps = ComponentProps<typeof NextLink>

const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link({ href, ...rest }, ref) {
  const locale = useCurrentLocale()
  const localized =
    typeof href === 'string'
      ? localizeHref(href, locale)
      : href && typeof href === 'object' && typeof href.pathname === 'string'
        ? { ...href, pathname: localizeHref(href.pathname, locale) }
        : href
  return <NextLink ref={ref} href={localized} {...rest} />
})

export default Link
export { Link }

/** Path of the current page without the language prefix */
export function usePathname(): string {
  return stripLocale(useNextPathname() ?? '/')
}

/** Like next/navigation's useRouter, but push/replace/prefetch stay in the current language */
export function useRouter() {
  const router = useNextRouter()
  const locale = useCurrentLocale()
  return useMemo(
    () => ({
      ...router,
      push: (href: string, options?: Parameters<typeof router.push>[1]) => router.push(localizeHref(href, locale), options),
      replace: (href: string, options?: Parameters<typeof router.replace>[1]) => router.replace(localizeHref(href, locale), options),
      prefetch: (href: string) => router.prefetch(localizeHref(href, locale)),
    }),
    [router, locale],
  )
}

/** Localizes an internal href for the current language (for <a>, window.location, share links) */
export function useLocalizedHref() {
  const locale = useCurrentLocale()
  return (href: string) => localizeHref(href, locale)
}
