import Link from 'next/link'
import { FileText, Mail, Users, ArrowRight } from 'lucide-react'

export const metadata = { title: 'O Nama — Misbah EDU' }

export default function ONamaPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <div className="mb-12">
        <p className="font-mono text-[11px] text-brand-light uppercase tracking-widest mb-2">Platforma</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-warm-900 tracking-tight mb-4">O Nama</h1>
        <p className="text-warm-500 leading-relaxed">
          Medijska platforma Misbah EDU pokrenuta je kao projekat omladine džemata na Carini Vratnik.
          Povezujući vjeru i prave vrijednosti, posvećena je pričama koje inspirišu i imaju edukativni karakter.
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
