import Link from 'next/link'
import { ArrowLeft, Mail, Phone } from 'lucide-react'

export const metadata = { title: 'Kontakt - Misbah EDU' }

// ── Ažurirajte kontakt podatke ovdje ──────────────────────────────────────
const KONTAKT = {
  email: 'misbah.bosna@gmail.com',
  telefon: '', // ← unesite broj telefona, npr. '+387 61 000 000'
}
// ─────────────────────────────────────────────────────────────────────────

export default function KontaktPage() {
  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Link href="/o-nama"
        className="inline-flex items-center gap-2 text-warm-400 hover:text-warm-700 text-sm mb-8 transition-colors font-mono">
        <ArrowLeft size={14} /> O Nama
      </Link>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-warm-900 tracking-tight mb-3">Kontakt</h1>
      <p className="text-warm-500 text-sm mb-10">Slobodno nas kontaktirajte za sve upite, sugestije i saradnju.</p>

      <div className="space-y-4">
        {/* Email */}
        <a href={`mailto:${KONTAKT.email}`}
          className="flex items-center gap-4 p-5 rounded-2xl transition-all hover:-translate-y-0.5 group"
          style={{ background: '#FAF7F2', border: '1px solid #E8E1DB' }}>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: '#8B1E3F' }}>
            <Mail size={20} className="text-white" />
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-warm-400 mb-0.5">Email</p>
            <p className="font-semibold text-warm-900 group-hover:text-brand transition-colors">{KONTAKT.email}</p>
          </div>
        </a>

        {/* Phone */}
        {KONTAKT.telefon && (
          <a href={`tel:${KONTAKT.telefon.replace(/\s/g, '')}`}
            className="flex items-center gap-4 p-5 rounded-2xl transition-all hover:-translate-y-0.5 group"
            style={{ background: '#FAF7F2', border: '1px solid #E8E1DB' }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: '#8B1E3F' }}>
              <Phone size={20} className="text-white" />
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-warm-400 mb-0.5">Telefon</p>
              <p className="font-semibold text-warm-900 group-hover:text-brand transition-colors">{KONTAKT.telefon}</p>
            </div>
          </a>
        )}
      </div>

      <div className="mt-10 p-5 rounded-2xl text-sm text-warm-600" style={{ background: '#FAF7F2', border: '1px solid #E8E1DB' }}>
        <p className="font-bold text-warm-800 mb-2">Saradnja i autorski tekstovi</p>
        <p>
          Misbah EDU je otvoren prostor za sve autore koji žele objaviti tekstove s islamskim ili edukativnim sadržajem.
          Javite nam se putem emaila i rado ćemo vam odgovoriti.
        </p>
      </div>
    </div>
  )
}
