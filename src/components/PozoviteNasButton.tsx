'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CalendarHeart } from 'lucide-react'

// Small "Pozovite nas" button in the bottom-right corner of every page. It sits
// above the page instead of in the navbar, so the existing layout stays as is.
export default function PozoviteNasButton() {
  const pathname = usePathname()
  if (pathname.startsWith('/admin') || pathname.startsWith('/pozovite-nas') || pathname.startsWith('/app')) return null

  return (
    <Link href="/pozovite-nas" aria-label="Pozovite nas — predavanja, hor i omladinska druženja"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2 bg-[#8b1e3f] text-white pl-3.5 pr-4 py-3 text-sm sm:text-base shadow-[0_8px_24px_rgba(20,17,16,0.25)] hover:bg-[#7a1a37] transition-colors">
      <CalendarHeart size={18} />
      Pozovite nas
    </Link>
  )
}
