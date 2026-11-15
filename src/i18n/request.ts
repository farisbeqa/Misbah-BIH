import { getRequestConfig } from 'next-intl/server'
import { headers } from 'next/headers'
import { DEFAULT_LOCALE, LOCALE_HEADER, isLocale, type Locale } from './config'
import { loadMessages } from './messages'

/** Language of the current request, as decided by the middleware from the URL */
export function requestLocale(): Locale {
  const value = headers().get(LOCALE_HEADER)
  return isLocale(value) ? value : DEFAULT_LOCALE
}

export default getRequestConfig(async ({ locale: explicit }) => {
  const locale = isLocale(explicit) ? explicit : requestLocale()
  return {
    locale,
    messages: await loadMessages(locale),
    timeZone: 'Europe/Sarajevo',
    onError(error) {
      // A missing text falls back to its key in production instead of crashing the page
      if (process.env.NODE_ENV !== 'production') console.error('[i18n]', error.message)
    },
    getMessageFallback({ namespace, key }) {
      return namespace ? `${namespace}.${key}` : key
    },
  }
})
