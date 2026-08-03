import Link from 'next/link'

interface TeamMember {
  image: string
  tag: string
  name: string
  bio: string
  slug?: string
}

const AUTORI: TeamMember[] = [
  { image: '/tim/hamdo-solo.jpg',          tag: "Kur'anske nauke i kiraeti", name: 'Hamdo Solo',          bio: "Kur'an, kiraeti i duhovni razvoj.",                      slug: 'hamdo-solo' },
  { image: '/tim/mubina-suljic-solo.jpg',  tag: 'Fikh i savremena pitanja', name: 'Mubina Suljić Solo',  bio: 'Ibadet, šerijatsko pravo i savremena pitanja muslimana.', slug: 'mubina-suljic-solo' },
  { image: '/tim/hamza-bajraktarevic.jpg', tag: 'Sira i islamska etika',    name: 'Hamza Bajraktarević', bio: 'Sira Poslanika ﷺ, islamska etika i životne lekcije.',    slug: 'hamza-bajraktarevic' },
  { image: '/tim/esma-klisura.jpg',       tag: 'Odgoj i obrazovanje',         name: 'Esma Klisura',       bio: 'Odgoj, obrazovanje i savremeni izazovi mladih.',                            slug: 'esma-klisura' },
  { image: '/tim/muhamed-selimovic.jpg',  tag: "Kur'anske nauke i hifz",      name: 'Muhamed Selimović',  bio: 'Hafiz, pobjednik državnog takmičenja u hifzu. Aktivan u Misbahu od 2022.',  slug: 'muhamed-selimovic' },
  { image: '/tim/muhamed-tutnic.jpg',     tag: 'Islamske nauke',              name: 'Muhamed Tutnić',     bio: 'Student Fakulteta islamskih nauka u Sarajevu. Govorništvo, javni nastup i izgradnja mira.', slug: 'muhamed-tutnic' },
  { image: '/tim/ervin-sorlija.jpg',      tag: 'Edukativni sadržaj',          name: 'Ervin Sorlija',      bio: 'Autor edukativnog sadržaja na platformi Misbah EDU.' },
  { image: '/tim/adna-kurtanovic.jpg',    tag: 'Videografija i digitalni dizajn', name: 'Adna Kurtanović', bio: 'Kreatorica video i vizuelnog sadržaja Misbah EDU od 2022. Studentica orijentalne filologije, dobitnica III mjesta na Smotri naučno-tehničkog stvaralaštva BiH.', slug: 'adna-kurtanovic' },
  { image: '/tim/abdullah-hodzic.jpg',    tag: 'Društvene mreže i multimedija', name: 'Abdullah Hodžić',  bio: 'Grafički dizajn, video i animacija. Freelance novinar i kreator digitalnog sadržaja Deutsche Wellea.', slug: 'abdullah-hodzic' },
]

function MemberCard({ m }: { m: TeamMember }) {
  const inner = (
    <>
      <div className="relative w-full overflow-hidden shrink-0" style={{ height: 340 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt={m.name} src={m.image}
          className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="bg-[#f5f2ef] flex flex-col gap-3 p-4 flex-1">
        <p className="font-medium text-[#8b1e3f] text-xs uppercase tracking-wide">{m.tag}</p>
        <p className="font-medium text-[#241f1d] group-hover:text-[#8b1e3f] transition-colors"
          style={{ fontSize: 20, lineHeight: 1.12, letterSpacing: '-0.6px' }}>
          {m.name}
        </p>
        <p className="font-normal text-[#5a4f49] text-base leading-normal">{m.bio}</p>
      </div>
    </>
  )

  return m.slug
    ? (
      <Link href={`/o-nama/tim/${m.slug}`} className="group flex flex-col overflow-hidden">
        {inner}
      </Link>
    )
    : (
      <div className="group flex flex-col overflow-hidden">
        {inner}
      </div>
    )
}

export default function GlasoviSection() {
  return (
    <div>
      <p className="font-semibold text-sm mb-6" style={{ color: '#8b1e3f' }}>
        Autori edukativnog sadržaja
      </p>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {AUTORI.map(m => (
          <MemberCard key={m.name} m={m} />
        ))}
      </div>
    </div>
  )
}
