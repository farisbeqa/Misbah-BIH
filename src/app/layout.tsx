import type { Metadata } from 'next'
import { Manrope, IBM_Plex_Mono, Noto_Sans_Arabic } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import './globals.css'
import './theme.css'
import Navbar from '@/components/Navbar'
import ConditionalFooter from '@/components/ConditionalFooter'
import PozoviteNasButton from '@/components/PozoviteNasButton'
import { LOCALES, LOCALE_INFO } from '@/i18n/config'
import { clientMessages } from '@/i18n/messages'
import { alternates, getLocale, href, requestPath } from '@/i18n/server'
import { MEKTEB_PUBLIC, MEKTEB_URL } from '@/lib/links'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
})

const ibmMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-ibm-mono',
  display: 'swap',
  weight: ['400', '500'],
})

// Used by the Arabic version of the site (Manrope has no Arabic letters)
const notoArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  variable: '--font-arabic',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  preload: false,
})

const siteUrl = 'https://www.misbah-edu.com'

export async function generateMetadata(): Promise<Metadata> {
  const locale = getLocale()
  const t = await getTranslations({ locale, namespace: 'common.meta' })
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t('title'),
      template: '%s | Misbah EDU',
    },
    description: t('description'),
    keywords: t.raw('keywords') as string[],
    authors: [{ name: 'Misbah EDU', url: siteUrl }],
    creator: 'Misbah EDU',
    publisher: 'Misbah EDU',
    icons: { icon: '/favicon.svg', apple: '/logo.jpg' },
    // canonical + hreflang links for whichever page is being rendered
    alternates: alternates(requestPath(), locale),
    openGraph: {
      type: 'website',
      locale: LOCALE_INFO[locale].og,
      alternateLocale: LOCALES.filter(l => l !== locale).map(l => LOCALE_INFO[l].og),
      url: siteUrl,
      siteName: 'Misbah EDU',
      title: t('title'),
      description: t('description'),
      images: [
        {
          url: `${siteUrl}/logo.jpg`,
          width: 1000,
          height: 1000,
          alt: t('logoAlt'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@misbah_ba',
      title: t('twitterTitle'),
      description: t('description'),
      images: [`${siteUrl}/logo.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
    verification: {
      // Add your Google Search Console verification code here when you have it:
      // google: 'YOUR_VERIFICATION_CODE',
    },
  }
}

// JSON-LD structured data — helps Google understand the organisation
async function jsonLd() {
  const locale = getLocale()
  const t = await getTranslations({ locale, namespace: 'common.meta' })
  const nav = await getTranslations({ locale, namespace: 'nav' })
  const url = (path: string) => `${siteUrl}${href(path)}`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'Misbah EDU',
        url: siteUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/logo.jpg`,
          width: 1000,
          height: 1000,
        },
        description: t('orgDescription'),
        foundingLocation: { '@type': 'Place', name: t('foundingLocation') },
        sameAs: [
          'https://www.youtube.com/@misbah_ba',
          'https://www.instagram.com/misbah_edu',
          'https://www.tiktok.com/@misbah_ba',
          'https://www.facebook.com/MisbahBIH/',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'Misbah EDU',
        description: t('siteDescription'),
        publisher: { '@id': `${siteUrl}/#organization` },
        inLanguage: locale,
        potentialAction: {
          '@type': 'SearchAction',
          target: { '@type': 'EntryPoint', urlTemplate: `${url('/predavanja/duga')}?q={search_term_string}` },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'SiteLinksSearchBox',
        '@id': `${siteUrl}/#searchbox`,
        url: siteUrl,
        potentialAction: {
          '@type': 'SearchAction',
          target: { '@type': 'EntryPoint', urlTemplate: `${url('/predavanja/duga')}?q={search_term_string}` },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'ItemList',
        '@id': `${siteUrl}/#navigation`,
        name: t('navigation'),
        itemListElement: [
          { name: nav('lectures'), url: url('/predavanja/duga') },
          { name: nav('quran'), url: url('/kuran') },
          { name: nav('podcast'), url: url('/podcasts') },
          { name: nav('ilahije'), url: url('/ilahije/izvedba') },
          // Mekteb only once its site is public (src/lib/links.ts)
          ...(MEKTEB_PUBLIC ? [{ name: 'Mekteb', url: MEKTEB_URL }] : []),
          { name: nav('stories'), url: url('/price') },
          { name: nav('blog'), url: url('/blog') },
          { name: nav('aboutUs'), url: url('/o-nama') },
        ].map((item, i) => ({ '@type': 'SiteNavigationElement', position: i + 1, ...item })),
      },
      {
        '@type': 'Person',
        '@id': `${siteUrl}/#hamdo-solo`,
        name: 'Hamdo Solo',
        jobTitle: t('hamdoJob'),
        worksFor: { '@id': `${siteUrl}/#organization` },
        description: t('hamdoDescription'),
      },
    ],
  }
}

// Light or dark theme before the first paint: the visitor's choice (cookie
// "theme", set by the sun/moon button) or else the device setting. The admin
// pages always stay light. Colours: src/app/theme.css.
const THEME_SCRIPT = `(function(){try{if(location.pathname.indexOf('/admin')===0)return;var m=document.cookie.match(/(?:^|; )theme=(dark|light)/);var t=m?m[1]:(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t)}catch(e){}})()`

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = getLocale()
  const { dir } = LOCALE_INFO[locale]
  const messages = await getMessages({ locale })
  const fonts = `${manrope.variable} ${ibmMono.variable} ${notoArabic.variable}`

  return (
    // data-theme is set by THEME_SCRIPT before React starts, hence suppressHydrationWarning
    <html lang={locale} dir={dir} className={locale === 'ar' ? `${fonts} lang-ar` : fonts} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(await jsonLd()) }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased" style={{ background: 'var(--bg-f5f2ef)' }}>
        <NextIntlClientProvider locale={locale} messages={clientMessages(messages)} timeZone="Europe/Sarajevo">
          <Navbar />
          <main className="flex-1">{children}</main>
          <ConditionalFooter />
          <PozoviteNasButton />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
