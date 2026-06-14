import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ilahije – Izvedba',
  alternates: { canonical: '/ilahije/izvedba' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
