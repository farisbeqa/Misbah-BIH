import bsBios from '../../messages/bs/bios.json'
import { bioKey } from './bios'

// Team data shared by the homepage ("Glasovi koji inspirišu"), the Impressum
// and the mobile app (/api/tim). Biographies live in bios.ts. The texts of the
// homepage cards (tag, short bio) live in messages/<locale>/bios.json under
// people.<key>.card; the homepage reads them in the visitor's language:
//   const team = teamFor((await getTranslations('bios')).raw('people'))

export interface TeamMember {
  image: string
  tag: string
  name: string
  bio: string
  slug?: string
}

/** Texts of one homepage card in one language (messages/<locale>/bios.json → people.<key>.card) */
export interface TeamCardTexts {
  tag: string
  bio: string
}

const MEMBERS: { image: string; name: string; slug: string }[] = [
  { image: '/tim/hamdo-solo.jpg',          name: 'Hamdo Solo',          slug: 'hamdo-solo' },
  { image: '/tim/mubina-suljic-solo.jpg',  name: 'Mubina Suljić Solo',  slug: 'mubina-suljic-solo' },
  { image: '/tim/hamza-bajraktarevic.jpg', name: 'Hamza Bajraktarević', slug: 'hamza-bajraktarevic' },
  // Esma Klisura privremeno uklonjena — odkomentarisati ako se vrati
  // { image: '/tim/esma-klisura.jpg',     name: 'Esma Klisura',        slug: 'esma-klisura' },
  { image: '/tim/muhamed-selimovic.jpg',   name: 'Muhamed Selimović',   slug: 'muhamed-selimovic' },
  { image: '/tim/muhamed-tutnic.jpg',      name: 'Muhamed Tutnić',      slug: 'muhamed-tutnic' },
  { image: '/tim/ervin-sorlija.jpg',       name: 'Ervin Šorlija',       slug: 'ervin-sorlija' },
  { image: '/tim/elmir-honsic.jpg',        name: 'Elmir Honsić',        slug: 'elmir-honsic' },
  { image: '/tim/adna-kurtanovic.jpg',     name: 'Adna Kurtanović',     slug: 'adna-kurtanovic' },
  { image: '/tim/abdullah-hodzic.jpg',     name: 'Abdullah Hodžić',     slug: 'abdullah-hodzic' },
]

/** Homepage cards with the texts of one language */
export function teamFor(people: Record<string, { card?: TeamCardTexts }>): TeamMember[] {
  return MEMBERS.map(({ image, name, slug }) => {
    const card = people[bioKey(slug)]?.card
    return { image, tag: card?.tag ?? '', name, bio: card?.bio ?? '', slug }
  })
}

/** Homepage cards in Bosnian (also served to the mobile app by /api/tim) */
export const TEAM: TeamMember[] = teamFor(bsBios.people)

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
