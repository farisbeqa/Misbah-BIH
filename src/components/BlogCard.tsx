'use client'
import Link from 'next/link'

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec']
function formatDate(d: string | Date) {
  const dt = new Date(d)
  return `${dt.getDate()}. ${MONTHS[dt.getMonth()]} ${dt.getFullYear()}.`
}

const CAT_LABELS: Record<string, string> = {
  hutbe:          'Hutbe',
  'aktuelne-teme': 'Aktuelne teme',
  duhovnost:      'Duhovnost',
  'tefsir-kuran': "Tefsir i Kur'an",
  sira:           'Sira',
  fikh:           'Fikh',
  savjeti:        'Savjeti',
  odgoj:          'Odgoj i porodica',
}

interface BlogCardProps {
  id: number
  title: string
  content: string
  author?: string | null
  imageUrl?: string | null
  category?: string | null
  createdAt: string | Date
}

export default function BlogCard({ id, title, content, author, imageUrl, category, createdAt }: BlogCardProps) {
  return (
    <Link href={`/blog/${id}`} className="group block h-full">
      <div className="bg-[#f5f2ef] overflow-hidden border border-black/5 flex flex-col h-full">
        <div className="relative h-[228px] w-full shrink-0 overflow-hidden">
          {imageUrl
            ? <img alt={title} src={imageUrl} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
            : <div className="absolute inset-0 bg-[#e0d8d0]" />
          }
          {category && CAT_LABELS[category] && (
            <div className="absolute top-4 left-4 bg-[#faf5f5] px-2.5 py-1.5">
              <span className="text-[#8b1e3f] uppercase" style={{ fontSize: 10, letterSpacing: '0.3px' }}>
                {CAT_LABELS[category]}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2.5 px-6 py-7 flex-1">
          <p className="font-medium text-[#8b1e3f] text-xs uppercase tracking-wide">{formatDate(createdAt)}</p>
          <p className="font-medium text-[#241f1d] leading-[1.12] line-clamp-2 group-hover:text-[#8b1e3f] transition-colors"
            style={{ fontSize: 20, letterSpacing: '-0.6px' }}>
            {title}
          </p>
          {author && (
            <p className="font-normal text-[#5a4f49] text-base leading-normal">{author}</p>
          )}
          <p className="font-normal text-[#5a4f49] text-base leading-normal line-clamp-3 mt-auto">
            {content.replace(/\n+/g, ' ').trim()}
          </p>
        </div>
      </div>
    </Link>
  )
}
