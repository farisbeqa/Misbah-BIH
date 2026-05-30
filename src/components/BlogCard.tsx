'use client'
import Link from 'next/link'
import { FileText, ArrowRight } from 'lucide-react'

interface BlogCardProps {
  id: number
  title: string
  content: string
  imageUrl?: string | null
  createdAt: string | Date
}

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec']
function formatDate(d: string | Date) {
  const dt = new Date(d)
  return `${dt.getDate()}. ${MONTHS[dt.getMonth()]} ${dt.getFullYear()}.`
}

export default function BlogCard({ id, title, content, imageUrl, createdAt }: BlogCardProps) {
  return (
    <Link href={`/blog/${id}`} className="group block h-full">
      <article
        className="h-full flex flex-col shadow-card group-hover:shadow-card-hover group-hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
        style={{ background: '#FAF7F2', border: '1px solid #E8E1DB', borderRadius: 8 }}
      >
        {/* Cover — 8px padding, 4px inner radius */}
        <div className="p-2 flex-shrink-0">
          <div className="overflow-hidden" style={{ borderRadius: 4, height: 168 }}>
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt={title} className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
            ) : (
              <div className="w-full h-full flex items-center justify-center"
                style={{ background: '#E8E1DB' }}>
                <FileText size={36} style={{ color: '#CDB8A6' }} />
              </div>
            )}
          </div>
        </div>

        {/* Content — strict bounds */}
        <div className="px-4 pb-4 flex flex-col overflow-hidden">
          <time className="font-mono text-[11px] block mb-1.5 tracking-wide flex-shrink-0" style={{ color: '#A94A61' }}>
            {formatDate(createdAt)}
          </time>

          <h3 className="font-bold text-[15px] leading-snug group-hover:text-brand transition-colors mb-2 line-clamp-2 flex-shrink-0"
            style={{ color: '#241F1D' }}>
            {title}
          </h3>

          {/* Body excerpt — 3 lines max */}
          <p className="text-sm leading-relaxed line-clamp-3 overflow-hidden"
            style={{ color: '#978A81' }}>
            {content.replace(/\n+/g, ' ').trim()}
          </p>

          <div className="flex items-center gap-1 text-sm font-semibold mt-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
            style={{ color: '#8B1E3F' }}>
            Čitaj više <ArrowRight size={13} />
          </div>
        </div>
      </article>
    </Link>
  )
}
