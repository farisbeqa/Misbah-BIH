// Team data shared by the homepage ("Glasovi koji inspirišu"), the Impressum
// and the mobile app (/api/tim). Biographies live in bios.ts.

export interface TeamMember {
  image: string
  tag: string
  name: string
  bio: string
  slug?: string
}

export const TEAM: TeamMember[] = [
  { image: '/tim/hamdo-solo.jpg',          tag: "Kur'anske nauke i kiraeti", name: 'Hamdo Solo',          bio: "Kur'an, kiraeti i duhovni razvoj.",                      slug: 'hamdo-solo' },
  { image: '/tim/mubina-suljic-solo.jpg',  tag: 'Fikh i savremena pitanja', name: 'Mubina Suljić Solo',  bio: 'Ibadet, šerijatsko pravo i savremena pitanja muslimana.', slug: 'mubina-suljic-solo' },
  { image: '/tim/hamza-bajraktarevic.jpg', tag: 'Sira i islamska etika',    name: 'Hamza Bajraktarević', bio: 'Sira Poslanika ﷺ, islamska etika i životne lekcije.',    slug: 'hamza-bajraktarevic' },
  // Esma Klisura privremeno uklonjena — odkomentarisati ako se vrati
  // { image: '/tim/esma-klisura.jpg',       tag: 'Odgoj i obrazovanje',         name: 'Esma Klisura',       bio: 'Odgoj, obrazovanje i savremeni izazovi mladih.',                            slug: 'esma-klisura' },
  { image: '/tim/muhamed-selimovic.jpg',  tag: "Kur'anske nauke i hifz",      name: 'Muhamed Selimović',  bio: 'Hafiz, pobjednik državnog takmičenja u hifzu. Aktivan u Misbahu od 2022.',  slug: 'muhamed-selimovic' },
  { image: '/tim/muhamed-tutnic.jpg',     tag: 'Islamske nauke',              name: 'Muhamed Tutnić',     bio: 'Student Fakulteta islamskih nauka u Sarajevu. Govorništvo, javni nastup i izgradnja mira.', slug: 'muhamed-tutnic' },
  { image: '/tim/ervin-sorlija.jpg',      tag: "Hadis i Kur'anske nauke",    name: 'Ervin Šorlija', bio: 'Imam u džematu Vöcklabruck (Austrija). Najbolji student generacije FIN-a 2024., magistrant iz oblasti hadisa.', slug: 'ervin-sorlija' },
  { image: '/tim/elmir-honsic.jpg',       tag: "Kur'an i islamske nauke",     name: 'Elmir Honsić',       bio: 'Student Fakulteta islamskih nauka u Sarajevu. Predvodio teraviju i učio mukabelu u Ferhadiji za Ramazan 2026.', slug: 'elmir-honsic' },
  { image: '/tim/adna-kurtanovic.jpg',    tag: 'Videografija i digitalni dizajn', name: 'Adna Kurtanović', bio: 'Kreatorica video i vizuelnog sadržaja Misbah EDU od 2022. Studentica orijentalne filologije, dobitnica III mjesta na Smotri naučno-tehničkog stvaralaštva BiH.', slug: 'adna-kurtanovic' },
  { image: '/tim/abdullah-hodzic.jpg',    tag: 'Društvene mreže i multimedija', name: 'Abdullah Hodžić',  bio: 'Grafički dizajn, video i animacija. Freelance novinar i kreator digitalnog sadržaja Deutsche Wellea.', slug: 'abdullah-hodzic' },
]

export interface ImpressumMember {
  name: string
  slug?: string
  photo?: string
}

export const UREDNICI: ImpressumMember[] = [
  { name: 'Hamdo Solo', slug: 'hamdo-solo' },
]

export const DRUSTVENE_MREZE: ImpressumMember[] = [
  { name: 'Abdullah Hodžić', slug: 'abdullah-hodzic' },
]

export const AUTORI: ImpressumMember[] = [
  { name: 'Mubina Suljić Solo', slug: 'mubina-suljic-solo' },
  { name: 'Hamza Bajraktarević', slug: 'hamza-bajraktarevic' },
  // { name: 'Esma Klisura',    slug: 'esma-klisura' }, // privremeno uklonjena
  { name: 'Muhamed Selimović',  slug: 'muhamed-selimovic' },
  { name: 'Muhamed Tutnić',     slug: 'muhamed-tutnic' },
  { name: 'Ervin Šorlija', slug: 'ervin-sorlija' },
  { name: 'Elmir Honsić',       slug: 'elmir-honsic' },
  { name: 'Adna Kurtanović',    slug: 'adna-kurtanovic' },
]
