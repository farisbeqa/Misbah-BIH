import Link from 'next/link'
import { FileText, Mail, Users, ArrowRight } from 'lucide-react'

export const metadata = { title: 'O Nama - Misbah EDU' }

export default function ONamaPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <div className="mb-12">
        <p className="font-mono text-[11px] text-brand-light uppercase tracking-widest mb-2">Platforma</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-warm-900 tracking-tight mb-4">O Nama</h1>
        <p className="text-warm-500 leading-relaxed">
          Medijska platforma Misbah EDU predstavlja inicijativu mladih ljudi usmjerenu ka doprinosu Zajednici kroz edukativni i korisni sadržaj.
          Povezujući vjeru i prave vrijednosti, posvećena je pričama koje inspirišu i imaju edukativni karakter.
        </p>
        <br />
        <p className="text-warm-500 leading-relaxed">
          Trenutno se u okviru platforme Misbah EDU održavaju tri redovne edukativne halke:
        </p>
        <ul className="mt-4 space-y-4 text-warm-500 leading-relaxed list-none">
          <li>
            <span className="font-semibold text-warm-900">Halka tefsira</span> održava se svakog četvrtka u džematu Carina, sahat vremena prije akšam-namaza. Predavanja vodi hfz. Hamdo Solo, koji kroz tumačenje kur&apos;anskih ajeta nastoji približiti njihovo značenje i poruke svakodnevnom životu.
          </li>
          <li>
            <span className="font-semibold text-warm-900">Halka sire</span> održava se svakog ponedjeljka nakon akšam-namaza u džematu Bjelave. Ovu halku vodi Hamza ef. Bajraktarević, obrađujući život i praksu Allahovog Poslanika, s posebnim naglaskom na pouke koje se mogu primijeniti danas.
          </li>
          <li>
            <span className="font-semibold text-warm-900">Halka hadisa</span> također se održava svakog ponedjeljka nakon akšam-namaza u džematu Bakareva džamija. Halku vodi Zeko ef. Hasanović, fokusirajući se na razumijevanje i primjenu hadisa u svakodnevnom životu.
          </li>
        </ul>
        <p className="text-warm-500 leading-relaxed mt-4">
          Sve halke su otvorene za sve zainteresovane, s ciljem jačanja znanja, duhovnosti i zajedništva.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { href: '/o-nama/impressum', icon: <FileText size={22} />, title: 'Impressum', desc: 'Urednici, autori i pravne napomene' },
          { href: '/o-nama/kontakt',   icon: <Mail size={22} />,     title: 'Kontakt',   desc: 'Email i kontakt informacije' },
        ].map(card => (
          <Link key={card.href} href={card.href}
            className="group flex items-center gap-4 p-5 rounded-2xl transition-all hover:-translate-y-0.5"
            style={{ background: '#FAF7F2', border: '1px solid #E8E1DB' }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: '#8B1E3F', color: 'white' }}>
              {card.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-warm-900">{card.title}</p>
              <p className="text-sm text-warm-500 mt-0.5">{card.desc}</p>
            </div>
            <ArrowRight size={16} className="text-warm-300 group-hover:text-brand transition-colors flex-shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  )
}
