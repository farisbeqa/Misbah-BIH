import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <p className="font-mono text-[11px] text-brand-light uppercase tracking-widest mb-4">Greška 404</p>
      <h1 className="text-4xl font-extrabold text-warm-900 tracking-tight mb-3">Stranica nije pronađena</h1>
      <p className="text-warm-500 text-sm mb-10 max-w-sm">Ova stranica ne postoji ili je uklonjena.</p>
      <Link href="/"
        className="inline-flex items-center gap-2 text-sm font-semibold text-white px-6 py-3 transition-colors"
        style={{ background: '#8B1E3F', borderRadius: 8 }}>
        <ArrowLeft size={15} /> Nazad na početnu
      </Link>
    </div>
  )
}
