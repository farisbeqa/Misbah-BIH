// Basic filter for user comments (web and mobile app). App Store rules require
// apps with user-generated content to filter objectionable material; reported
// comments are removed by an admin at /admin/komentari.

const FOLD: Record<string, string> = { č: 'c', ć: 'c', š: 's', ž: 'z', đ: 'dj' }

// Word stems (diacritics folded). Kept to unambiguous vulgarities and slurs.
const BLOCKED = [
  /jeb/, // jebem, jebo, jebote, zajeb...
  /pick[aeiou]/, // picka, picke...
  /pizd/,
  /kurac|kurc|kurcin/,
  /\bgovn/,
  /\bsran/,
  /kurv/,
  /\bdrolj/,
  /\bpeder/,
  /mater ti|majku ti|mamu ti/,
  /\bfuck|\bshit\b|\bbitch|\bcunt|\bwhore|\bnigg|\bfaggot/,
]

export function normalizeForFilter(text: string): string {
  return text
    .toLowerCase()
    .replace(/[čćšžđ]/g, ch => FOLD[ch] ?? ch)
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
}

export function containsProfanity(text: string): boolean {
  const n = normalizeForFilter(text)
  return BLOCKED.some(re => re.test(n))
}

export const PROFANITY_ERROR = 'Komentar sadrži neprimjeren sadržaj. Molimo vas da pišete s poštovanjem.'
