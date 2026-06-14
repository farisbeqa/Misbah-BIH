import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aktivnosti',
  description: 'Najnovije vijesti, aktivnosti i događaji islamske zajednice — ostanite informisani i uključeni.',
  alternates: { canonical: '/aktivnosti' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
