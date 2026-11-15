'use client'

import { usePathname } from '@/i18n/navigation'
import Footer from './Footer'

export default function ConditionalFooter() {
  const pathname = usePathname()
  if (pathname.startsWith('/admin')) return null
  return <Footer />
}
