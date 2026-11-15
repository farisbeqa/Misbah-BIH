'use client'

import { useTranslations } from 'next-intl'
import { CalendarHeart } from 'lucide-react'
import Link, { usePathname } from '@/i18n/navigation'

// Small "Pozovite nas" button in the bottom-right corner of every page. It sits
// above the page instead of in the navbar, so the existing layout stays as is.
export default function PozoviteNasButton() {
  const t = useTranslations('nav')
  const pathname = usePathname()
  if (pathname.startsWith('/admin') || pathname.startsWith('/pozovite-nas') || pathname.startsWith('/app')) return null

  return (
    <Link href="/pozovite-nas" aria-label={t('inviteUsLabel')}
      className="fixed bottom-4 end-4 sm:bottom-6 sm:end-6 z-40 flex items-center gap-2 bg-[#8b1e3f] text-white ps-3.5 pe-4 py-3 text-sm sm:text-base shadow-[0_8px_24px_rgba(20,17,16,0.25)] hover:bg-[#7a1a37] transition-colors">
      <CalendarHeart size={18} />
      {t('inviteUs')}
    </Link>
  )
}
