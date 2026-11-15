import { useTranslations } from 'next-intl'
import { Languages } from 'lucide-react'

/**
 * Small note under translated database content ("This content was translated
 * automatically from Bosnian"). Render it when the localized row has
 * `translated: true`; it shows nothing otherwise.
 */
export default function MachineTranslationNote({ show, className = '' }: { show?: boolean; className?: string }) {
  const t = useTranslations('common')
  if (!show) return null
  return (
    <p className={`flex items-center gap-1.5 text-xs text-[#978a81] ${className}`}>
      <Languages size={13} className="shrink-0" />
      {t('machineTranslated')}
    </p>
  )
}
