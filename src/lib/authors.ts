// Resolves the free-text `author` field (and, as a fallback, the title) of any
// content item to one or more canonical authors, so that "hfz. Hamdo Solo",
// "Hamdo ef. Solo" and "Hamdo" all lead to the same /autori/hamdo-solo page.

export interface AuthorRef {
  slug: string
  name: string
  bioSlug?: string
}

interface KnownAuthor extends AuthorRef {
  // Normalized phrases that identify this author inside the `author` field
  authorMatch: string[]
  // Stricter phrases (full names) used when the author is only in the title
  titleMatch: string[]
}

// Team members and frequent guests. Anyone not listed here still gets a page,
// keyed by their normalized name.
const KNOWN_AUTHORS: KnownAuthor[] = [
  { slug: 'hamdo-solo',          name: 'hfz. Hamdo Solo',            bioSlug: 'hamdo-solo',          authorMatch: ['hamdo'],                                     titleMatch: ['hamdo solo'] },
  { slug: 'muhamed-selimovic',   name: 'hfz. Muhamed Selimović',     bioSlug: 'muhamed-selimovic',   authorMatch: ['selimovic', 'muhamef selimovic'],            titleMatch: ['muhamed selimovic'] },
  { slug: 'hamza-bajraktarevic', name: 'Hamza ef. Bajraktarević',    bioSlug: 'hamza-bajraktarevic', authorMatch: ['bajraktarevic', 'bajraktevic'],              titleMatch: ['hamza bajraktarevic'] },
  { slug: 'mubina-suljic-solo',  name: 'Mubina Suljić Solo',         bioSlug: 'mubina-suljic-solo',  authorMatch: ['mubina'],                                    titleMatch: ['mubina suljic'] },
  { slug: 'muhamed-tutnic',      name: 'Muhamed ef. Tutnić',         bioSlug: 'muhamed-tutnic',      authorMatch: ['tutnic'],                                    titleMatch: ['muhamed tutnic'] },
  { slug: 'elmir-honsic',        name: 'Elmir ef. Honsić',           bioSlug: 'elmir-honsic',        authorMatch: ['honsic'],                                    titleMatch: ['elmir honsic'] },
  { slug: 'ervin-sorlija',       name: 'hfz. Ervin Šorlija',         bioSlug: 'ervin-sorlija',       authorMatch: ['sorlija'],                                   titleMatch: ['ervin sorlija'] },
  { slug: 'zeko-hasanovic',      name: 'Zeko ef. Hasanović',                                         authorMatch: ['zeko hasanovic'],                            titleMatch: ['zeko hasanovic'] },
]

// Values that are sometimes put in the author field but are not people
const NOT_AUTHORS = new Set(['hadis', 'ajet', 'kuran', 'nepoznato', 'nepoznat autor'])

// Honorifics stripped before matching ("hfz.", "ef.", "prof. dr." ...)
const TITLES = /\b(hfz|hafiz|hafiza|ef|efendija|prof|dr|mr|doc|mag)\b\.?/g

export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/đ/g, 'dj')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ʿ|’|'/g, '')
    .replace(TITLES, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s(k s|r a|rah|a s)\s*$/, '') // trailing "k.s.", "r.a." ...
    .trim()
}

function slugify(normalized: string): string {
  return normalized.replace(/\s+/g, '-')
}

function cleanDisplayName(part: string): string {
  return part.replace(/\s+/g, ' ').trim()
}

/** All authors credited on a content item. */
export function resolveAuthors(author: string | null | undefined, title?: string | null): AuthorRef[] {
  const found = new Map<string, AuthorRef>()
  const add = (a: AuthorRef) => { if (!found.has(a.slug)) found.set(a.slug, a) }

  if (author && author.trim()) {
    // "Zeko Hasanović i Hamdo Solo", "A, B", "A & B"
    for (const part of author.split(/\s+i\s+|,|&|\//)) {
      const n = normalize(part)
      if (!n || NOT_AUTHORS.has(n)) continue
      const known = KNOWN_AUTHORS.find(k => k.authorMatch.some(m => n.includes(m)))
      if (known) add(known)
      else add({ slug: slugify(n), name: cleanDisplayName(part) })
    }
  } else if (title) {
    const n = normalize(title)
    for (const k of KNOWN_AUTHORS) {
      if (k.titleMatch.some(m => n.includes(m))) add(k)
    }
  }

  return Array.from(found.values())
}

export function knownAuthor(slug: string): AuthorRef | undefined {
  return KNOWN_AUTHORS.find(k => k.slug === slug)
}
