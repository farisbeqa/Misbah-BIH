import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Duga predavanja',
  alternates: { canonical: '/predavanja/duga' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
