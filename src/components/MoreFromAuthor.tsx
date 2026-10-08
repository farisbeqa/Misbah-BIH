import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { resolveAuthors } from '@/lib/authors'
import { BIOS } from '@/lib/bios'

function initials(name: string) {
  const parts = name.replace(/\b(hfz|ef)\.?\s*/gi, '').split(/\s+/).filter(Boolean)
  return parts.length >= 2 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : (parts[0]?.[0] ?? '?').toUpperCase()
}

/** "Vidi više od ovog autora" box shown under any published content item. */
export default function MoreFromAuthor({ author, title, className = '' }: { author?: string | null; title?: string | null; className?: string }) {
  const authors = resolveAuthors(author, title)
  if (authors.length === 0) return null

  return (
    <div className={`space-y-3 ${className}`}>
      {authors.map(a => {
        const photo = a.bioSlug ? BIOS[a.bioSlug]?.photo : undefined
        return (
          <Link key={a.slug} href={`/autori/${a.slug}`}
            className="group flex items-center gap-4 p-4 sm:p-5 transition-colors hover:bg-[#f3ece4]"
            style={{ background: '#FAF7F2', border: '1px solid #E8E1DB', borderRadius: 8 }}>
            {photo
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={photo} alt={a.name} className="w-12 h-12 rounded-full object-cover object-top flex-shrink-0" />
              : <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ background: '#8B1E3F' }}>
                  {initials(a.name)}
                </div>
            }
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[11px] uppercase tracking-widest text-warm-400">Autor</p>
              <p className="font-semibold text-warm-900 truncate">{a.name}</p>
            </div>
            <span className="flex items-center gap-1.5 text-sm font-medium whitespace-nowrap" style={{ color: '#8B1E3F' }}>
              <span className="hidden sm:inline">Vidi više od ovog autora</span>
              <span className="sm:hidden">Vidi više</span>
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        )
      })}
    </div>
  )
}
