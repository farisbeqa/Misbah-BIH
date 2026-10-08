import Link from 'next/link'
import { getAllAuthors } from '@/lib/authorContent'
import { BIOS } from '@/lib/bios'

export const revalidate = 60
export const metadata = {
  title: 'Autori',
  description: 'Svi autori predavanja, hutbi i tekstova na platformi Misbah EDU.',
  alternates: { canonical: '/autori' },
}

export default async function AutoriPage() {
  const authors = await getAllAuthors().catch(() => [])

  return (
    <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20 py-12 sm:py-16">
      <div className="mb-12">
        <p className="font-medium text-[#8b1e3f] text-base mb-2">AUTORI</p>
        <h1 className="font-semibold text-[#141110] mb-3"
          style={{ fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.3, letterSpacing: '-0.44px' }}>
          Autori sadržaja
        </h1>
        <p className="font-normal text-[#746860]" style={{ fontSize: 18 }}>
          Odaberite autora i pogledajte sva njegova predavanja, hutbe i tekstove na jednom mjestu.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {authors.map(a => {
          const photo = a.bioSlug ? BIOS[a.bioSlug]?.photo : undefined
          return (
            <Link key={a.slug} href={`/autori/${a.slug}`}
              className="group flex items-center gap-4 p-4 bg-[#f5f2ef] border border-black/5 hover:border-[#8b1e3f]/40 transition-colors">
              {photo
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={photo} alt={a.name} className="w-14 h-14 rounded-full object-cover object-top flex-shrink-0" />
                : <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0" style={{ background: '#8B1E3F' }}>
                    {a.name.replace(/\b(hfz|ef)\.?\s*/gi, '').trim()[0]?.toUpperCase()}
                  </div>
              }
              <div className="min-w-0">
                <p className="font-semibold text-[#241f1d] truncate group-hover:text-[#8b1e3f] transition-colors">{a.name}</p>
                <p className="text-sm text-[#746860]">{a.count} {a.count === 1 ? 'objava' : a.count < 5 ? 'objave' : 'objava'}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
