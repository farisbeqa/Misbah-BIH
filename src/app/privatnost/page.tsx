import Link from 'next/link'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'Politika privatnosti',
  description: 'Kako Misbah EDU (web stranica i mobilna aplikacija) prikuplja, koristi i štiti vaše podatke.',
  alternates: { canonical: '/privatnost' },
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

export default function PrivatnostPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <p className="font-mono text-[11px] text-brand-light uppercase tracking-widest mb-2">Pravne informacije</p>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-warm-900 tracking-tight mb-3">Politika privatnosti</h1>
      <p className="text-warm-500 text-sm mb-10">Posljednja izmjena: {UPDATED}</p>

      <Section title="O ovoj politici">
        <p>
          Ova politika objašnjava koje podatke prikupljaju web stranica <b>misbah-edu.com</b> i mobilna aplikacija <b>Misbah EDU</b>
          (iOS i Android), zašto ih prikupljamo i kako ih možete obrisati. Za sva pitanja pišite nam na{' '}
          <a href="mailto:misbah.bosna@gmail.com" className="text-brand hover:underline">misbah.bosna@gmail.com</a>.
        </p>
        <p>Sadržaj platforme možete čitati, gledati i slušati bez registracije. Nalog je potreban samo za lajkove i komentare.</p>
      </Section>

      <Section title="Podaci koje prikupljamo">
        <p>
          <b>Korisnički nalog (neobavezno):</b> korisničko ime, lozinka i datum registracije. Lozinku nikad ne čuvamo u izvornom obliku
          — pohranjuje se samo njen kriptografski sažetak (hash).
        </p>
        <p>
          <b>Sadržaj koji objavite:</b> komentari i lajkovi, povezani s vašim korisničkim imenom. Komentari su javno vidljivi drugim
          korisnicima.
        </p>
        <p>
          <b>Tehnički podaci:</b> server na kojem je platforma smještena (Vercel) automatski bilježi standardne tehničke zapise (npr. IP
          adresu i vrstu preglednika) radi sigurnosti i rada usluge. Ove zapise ne koristimo za praćenje korisnika.
        </p>
      </Section>

      <Section title="Podaci koji ostaju samo na vašem uređaju (mobilna aplikacija)">
        <p>
          Sačuvani sadržaj, veličina teksta, izabrani grad za vaktiju, nedavne pretrage i privremeno pohranjen sadržaj za rad bez
          interneta čuvaju se isključivo na vašem telefonu i ne šalju se nama. Podaci za prijavu čuvaju se u zaštićenoj memoriji uređaja.
        </p>
        <p>
          Podsjetnici za namaz su lokalne obavijesti koje zakazuje sam telefon. Aplikacija ne koristi vašu lokaciju — grad birate ručno.
        </p>
      </Section>

      <Section title="Šta ne radimo">
        <p>Ne prikazujemo reklame, ne koristimo alate za praćenje ni analitiku i ne prodajemo niti dijelimo vaše podatke s oglašivačima.</p>
      </Section>

      <Section title="Usluge trećih strana">
        <p>
          Video sadržaji se prikazuju putem platformi YouTube, TikTok, Instagram i Facebook. Kada pustite takav video, primjenjuju se
          pravila privatnosti te platforme. Vremena namaza preuzimaju se sa servisa vaktija.ba (šalje se samo izabrani grad). Platforma
          koristi usluge Vercel (smještaj stranice), Turso (baza podataka) i Cloudflare (pohrana slika, zvuka i videa).
        </p>
      </Section>

      <Section title="Koliko dugo čuvamo podatke">
        <p>
          Podatke naloga čuvamo dok nalog postoji. Kada obrišete nalog, trajno se brišu korisničko ime, lozinka, svi vaši komentari i
          lajkovi.
        </p>
      </Section>

      <Section title="Vaša prava i brisanje naloga">
        <p>
          Imate pravo zatražiti uvid u svoje podatke, njihovu ispravku ili brisanje. Nalog možete obrisati sami u aplikaciji (Više → Obriši
          nalog) ili na stranici{' '}
          <Link href="/obrisi-nalog" className="text-brand hover:underline">misbah-edu.com/obrisi-nalog</Link>. Ako se ne možete prijaviti,
          pišite nam na email s korisničkim imenom.
        </p>
      </Section>

      <Section title="Djeca">
        <p>
          Sadržaj platforme je edukativan i namijenjen svim uzrastima. Ne prikupljamo svjesno podatke djece mlađe od 13 godina bez
          saglasnosti roditelja; ako saznamo za takav nalog, obrisat ćemo ga.
        </p>
      </Section>

      <Section title="Izmjene">
        <p>
          Ovu politiku možemo povremeno ažurirati. Datum posljednje izmjene uvijek je naveden na vrhu stranice. Pogledajte i{' '}
          <Link href="/pravila-koristenja" className="text-brand hover:underline">Pravila korištenja</Link>.
        </p>
      </Section>
    </div>
  )
}
