import type { Metadata } from 'next'
import { Manrope, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import ConditionalFooter from '@/components/ConditionalFooter'

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

const siteUrl = 'https://www.misbah-edu.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Misbah EDU – Islamska predavanja | hfz. Hamdo Solo',
    template: '%s | Misbah EDU',
  },
  description:
    'Misbah EDU – platforma s islamskim predavanjima, hutbama, učenjem Kur\'ana, ilahijama i podcast sadržajima. Hfz. Hamdo Solo, imam džamije Carina, Sarajevo.',
  keywords: [
    'Misbah EDU', 'Misbah', 'islamska predavanja', 'hutba', 'Hamdo Solo',
    'hfz Hamdo Solo', 'hafiz Hamdo Solo', 'džamija Carina', 'Sarajevo',
    'islamski sadržaj', "učenje Kur'ana", 'ilahije', 'zikrovi', 'podcast',
    'islamska edukacija', 'Bosna', 'BIH', 'islamske nauke',
  ],
  authors: [{ name: 'Misbah EDU', url: siteUrl }],
  creator: 'Misbah EDU',
  publisher: 'Misbah EDU',
  alternates: { canonical: siteUrl },
  icons: { icon: '/favicon.svg', apple: '/logo.jpg' },
  openGraph: {
    type: 'website',
    locale: 'bs_BA',
    url: siteUrl,
    siteName: 'Misbah EDU',
    title: 'Misbah EDU – Islamska predavanja | hfz. Hamdo Solo',
    description:
      'Islamska predavanja, hutbe i sadržaj efendije Hamde Solo, imama džamije Carina, Sarajevo. Predavanja, Kur\'an, ilahije, zikrovi i podcast.',
    images: [
      {
        url: `${siteUrl}/logo.jpg`,
        width: 1000,
        height: 1000,
        alt: 'Misbah EDU logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@misbah_ba',
    title: 'Misbah EDU – Islamska predavanja',
    description: 'Islamska predavanja, hutbe i sadržaj efendije Hamde Solo, imama džamije Carina, Sarajevo.',
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

// JSON-LD structured data — helps Google understand the organisation
const jsonLd = {
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
      description:
        'Misbah EDU je islamska digitalna platforma posvećena širenju korisnog znanja kroz predavanja, hutbe, učenje Kur\'ana i druge sadržaje.',
      foundingLocation: { '@type': 'Place', name: 'Sarajevo, Bosna i Hercegovina' },
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
      description: 'Islamska predavanja, hutbe, Kur\'an i sadržaji za muslimane u Bosni i Hercegovini.',
      publisher: { '@id': `${siteUrl}/#organization` },
      inLanguage: 'bs',
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${siteUrl}/predavanja/duga?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Person',
      '@id': `${siteUrl}/#hamdo-solo`,
      name: 'Hamdo Solo',
      jobTitle: 'Imam, hafiz Kur\'ana',
      worksFor: { '@id': `${siteUrl}/#organization` },
      description: 'Hfz. Hamdo Solo, imam džamije Carina u Sarajevu, predavač i hafiz Kur\'ana.',
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bs" className={`${manrope.variable} ${ibmMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased" style={{ background: '#F5F2EF' }}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <ConditionalFooter />
      </body>
    </html>
  )
}
