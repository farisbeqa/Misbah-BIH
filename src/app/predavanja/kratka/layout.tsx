import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kratka predavanja',
  description: 'Kratka i koncizna islamska predavanja idealna za svakodnevno učenje, podsjećanje i jačanje imana.',
  alternates: { canonical: '/predavanja/kratka' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
