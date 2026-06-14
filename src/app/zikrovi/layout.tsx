import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Zikrovi i Dove',
  description: 'Zikrovi s tekstom i audiom za svakodnevno učenje — jutarnji i večernji zikrovi, dove i Allahova imena.',
  alternates: { canonical: '/zikrovi' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
