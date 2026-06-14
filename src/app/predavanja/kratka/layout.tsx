import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kratka predavanja',
  alternates: { canonical: '/predavanja/kratka' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
