import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Galerija',
  description: 'Fotografski arhiv islamskih predavanja, dova i zajedničkih događaja.',
  alternates: { canonical: '/galerija' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
