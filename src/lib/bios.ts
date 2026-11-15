import bsBios from '../../messages/bs/bios.json'

// Biographies of the team (/o-nama/tim/[slug]), also used by the Impressum,
// the author pages and the mobile app (/api/tim). Names and photos live here;
// the texts (role, date and place of birth, sections) live in
// messages/<locale>/bios.json under people.<key> (key: bioKey(slug)).
// Website pages read them in the visitor's language:
//   const bios = biosFor((await getTranslations('bios')).raw('people'))

export interface BioSection {
  title: string
  items: string[]
}

export interface Bio {
  name: string
  role: string
  photo?: string
  born?: string
  sections: BioSection[]
}

/** Texts of one biography in one language (messages/<locale>/bios.json → people.<key>) */
export interface BioTexts {
  role: string
  born?: string
  sections: BioSection[]
}

const PEOPLE: { slug: string; name: string; photo?: string }[] = [
  // Esma Klisura privremeno uklonjena sa stranice (oktobar 2026) — odkomentarisati ako se vrati
  // (njeni tekstovi su ostali u messages/bs/bios.json → people.esmaKlisura)
  // { slug: 'esma-klisura',        name: 'Esma Klisura',        photo: '/tim/esma-klisura.jpg' },
  { slug: 'hamza-bajraktarevic', name: 'Hamza Bajraktarević', photo: '/tim/hamza-bajraktarevic.jpg' },
  { slug: 'mubina-suljic-solo',  name: 'Mubina Suljić Solo',  photo: '/tim/mubina-suljic-solo.jpg' },
  { slug: 'muhamed-selimovic',   name: 'Muhamed Selimović',   photo: '/tim/muhamed-selimovic.jpg' },
  { slug: 'adna-kurtanovic',     name: 'Adna Kurtanović',     photo: '/tim/adna-kurtanovic.jpg' },
  { slug: 'ervin-sorlija',       name: 'Ervin Šorlija',       photo: '/tim/ervin-sorlija.jpg' },
  { slug: 'muhamed-tutnic',      name: 'Muhamed Tutnić',      photo: '/tim/muhamed-tutnic.jpg' },
  { slug: 'elmir-honsic',        name: 'Elmir Honsić',        photo: '/tim/elmir-honsic.jpg' },
  { slug: 'abdullah-hodzic',     name: 'Abdullah Hodžić',     photo: '/tim/abdullah-hodzic.jpg' },
  { slug: 'hamdo-solo',          name: 'Hamdo Solo',          photo: '/tim/hamdo-solo.jpg' },
]

/** Key of a person in the messages: "hamza-bajraktarevic" → "hamzaBajraktarevic" */
export function bioKey(slug: string): string {
  return slug.replace(/-(\w)/g, (_, c: string) => c.toUpperCase())
}

/** All biographies with the texts of one language, keyed by slug (same shape as BIOS) */
export function biosFor(people: Record<string, BioTexts>): Record<string, Bio> {
  const bios: Record<string, Bio> = {}
  for (const { slug, name, photo } of PEOPLE) {
    const texts = people[bioKey(slug)]
    if (!texts) continue
    bios[slug] = {
      name,
      role: texts.role,
      ...(photo ? { photo } : {}),
      ...(texts.born ? { born: texts.born } : {}),
      sections: texts.sections,
    }
  }
  return bios
}

/** Biographies in Bosnian (API for the mobile app, photos, names) */
export const BIOS: Record<string, Bio> = biosFor(bsBios.people)
