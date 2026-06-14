import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Podcast',
  description: 'Islamski podcast — razgovori o vjeri, znanju i svakodnevnom životu muslimana. Slušajte gdje god se nalazite.',
  alternates: { canonical: '/podcasts' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
