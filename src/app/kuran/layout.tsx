import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Kur'an",
  alternates: { canonical: '/kuran' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
