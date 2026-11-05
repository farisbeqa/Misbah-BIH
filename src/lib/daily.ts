import type { DailyPost } from '@prisma/client'
import { parseVideoUrl } from '@/lib/videoUtils'

// "Dnevne poruke": short daily posts the mobile app turns into notifications.
// Seven rubrics, one per weekday; app users can switch each rubric off.
// The app keeps its own copy of this list (src/lib/daily.ts in Misbah-EDU-App).

export const DAILY_RUBRICS = [
  { key: 'hadis', name: 'Hadis i komentar hadisa', short: 'Hadis dana', weekday: 1, hint: 'Odabrani hadis Poslanika, a. s., s kratkim komentarom i poukom za svakodnevni život.' },
  { key: 'kuran', name: "Kur'anska poslastica", short: "Kur'anska poslastica", weekday: 2, hint: "Zalogaj Kur'anske sofre za dušu: kratko promišljanje o odabranom ajetu." },
  { key: 'izazov', name: 'Duhovni izazov', short: 'Duhovni izazov', weekday: 3, hint: 'Prijedlog dobrog djela, ibadeta ili lijepe osobine za danas, uz ajet ili hadis.' },
  { key: 'fikh', name: 'Fikhsko pravilo – Da li ste znali?', short: 'Da li ste znali?', weekday: 4, hint: 'Kratko pojašnjenje fikhskog propisa ili akaidskog pitanja iz svakodnevnog života.' },
  { key: 'preporuka', name: 'Misbah preporučuje', short: 'Misbah preporučuje', weekday: 5, hint: 'Predavanje, tekst ili podcast s platforme koji vrijedi pogledati, pročitati ili poslušati.' },
  { key: 'kviz', name: 'Kviz dana', short: 'Kviz dana', weekday: 6, hint: 'Tri do pet pitanja iz islamskog znanja, s pojašnjenjem tačnog odgovora.' },
  { key: 'enciklopedija', name: 'Islamska enciklopedija', short: 'Islamska enciklopedija', weekday: 7, hint: 'Priče o ashabima, učenjacima, znamenitim ličnostima i događajima iz islamske historije.' },
] as const

export type DailyRubric = (typeof DAILY_RUBRICS)[number]['key']

export const WEEKDAYS = ['', 'Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak', 'Subota', 'Nedjelja']

export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export interface QuizQuestion {
  q: string
  options: string[]
  answer: number
  explanation?: string
}

export function rubricOf(key: string) {
  return DAILY_RUBRICS.find(r => r.key === key)
}

/** Today in Sarajevo as YYYY-MM-DD */
export function todayKey(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Sarajevo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now)
}

export function addDays(key: string, days: number): string {
  const d = new Date(`${key}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

/** 1 = Monday … 7 = Sunday */
export function weekdayOf(key: string): number {
  const d = new Date(`${key}T12:00:00Z`).getUTCDay()
  return d === 0 ? 7 : d
}

export function parseQuiz(raw: string | null): QuizQuestion[] | null {
  if (!raw) return null
  try {
    const quiz = JSON.parse(raw)
    return Array.isArray(quiz) ? quiz : null
  } catch {
    return null
  }
}

/** Validated quiz questions, or an error message for the admin form */
export function cleanQuiz(input: unknown): QuizQuestion[] | string {
  if (!Array.isArray(input) || input.length === 0) return 'Kviz mora imati barem jedno pitanje'
  if (input.length > 10) return 'Kviz može imati najviše 10 pitanja'
  const out: QuizQuestion[] = []
  for (let i = 0; i < input.length; i++) {
    const raw = input[i]
    const q = typeof raw?.q === 'string' ? raw.q.trim() : ''
    const options: string[] = Array.isArray(raw?.options)
      ? raw.options.map((o: unknown) => (typeof o === 'string' ? o.trim() : '')).filter(Boolean)
      : []
    const answer = Number(raw?.answer)
    if (!q) return `Pitanje ${i + 1}: unesite tekst pitanja`
    if (options.length < 2) return `Pitanje ${i + 1}: potrebna su barem dva odgovora`
    if (!Number.isInteger(answer) || answer < 0 || answer >= options.length) return `Pitanje ${i + 1}: označite tačan odgovor`
    const explanation = typeof raw?.explanation === 'string' ? raw.explanation.trim() : ''
    out.push({ q, options, answer, ...(explanation ? { explanation } : {}) })
  }
  return out
}

type DailyInput = Omit<DailyPost, 'id' | 'createdAt' | 'updatedAt'>

/** Reads and validates the admin form body */
export function readDailyInput(body: Record<string, unknown>): { data: DailyInput } | { error: string } {
  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
  const rubric = str(body.rubric)
  const date = str(body.date)
  const title = str(body.title)
  if (!rubricOf(rubric)) return { error: 'Izaberite rubriku' }
  if (!DATE_RE.test(date)) return { error: 'Izaberite datum' }
  if (!title) return { error: 'Naslov je obavezan' }
  if (title.length > 120) return { error: 'Naslov može imati najviše 120 znakova' }
  const teaser = str(body.teaser)
  if (teaser.length > 180) return { error: 'Tekst obavijesti može imati najviše 180 znakova' }

  let quiz: string | null = null
  if (rubric === 'kviz') {
    const cleaned = cleanQuiz(body.quiz)
    if (typeof cleaned === 'string') return { error: cleaned }
    quiz = JSON.stringify(cleaned)
  }

  return {
    data: {
      rubric,
      date,
      title,
      teaser: teaser || null,
      body: str(body.body),
      source: str(body.source) || null,
      videoUrl: str(body.videoUrl) || null,
      link: str(body.link) || null,
      quiz,
      published: body.published !== false,
    },
  }
}

/** Video embed info for the app's player (same as /api/videos) */
function videoFor(url: string | null) {
  if (!url) return null
  const info = parseVideoUrl(url)
  if (info.platform !== 'unknown')
    return { url, platform: info.platform, embedUrl: info.embedUrl, isShortForm: info.isShortForm, thumbnailUrl: info.thumbnailUrl }
  // Uploaded clip (R2): usually filmed on a phone, so shown in portrait
  if (/^https?:\/\//.test(url) || url.startsWith('/')) return { url, platform: 'upload', embedUrl: url, isShortForm: true, thumbnailUrl: null }
  return null
}

/** Shape returned by /api/dnevno */
export function serializeDailyPost(p: DailyPost) {
  return {
    id: p.id,
    rubric: p.rubric,
    date: p.date,
    title: p.title,
    teaser: p.teaser,
    body: p.body,
    source: p.source,
    link: p.link,
    quiz: parseQuiz(p.quiz),
    video: videoFor(p.videoUrl),
  }
}
