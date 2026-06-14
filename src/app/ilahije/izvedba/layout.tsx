import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ilahije – Izvedba',
  description: 'Ilahije, kaside i duhovna muzika — video i audio izvedbe koje bude ljubav prema Allahu i Poslaniku ﷺ.',
  alternates: { canonical: '/ilahije/izvedba' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
