import { createHash } from 'node:crypto'

// What gets translated in the database, shared by the website (reading
// translations, queueing new ones) and the translator worker (lambda/translator).
// Plain module: no Prisma, no Next.js imports.

export type EntitySpec = {
  /** Postgres table */
  table: string
  /** Bosnian source columns that are translated */
  fields: readonly string[]
  /**
   * Translated fields shown under a different name, keeping the original
   * visible: ilahije keep their original lyrics and show the translated
   * meaning below them.
   */
  rename?: Readonly<Record<string, string>>
  /** Extra instructions for the translator */
  notes?: string
}

export const ENTITIES = {
  video: {
    table: 'Video',
    fields: ['title', 'description'],
    notes: 'Title and description of a video (lecture, Qur\'an recitation, podcast, ilahija or zikr) on the Misbah EDU website. The video itself stays in Bosnian.',
  },
  blog: {
    table: 'BlogPost',
    fields: ['title', 'content'],
    notes: 'Blog article or Friday sermon (hutba). Keep paragraphs and line breaks; keep Markdown formatting if present.',
  },
  activity: {
    table: 'Activity',
    fields: ['title', 'content'],
    notes: 'News item about an activity of the Misbah youth community (džemat Carina, Sarajevo).',
  },
  quote: {
    table: 'Quote',
    fields: ['text', 'source'],
    notes: 'Short quote shown as "thought of the day": a Qur\'an verse (ajet), a hadith or a saying. `source` is its reference, e.g. "Kur\'an, 13:11" or "Buhari".',
  },
  gallery: {
    table: 'GalleryImage',
    fields: ['title', 'description'],
    notes: 'Caption of a photo in the gallery.',
  },
  ilahija: {
    table: 'IlahijaText',
    fields: ['title', 'content'],
    rename: { content: 'meaning' },
    notes: 'Lyrics of an ilahija (Bosnian Islamic hymn). The original lyrics stay on the page; your translation of `content` is shown below them as the meaning, so translate the meaning faithfully line by line, keeping the stanza structure. Keep words like "Allah", "illallah", "Jarabbi" and refrain markers ("Refren (2x)") recognisable. Some ilahije are in Turkish or Arabic: translate their meaning into the target language as well (this overrides the rule about copying non-Bosnian text); only lyrics already in the target language are copied unchanged.',
  },
  dua: {
    table: 'DuaText',
    fields: ['title', 'content'],
    notes: 'A dua (supplication). It usually contains the Arabic text, a transliteration in Latin letters and the Bosnian meaning. Copy Arabic-script text and transliteration lines exactly as they are; translate only the Bosnian parts (meaning, explanations, labels such as "Prijevod:").',
  },
  mekteb: {
    table: 'MektebPost',
    fields: ['title', 'content'],
    notes: 'Post for Mekteb EDU (Islamic education for children).',
  },
  zikr: {
    table: 'ZikrText',
    fields: ['title', 'content'],
    notes: 'A zikr (remembrance of Allah). Copy Arabic-script text and transliteration lines exactly; translate only the Bosnian parts (meaning, instructions like "uči se 3 puta", labels such as "Prijevod:").',
  },
  prica: {
    table: 'Prica',
    fields: ['title', 'content'],
    notes: 'Instructive story (poučna priča) with an Islamic moral.',
  },
} as const satisfies Record<string, EntitySpec>

export type Entity = keyof typeof ENTITIES
export const ENTITY_NAMES = Object.keys(ENTITIES) as Entity[]

export function isEntity(value: unknown): value is Entity {
  return typeof value === 'string' && value in ENTITIES
}

/** The translatable part of a row, in a stable shape (null/empty fields left out) */
export function sourceFields(entity: Entity, row: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {}
  for (const f of ENTITIES[entity].fields) {
    const v = row[f]
    if (typeof v === 'string' && v.trim() !== '') out[f] = v
  }
  return out
}

/** Fingerprint of the Bosnian source; a translation is outdated when it no longer matches */
export function sourceHash(fields: Record<string, string>): string {
  return createHash('sha256').update(JSON.stringify(fields)).digest('hex').slice(0, 32)
}
