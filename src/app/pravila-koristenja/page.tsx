import Link from 'next/link'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'Pravila korištenja',
  description: 'Pravila korištenja web stranice i mobilne aplikacije Misbah EDU, uključujući pravila za komentare.',
  alternates: { canonical: '/pravila-koristenja' },
}

const UPDATED = '28. oktobar 2026.'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="font-bold text-warm-900 text-lg mb-3">{title}</h2>
      <div className="space-y-3 text-warm-600 leading-relaxed">{children}</div>
    </section>
  )
}

export default function PravilaPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <p className="font-mono text-[11px] text-brand-light uppercase tracking-widest mb-2">Pravne informacije</p>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-warm-900 tracking-tight mb-3">Pravila korištenja</h1>
      <p className="text-warm-500 text-sm mb-10">Posljednja izmjena: {UPDATED}</p>

      <Section title="Prihvatanje pravila">
        <p>
          Korištenjem web stranice misbah-edu.com i mobilne aplikacije Misbah EDU prihvatate ova pravila. Registracijom naloga potvrđujete
          da ste ih pročitali i da ih prihvatate.
        </p>
      </Section>

      <Section title="Korisnički nalog">
        <p>
          Nalog je potreban samo za lajkove i komentare. Odgovorni ste za čuvanje svoje lozinke i za sav sadržaj objavljen s vašeg naloga.
          Nije dozvoljeno lažno se predstavljati kao druga osoba.
        </p>
      </Section>

      <Section title="Komentari — nulta tolerancija za neprimjeren sadržaj">
        <p>
          Misbah EDU je prostor za korisno znanje i lijepu riječ. <b>Ne tolerišemo neprimjeren sadržaj ni uvredljivo ponašanje.</b> Zabranjeno
          je objavljivati:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>psovke, uvrede, ponižavanje i vrijeđanje drugih korisnika, autora ili gostiju;</li>
          <li>govor mržnje, prijetnje, uznemiravanje ili pozivanje na nasilje;</li>
          <li>pornografski, nasilan ili na drugi način neprimjeren sadržaj;</li>
          <li>reklame, spam i lažne informacije;</li>
          <li>tuđe lične podatke i sadržaj koji krši autorska prava.</li>
        </ul>
        <p>
          Komentari prolaze automatski filter, a redakcija ih dodatno pregleda. Sadržaj koji krši pravila uklanjamo bez najave, a nalog
          korisnika koji ih krši trajno brišemo.
        </p>
      </Section>

      <Section title="Prijava i blokiranje">
        <p>
          Svaki komentar u aplikaciji možete prijaviti (dugme „Prijavi“ uz komentar) ili nam pisati na{' '}
          <a href="mailto:misbah.bosna@gmail.com" className="text-brand hover:underline">misbah.bosna@gmail.com</a>. Prijave pregledamo i
          neprimjeren sadržaj uklanjamo u roku od 24 sata. Korisnika čije komentare ne želite vidjeti možete blokirati — njegovi komentari se
          tada više ne prikazuju na vašem uređaju.
        </p>
      </Section>

      <Section title="Autorska prava">
        <p>
          Svi tekstovi, fotografije, audio i video sadržaji objavljeni na platformi Misbah EDU zaštićeni su autorskim pravima. Preuzimanje,
          umnožavanje ili korištenje sadržaja dozvoljeno je isključivo uz prethodnu saglasnost redakcije i navođenje izvora.
        </p>
      </Section>

      <Section title="Odricanje odgovornosti">
        <p>
          Stavovi gostiju izneseni u emisijama predstavljaju njihove lične stavove i ne moraju nužno odražavati stavove redakcije. Vremena
          namaza preuzimaju se sa servisa vaktija.ba i služe kao informacija.
        </p>
      </Section>

      <Section title="Brisanje naloga">
        <p>
          Nalog možete u svakom trenutku obrisati u aplikaciji (Više → Obriši nalog) ili na stranici{' '}
          <Link href="/obrisi-nalog" className="text-brand hover:underline">misbah-edu.com/obrisi-nalog</Link>. Detalji o podacima su u{' '}
          <Link href="/privatnost" className="text-brand hover:underline">Politici privatnosti</Link>.
        </p>
      </Section>

      <Section title="Kontakt i izmjene">
        <p>
          Pravila možemo povremeno izmijeniti; datum posljednje izmjene naveden je na vrhu stranice. Za pitanja pišite na{' '}
          <a href="mailto:misbah.bosna@gmail.com" className="text-brand hover:underline">misbah.bosna@gmail.com</a>.
        </p>
      </Section>
    </div>
  )
}
