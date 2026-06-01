import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { BIOS } from '@/lib/bios'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const bio = BIOS[params.slug]
  if (!bio) return { title: 'Misbah EDU' }
  return { title: `${bio.name} - Misbah EDU` }
}

export default function TimBioPage({ params }: { params: { slug: string } }) {
  const bio = BIOS[params.slug]
  if (!bio) notFound()

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Link href="/o-nama/impressum"
        className="inline-flex items-center gap-2 text-warm-400 hover:text-warm-700 text-sm mb-8 transition-colors font-mono">
        <ArrowLeft size={14} /> Impressum
      </Link>

      {/* Header card */}
      <div className="flex flex-col sm:flex-row gap-6 items-start mb-10 p-6 rounded-2xl"
        style={{ background: '#FAF7F2', border: '1px solid #E8E1DB' }}>
        {bio.photo && (
          <div className="w-28 h-28 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={bio.photo} alt={bio.name} className="w-full h-full object-cover object-top" />
          </div>
        )}
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest mb-1" style={{ color: '#A94A61' }}>
            {bio.role}
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-warm-900 tracking-tight mb-2">{bio.name}</h1>
          {bio.born && (
            <p className="text-sm text-warm-500">
              <span className="font-medium">Datum i mjesto rođenja:</span> {bio.born}
            </p>
          )}
        </div>
      </div>

      {/* Bio sections */}
      <div className="space-y-6">
        {bio.sections.map(section => (
          <section key={section.title} className="p-6 rounded-2xl"
            style={{ background: '#FAF7F2', border: '1px solid #E8E1DB' }}>
            <h2 className="font-bold text-warm-900 mb-4 text-base">{section.title}</h2>
            <ul className="space-y-2.5">
              {section.items.map((item, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-warm-700 leading-relaxed">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#8B1E3F' }} />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="font-mono text-xs text-warm-300 mt-10 text-center">
        © {new Date().getFullYear()} Misbah EDU
      </p>
    </div>
  )
}
