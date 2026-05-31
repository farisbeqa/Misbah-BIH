import Link from 'next/link'
import { Play, Youtube, Instagram, Facebook, Film } from 'lucide-react'

const TikTokIcon = ({ size = 13 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: size, height: size }}>
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.25 8.25 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z" />
  </svg>
)

const PLATFORM: Record<string, {
  label: string
  Icon: React.FC<{ size?: number }>
  gradient: string
  badgeBg: string
  badgeText: string
}> = {
  youtube:   { label: 'YouTube',   Icon: ({ size=13 }) => <Youtube size={size} />,   gradient: 'linear-gradient(135deg,#7f1d1d,#450a0a)',  badgeBg: '#dc2626', badgeText: '#fff' },
  instagram: { label: 'Instagram', Icon: ({ size=13 }) => <Instagram size={size} />, gradient: 'linear-gradient(135deg,#6b21a8,#831843)',  badgeBg: 'transparent', badgeText: '#fff' },
  tiktok:    { label: 'TikTok',    Icon: TikTokIcon,                                  gradient: 'linear-gradient(135deg,#1c1917,#0c0a09)',  badgeBg: '#1c1917', badgeText: '#fff' },
  facebook:  { label: 'Facebook',  Icon: ({ size=13 }) => <Facebook size={size} />,  gradient: 'linear-gradient(135deg,#1e40af,#1e3a8a)',  badgeBg: '#2563eb', badgeText: '#fff' },
  upload:    { label: 'Upload',    Icon: ({ size=13 }) => <Film size={size} />,        gradient: 'linear-gradient(135deg,#374151,#111827)',  badgeBg: '#374151', badgeText: '#fff' },
}

interface VideoCardProps {
  id: number
  title: string
  description?: string | null
  platform: string
  thumbnailUrl?: string | null
  isShortForm: boolean
  createdAt: string | Date
}

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec']
function formatDate(d: string | Date) {
  const dt = new Date(d)
  return `${dt.getDate()}. ${MONTHS[dt.getMonth()]} ${dt.getFullYear()}.`
}

export default function VideoCard({ id, title, description, platform, thumbnailUrl, isShortForm, createdAt }: VideoCardProps) {
  const meta = PLATFORM[platform] ?? {
    label: platform,
    Icon: () => <Play size={13} />,
    gradient: 'linear-gradient(135deg,#5A4F49,#3F3733)',
    badgeBg: '#5A4F49',
    badgeText: '#fff',
  }
  const isPortrait = isShortForm || platform === 'tiktok'

  return (
    <Link href={`/videos/${id}`} className="group block h-full">
      <article
        className="h-full flex flex-col shadow-card group-hover:shadow-card-hover group-hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
        style={{ background: '#FAF7F2', border: '1px solid #E8E1DB', borderRadius: 8 }}
      >
        {/* Image - full bleed, no padding */}
        <div className="flex-shrink-0">
          <div className="overflow-hidden relative" style={{
            borderRadius: '8px 8px 0 0',
            aspectRatio: '16/9',
          }}>
            {thumbnailUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"
                style={{ background: meta.gradient }}>
                <meta.Icon size={36} />
              </div>
            )}

            {/* Hover play */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/18 transition-colors flex items-center justify-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/90 shadow opacity-0 group-hover:opacity-100 transition-opacity">
                <Play size={16} className="text-warm-900 ml-0.5" fill="currentColor" />
              </div>
            </div>

            {/* Platform badge */}
            <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold"
              style={{
                background: platform === 'instagram' ? 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)' : meta.badgeBg,
                color: meta.badgeText,
                borderRadius: 4,
              }}>
              <meta.Icon size={9} /> {meta.label}
            </span>

            {isPortrait && (
              <span className="absolute top-2 right-2 text-[9px] font-medium px-1.5 py-0.5 text-white bg-black/55"
                style={{ borderRadius: 3 }}>
                Kratki
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pt-3 pb-4 flex flex-col overflow-hidden">
          <time className="font-mono text-[11px] block mb-1.5 tracking-wide flex-shrink-0" style={{ color: '#A94A61' }}>
            {formatDate(createdAt)}
          </time>
          <h3 className="font-bold text-sm leading-snug group-hover:text-brand transition-colors mb-1.5 line-clamp-2 flex-shrink-0"
            style={{ color: '#241F1D' }}>
            {title}
          </h3>
          {description && (
            /* 3 lines max - never grows the card */
            <p className="text-xs leading-relaxed line-clamp-3 overflow-hidden"
              style={{ color: '#978A81' }}>
              {description}
            </p>
          )}
        </div>
      </article>
    </Link>
  )
}
