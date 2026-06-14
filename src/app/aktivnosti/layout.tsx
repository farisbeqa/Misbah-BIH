import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aktivnosti',
  alternates: { canonical: '/aktivnosti' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
