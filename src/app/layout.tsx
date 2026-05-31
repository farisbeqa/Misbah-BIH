import type { Metadata } from 'next'
import { Manrope, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Misbah EDU — Islamska predavanja i sadržaj',
  description: 'Islamska predavanja, hutbe i sadržaj efendije Hamde Solo, imama džamije Carina, Sarajevo.',
  keywords: 'Misbah EDU, islamska predavanja, hutba, Hamdo Solo, Sarajevo, džamija Carina',
  icons: {
    icon: '/logo.jpg',
    apple: '/logo.jpg',
  },
  openGraph: {
    title: 'Misbah EDU — Islamska predavanja i sadržaj',
    description: 'Islamska predavanja, hutbe i sadržaj efendije Hamde Solo, imama džamije Carina, Sarajevo.',
    siteName: 'Misbah EDU',
    images: [{ url: '/logo.jpg' }],
    locale: 'bs_BA',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Misbah EDU',
    description: 'Islamska predavanja i sadržaj efendije Hamde Solo.',
    images: ['/logo.jpg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bs" className={`${manrope.variable} ${ibmMono.variable}`}>
      <body className="min-h-screen flex flex-col font-sans antialiased" style={{ background: '#F5F2EF' }}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
