import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Podcast',
  alternates: { canonical: '/podcasts' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
