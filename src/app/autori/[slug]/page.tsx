import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { getAuthorPage } from '@/lib/authorContent'
import { BIOS } from '@/lib/bios'

export const revalidate = 60

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec']
function formatDate(d: Date) {
  return `${d.getDate()}. ${MONTHS[d.getMonth()]} ${d.getFullYear()}.`
}

async function load(slug: string) {
  try { return await getAuthorPage(slug) } catch { return null }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = await load(params.slug)
  if (!data) return { title: 'Autor' }
  return {
    title: `${data.author.name} – sav sadržaj`,
    description: `Predavanja, hutbe, tekstovi i ostali sadržaj autora ${data.author.name} na platformi Misbah EDU.`,
    alternates: { canonical: `/autori/${params.slug}` },
  }
}

export default async function AutorPage({ params }: { params: { slug: string } }) {
  const data = await load(params.slug)
  if (!data) notFound()

  const { author, sections, total } = data
  const bio = author.bioSlug ? BIOS[author.bioSlug] : undefined

  return (
    <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20 py-10 sm:py-14">
      <Link href="/autori"
        className="inline-flex items-center gap-2 text-warm-400 hover:text-warm-700 text-sm mb-8 transition-colors font-mono">
        <ArrowLeft size={14} /> Svi autori
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-7 mb-10">
        {bio?.photo
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={bio.photo} alt={author.name} className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover object-top flex-shrink-0 shadow-sm" />
          : <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl flex items-center justify-center text-white text-3xl font-bold flex-shrink-0" style={{ background: '#8B1E3F' }}>
              {author.name.replace(/\b(hfz|ef)\.?\s*/gi, '').trim()[0]?.toUpperCase()}
            </div>
        }
        <div>
          <p className="font-medium text-[#8b1e3f] text-base mb-1 uppercase">Autor</p>
          <h1 className="font-semibold text-[#141110] mb-2"
            style={{ fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.2, letterSpacing: '-0.44px' }}>
            {author.name}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[#746860]">
            {bio && <span>{bio.role}</span>}
            <span>{total} {total === 1 ? 'objava' : total < 5 ? 'objave' : 'objava'}</span>
            {author.bioSlug && bio && (
              <Link href={`/o-nama/tim/${author.bioSlug}`}
                className="inline-flex items-center gap-1 font-medium hover:underline" style={{ color: '#8B1E3F' }}>
                Biografija <ArrowRight size={14} />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Section jump links */}
      {sections.length > 1 && (
        <nav className="flex flex-wrap gap-2 mb-12">
          {sections.map(s => (
            <a key={s.key} href={`#${s.key}`}
              className="px-3.5 py-2 text-sm border border-[#e3d9cf] bg-white hover:border-[#8b1e3f] hover:text-[#8b1e3f] transition-colors"
              style={{ color: '#5a4f49' }}>
              {s.title} <span className="text-[#a89888]">({s.items.length})</span>
            </a>
          ))}
        </nav>
      )}

      {/* Sections, newest first inside each */}
      <div className="space-y-14">
        {sections.map(s => (
          <section key={s.key} id={s.key} className="scroll-mt-28">
            <h2 className="font-semibold text-[#141110] mb-6 flex items-baseline gap-3" style={{ fontSize: 26, letterSpacing: '-0.4px' }}>
              {s.title}
              <span className="font-mono text-sm font-normal text-[#a89888]">{s.items.length}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {s.items.map(item => (
                <Link key={item.key} href={item.href} className="group block h-full">
                  <div className="bg-[#f5f2ef] overflow-hidden border border-black/5 flex flex-col h-full">
                    {item.image !== undefined && (
                      <div className="relative h-[180px] w-full shrink-0 overflow-hidden bg-[#e0d8d0]">
                        {item.image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img alt={item.title} src={item.image} loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        )}
                        <div className="absolute top-3 left-3 bg-[#faf5f5] px-2.5 py-1.5">
                          <span className="text-[#8b1e3f] uppercase" style={{ fontSize: 10, letterSpacing: '0.3px' }}>{item.label}</span>
                        </div>
                      </div>
                    )}
                    <div className="flex flex-col gap-2 px-5 py-5 flex-1">
                      <p className="font-medium text-[#8b1e3f] text-xs uppercase tracking-wide">
                        {item.image === undefined && <>{item.label} · </>}{formatDate(item.date)}
                      </p>
                      <p className="font-medium text-[#241f1d] leading-[1.2] line-clamp-3 group-hover:text-[#8b1e3f] transition-colors"
                        style={{ fontSize: 18, letterSpacing: '-0.4px' }}>
                        {item.title}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
