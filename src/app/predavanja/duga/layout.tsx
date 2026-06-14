import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Duga predavanja',
  description: 'Opširna islamska predavanja o temama vjere, ahlaka, historije i duhovnog razvoja — za dublje razumijevanje islama.',
  alternates: { canonical: '/predavanja/duga' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
