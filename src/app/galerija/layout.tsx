import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Galerija',
  alternates: { canonical: '/galerija' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
