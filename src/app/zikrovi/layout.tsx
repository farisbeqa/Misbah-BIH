import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Zikrovi i Dove',
  alternates: { canonical: '/zikrovi' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
