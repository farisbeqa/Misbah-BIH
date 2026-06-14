import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Kur'an",
  description: "Učite i slušajte Kur'an uz pažljivo odabrane tilawete, kiraete i tumačenja kur'anskih ajeta.",
  alternates: { canonical: '/kuran' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
