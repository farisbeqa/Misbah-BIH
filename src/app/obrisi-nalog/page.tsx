import Link from 'next/link'
import DeleteAccountForm from './DeleteAccountForm'

export const metadata = {
  title: 'Brisanje naloga',
  description: 'Trajno brisanje korisničkog naloga na Misbah EDU (web stranica i mobilna aplikacija).',
  alternates: { canonical: '/obrisi-nalog' },
}

export default function ObrisiNalogPage() {
  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <p className="font-mono text-[11px] text-brand-light uppercase tracking-widest mb-2">Nalog</p>
      <h1 className="text-3xl font-extrabold text-warm-900 tracking-tight mb-4">Brisanje naloga</h1>
      <div className="space-y-3 text-warm-600 leading-relaxed mb-8">
        <p>
          Ovdje možete trajno obrisati svoj Misbah EDU nalog — isti nalog koristi se na web stranici i u mobilnoj aplikaciji. Brisanjem se
          trajno uklanjaju <b>korisničko ime, lozinka, svi vaši komentari i lajkovi</b>. Ova radnja se ne može poništiti.
        </p>
        <p>
          U mobilnoj aplikaciji nalog možete obrisati i u meniju <b>Više → Obriši nalog</b>. Podaci sačuvani samo na telefonu (sačuvani
          sadržaj, postavke) brišu se deinstalacijom aplikacije.
        </p>
      </div>

      <DeleteAccountForm />

      <p className="text-sm text-warm-500 mt-8">
        Ne možete se prijaviti? Pišite nam na{' '}
        <a href="mailto:misbah.bosna@gmail.com?subject=Brisanje%20naloga" className="text-brand hover:underline">misbah.bosna@gmail.com</a>{' '}
        s korisničkim imenom i nalog ćemo obrisati u roku od 7 dana. Više o podacima u{' '}
        <Link href="/privatnost" className="text-brand hover:underline">Politici privatnosti</Link>.
      </p>
    </div>
  )
}
