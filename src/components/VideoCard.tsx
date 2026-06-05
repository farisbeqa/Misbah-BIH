import Link from 'next/link'

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec']
function formatDate(d: string | Date) {
  const dt = new Date(d)
  return `${dt.getDate()}. ${MONTHS[dt.getMonth()]} ${dt.getFullYear()}.`
}

interface VideoCardProps {
  id: number
  title: string
  description?: string | null
  author?: string | null
  platform: string
  thumbnailUrl?: string | null
  isShortForm: boolean
  createdAt: string | Date
}

export default function VideoCard({ id, title, description, author, platform, thumbnailUrl, isShortForm, createdAt }: VideoCardProps) {
  return (
    <Link href={`/videos/${id}`} className="group block h-full">
      <div className="bg-[#f5f2ef] overflow-hidden border border-black/5 flex flex-col h-full">
        {/* Thumbnail */}
        <div className="relative h-[228px] w-full shrink-0 overflow-hidden">
          {thumbnailUrl
            ? <img alt={title} src={thumbnailUrl} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            : <div className="absolute inset-0 bg-[#e0d8d0] flex items-center justify-center">
                <span className="text-[#a89888] text-4xl">▶</span>
              </div>
          }
          {/* Platform pill */}
          <div className="absolute top-4 left-4 bg-[#faf5f5] px-2.5 py-1.5">
            <span className="text-[#8b1e3f] uppercase" style={{ fontSize: 10, letterSpacing: '0.3px' }}>
              {platform}
            </span>
          </div>
          {isShortForm && (
            <div className="absolute top-4 right-4 bg-black/50 px-2 py-0.5">
              <span className="text-white text-[9px] uppercase tracking-wide">Kratki</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2.5 px-6 py-7 flex-1">
          <p className="font-medium text-[#8b1e3f] text-xs uppercase tracking-wide">{formatDate(createdAt)}</p>
          <p className="font-medium text-[#241f1d] leading-[1.12] line-clamp-2 group-hover:text-[#8b1e3f] transition-colors"
            style={{ fontSize: 20, letterSpacing: '-0.6px' }}>
            {title}
          </p>
          {author && (
            <p className="font-normal text-[#5a4f49] text-base leading-normal">{author}</p>
          )}
          {!author && description && (
            <p className="font-normal text-[#5a4f49] text-base leading-normal line-clamp-2">{description}</p>
          )}
        </div>
      </div>
    </Link>
  )
}
