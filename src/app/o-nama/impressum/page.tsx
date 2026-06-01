import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { BIOS } from '@/lib/bios'

export const metadata = { title: 'Impressum - Misbah EDU' }

const UREDNICI: { name: string; slug?: string }[] = [
  { name: 'Hamdo Solo',          slug: 'hamdo-solo' },
  { name: 'Mubina Suljić Solo' },
  { name: 'Hamza Bajraktarević', slug: 'hamza-bajraktarevic' },
  { name: 'Esma Klisura',        slug: 'esma-klisura' },
]

const DRUSTVENE_MREZE: { name: string; slug?: string }[] = [
  { name: 'Adna Kurtanović' },
  { name: 'Abdulah Hodžić' },
  { name: 'Edin Imamović' },
]

function MemberCard({ name, slug, accent }: { name: string; slug?: string; accent: string }) {
  const bio = slug ? BIOS[slug] : undefined
  return (
    <li className="flex items-center gap-3 py-2">
      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 shadow-sm">
        {bio?.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={bio.photo} alt={name} className="w-full h-full object-cover object-top" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: accent }}>
            {name[0]}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-warm-900 truncate">{name}</p>
      </div>
      {slug && (
        <Link href={`/o-nama/tim/${slug}`}
          className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors hover:opacity-80 flex-shrink-0"
          style={{ background: '#F5EDE8', color: '#8B1E3F' }}>
          Biografija <ExternalLink size={10} />
        </Link>
      )}
    </li>
  )
}

export default function ImpressumPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Link href="/o-nama"
        className="inline-flex items-center gap-2 text-warm-400 hover:text-warm-700 text-sm mb-8 transition-colors font-mono">
        <ArrowLeft size={14} /> O Nama
      </Link>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-warm-900 tracking-tight mb-10">Impressum</h1>

      {/* About */}
      <section className="mb-10 p-6 rounded-2xl" style={{ background: '#FAF7F2', border: '1px solid #E8E1DB' }}>
        <h2 className="font-bold text-warm-900 mb-4">O platformi</h2>
        <div className="space-y-3 text-sm text-warm-700 leading-relaxed">
          <p>
            Medijska platforma Misbah EDU pokrenuta je kao projekat omladine džemata na Carini Vratnik.
            Povezujući vjeru i prave vrijednosti posvećena je pričama koje inspirišu i imaju edukativni karakter.
            Kroz predavanja, podcaste i intervjue nastojimo utkati prave vrijednosti u društvo.
          </p>
          <p>
            Platformu otvaramo i nudimo kao prostor za objavljivanje tekstova svim zainteresovanim autorima.
          </p>
        </div>
      </section>

      {/* Team */}
      <section className="mb-10">
        <h2 className="font-bold text-warm-900 mb-5 text-lg">Uredništvo</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="p-5 rounded-2xl" style={{ background: '#FAF7F2', border: '1px solid #E8E1DB' }}>
            <p className="font-mono text-[11px] uppercase tracking-widest mb-3" style={{ color: '#A94A61' }}>Urednici</p>
            <ul className="divide-y divide-[#EDE5DB]">
              {UREDNICI.map(m => (
                <MemberCard key={m.name} name={m.name} slug={m.slug} accent="#8B1E3F" />
              ))}
            </ul>
          </div>
          <div className="p-5 rounded-2xl" style={{ background: '#FAF7F2', border: '1px solid #E8E1DB' }}>
            <p className="font-mono text-[11px] uppercase tracking-widest mb-3" style={{ color: '#A94A61' }}>Društvene mreže</p>
            <ul className="divide-y divide-[#EDE5DB]">
              {DRUSTVENE_MREZE.map(m => (
                <MemberCard key={m.name} name={m.name} slug={m.slug} accent="#C8A96B" />
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Copyright */}
      <section className="p-6 rounded-2xl" style={{ background: '#FAF7F2', border: '1px solid #E8E1DB' }}>
        <h2 className="font-bold text-warm-900 mb-4">Autorska prava</h2>
        <div className="space-y-3 text-sm text-warm-600 leading-relaxed">
          <p>
            Svi tekstovi, fotografije, audio i video sadržaji objavljeni na platformi Misbah EDU zaštićeni su
            autorskim pravima. Preuzimanje, umnožavanje ili korištenje sadržaja dozvoljeno je isključivo uz
            prethodnu saglasnost redakcije i navođenje izvora.
          </p>
          <p>
            Redakcija zadržava pravo uređivanja i uklanjanja sadržaja koji nije u skladu s misijom i
            vrijednostima platforme.
          </p>
          <p>
            Stavovi gostiju izneseni u emisijama predstavljaju njihove lične stavove i ne moraju nužno
            odražavati stavove redakcije Misbah EDU.
          </p>
        </div>
      </section>

      <p className="font-mono text-xs text-warm-300 mt-8 text-center">
        © {new Date().getFullYear()} Strossa d.o.o. · Misbah EDU
      </p>
    </div>
  )
}
