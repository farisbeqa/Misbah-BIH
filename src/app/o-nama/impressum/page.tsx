import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = { title: 'Impressum — Misbah EDU' }

const UREDNICI = ['Hamdo Solo', 'Mubina Suljić Solo', 'Hamza Bajraktarević', 'Esma Klisura']
const DRUSTVENE_MREZE = ['Adna Kurtanović', 'Abdulah Hodžić', 'Edin Imamović']

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
            <ul className="space-y-2">
              {UREDNICI.map(name => (
                <li key={name} className="flex items-center gap-2.5 text-sm text-warm-800">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                    style={{ background: '#8B1E3F' }}>
                    {name[0]}
                  </div>
                  {name}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-5 rounded-2xl" style={{ background: '#FAF7F2', border: '1px solid #E8E1DB' }}>
            <p className="font-mono text-[11px] uppercase tracking-widest mb-3" style={{ color: '#A94A61' }}>Društvene mreže</p>
            <ul className="space-y-2">
              {DRUSTVENE_MREZE.map(name => (
                <li key={name} className="flex items-center gap-2.5 text-sm text-warm-800">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                    style={{ background: '#C8A96B' }}>
                    {name[0]}
                  </div>
                  {name}
                </li>
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
