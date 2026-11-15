// "Pozovite nas": invite Misbah EDU (lectures, choir, youth gatherings) to a
// džemat, school or community. Content from the original mini-site made for
// Hamdo; the page lives at /pozovite-nas.
//
// This file holds what is the same in every language: URL slugs (never
// translated), images, video files, durations, view counts and contact
// details. The texts (descriptions, roles, bios, video titles, ...) are in
// messages/<locale>/pozovite.json under the same keys, e.g. AUD.muskarci ->
// audiences.muskarci.title, PEOPLE.hamdo -> people.hamdo.bio, a video's `key`
// -> videoTitles.<key>.

/** Videos are served from the media CDN (S3 + CloudFront on AWS), images from /public/pozovite-nas */
export const VIDEO_BASE = process.env.NEXT_PUBLIC_POZOVITE_VIDEO_BASE ?? 'https://d39iz2jyquc1uh.cloudfront.net'
export const IMG = (path: string) => `/pozovite-nas/${path}`
export const VIDEO = (path: string) => `${VIDEO_BASE}/pozovite-nas/${path}`

export const CONTACT = {
  email: 'misbah.bosna@gmail.com',
  phone: '+387 61 991 990',
  phoneDigits: '38761991990',
}

export type Audience = 'muskarci' | 'zene' | 'dzemat'
export type HorKey = 'muski' | 'zenski' | 'mijesani' | 'vecer'

/** Kinds of program in the inquiry form (names: pozovite.form.categories.<key>) */
export const RUBRIKE = ['predavanja', 'hor', 'druzenja'] as const
export type Rubrika = (typeof RUBRIKE)[number]

/** Kinds of lecture program (names and descriptions: pozovite.formats.<key>) */
export const FORMATS = ['predavanje', 'edukacija', 'radionica', 'visednevna'] as const
export type Format = (typeof FORMATS)[number]

// ── The inquiry for the Misbah team ─────────────────────────────────────────
// The message the inquiry form prepares (WhatsApp, Viber, e-mail) is read by
// the Misbah team, so it is always written in Bosnian, whatever the language
// of the page. The texts below go into that message and into the inquiry
// links (?rubrika=…&izbor=…), exactly as before translations existed; the
// page itself shows the translated names from the messages.

export const INVITE_TEMPLATE =
  'Selam alejkum,\n\nželio/željela bih ugostiti Misbah EDU (predavanje, hor ili omladinsko druženje). Možete li mi poslati više informacija o terminima i uslovima?\n\nHvala i selam!'

export const INQUIRY_BS: {
  rubrike: Record<Rubrika, string>
  audiences: Record<Audience, string>
  formats: Record<Format, string>
  hor: Record<HorKey, string>
  druzenje: string
} = {
  rubrike: { predavanja: 'Predavanja', hor: 'Hor', druzenja: 'Omladinska druženja' },
  audiences: { muskarci: 'Za muškarce', zene: 'Za žene', dzemat: 'Za džemat' },
  formats: { predavanje: 'Predavanje', edukacija: 'Edukacija', radionica: 'Radionica', visednevna: 'Višednevna edukacija' },
  hor: { muski: 'Muški hor', zenski: 'Ženski hor', mijesani: 'Miješani hor', vecer: "Večer Kur'ana" },
  druzenje: 'Omladinsko druženje',
}

// ── Lectures ────────────────────────────────────────────────────────────────

/** Audiences (texts: pozovite.audiences.<key>) */
export const AUD: Record<Audience, { img: string }> = {
  muskarci: { img: 'p/hamza.jpg' },
  zene: { img: 'tim/mubina-suljic-solo.jpg' },
  dzemat: { img: 'p/hidzra.jpg' },
}

/** Lecturers offered to men and to the whole džemat (women: Mubina) */
export const MEN = ['hamdo', 'hamza']

/**
 * A video: `reel` and `short` are portrait phone clips, `clip` a landscape
 * clip (all hosted with the page), `yt` a YouTube video. `key`: its title in
 * pozovite.videoTitles; `d`: duration; `v`: views; `src`: the channel or show.
 */
export type Vid =
  | { kind: 'reel' | 'short' | 'clip'; id: string; key: string; d?: string; v?: number; tall?: boolean }
  | { kind: 'yt'; id: string; key: string; d: string; v?: number; src?: string }

/** A lecturer; role, bio and topics are in pozovite.people.<id> */
export interface Person {
  n: string
  img: string
  /** /autori/[slug] on this site */
  author?: string
  vids: Vid[]
}

export const PEOPLE: Record<string, Person> = {
  hamdo: {
    n: 'hfz. Hamdo Solo', img: 'tim/hamdo-solo.jpg', author: 'hamdo-solo',
    vids: [
      { kind: 'reel', id: 'DdRtvWRxkkk', key: 'inshirah', d: '1:15' },
      { kind: 'reel', id: 'DcQ7iiGS_--', key: 'zilzal', d: '0:56' },
      { kind: 'reel', id: 'DbiyGx2Iar9', key: 'nas', d: '0:33' },
      { kind: 'yt', id: 'daQdzhD7CwI', key: 'tin', d: '30:52', v: 77850 },
      { kind: 'yt', id: 'hKoHnSXGAwM', key: 'duha', d: '24:49', v: 10534 },
      { kind: 'yt', id: 'wc849Ricw2E', key: 'adiyat', d: '21:43', v: 1398 },
      { kind: 'yt', id: '50ecLEJfQyk', key: 'prophetInQuran', d: '40:10', v: 435 },
    ],
  },
  hamza: {
    n: 'Hamza ef. Bajraktarević', img: 'tim/hamza-bajraktarevic.jpg', author: 'hamza-bajraktarevic',
    vids: [
      { kind: 'clip', id: 'hamza', key: 'calmInAnxiousTimes', d: '1:24' },
      { kind: 'yt', id: 'DRB-XX9V8QY', key: 'sabrChangesTheHeart', d: '14:14', v: 2370 },
      { kind: 'yt', id: '2_dF6g2zsVA', key: 'blessingOfRememberingTheProphet', d: '21:49', v: 1791 },
      { kind: 'yt', id: 'YAXzsYlSCl0', key: 'trueBeliever', d: '17:52', v: 854 },
      { kind: 'yt', id: '-8ksFYv4K90', key: 'marriageThatChangedHistory', d: '18:09', v: 516 },
    ],
  },
  mubina: {
    n: 'hfz. Mubina Suljić Solo', img: 'tim/mubina-suljic-solo.jpg', author: 'mubina-suljic-solo',
    vids: [
      { kind: 'yt', id: 'vXfi425ptIk', key: 'prophetsMercy', d: '5:19', v: 2007, src: 'islamEDU' },
      { kind: 'yt', id: '0XpC3AVFJ7M', key: 'prophetsEmotionalIntelligence', d: '4:44', v: 1709, src: 'islamEDU' },
      { kind: 'yt', id: 'dKNgKdnp8dE', key: 'isIslamFairToWomen', d: '3:31', v: 2661, src: 'Ramazanske misli' },
      { kind: 'yt', id: '4tKtftVXWzM', key: 'gratitudeThroughPrayer', d: '5:22', v: 1550, src: 'Ramazanske misli' },
      { kind: 'yt', id: 'zgBCuxJLJbY', key: 'easeAfterHardship', d: '7:13', v: 1038, src: 'Ramazanske misli' },
      { kind: 'yt', id: 'rA9Qc6RDMrA', key: 'fastingAndRelationships', d: '10:27', v: 1553, src: 'Hayat' },
    ],
  },
}

// ── Choir ───────────────────────────────────────────────────────────────────

/** Choir programs (texts: pozovite.choir.groups.<key>) */
export const HOR: Record<HorKey, { img: string; vid?: string; vids: Vid[] }> = {
  muski: {
    img: 'p/hor-maljevac.jpg',
    vids: [
      { kind: 'clip', id: 'muski-1627', key: 'ilahijeCollage', d: '7:09' },
      { kind: 'clip', id: 'muski-svicarska', key: 'performanceInSwitzerland', d: '0:38', tall: true },
      { kind: 'clip', id: 'muski-7263', key: 'ilahijaByCandlelight', d: '2:14', tall: true },
      { kind: 'clip', id: 'hor-maljevac', key: 'mosqueOpeningMaljevac', d: '0:56' },
      { kind: 'clip', id: 'zagreb', key: 'youthIftarZagreb', d: '0:55' },
      { kind: 'clip', id: 'hor-zagreb-studio', key: 'youthIftarZagrebStudio', d: '1:00' },
      { kind: 'yt', id: '140o_dege3Q', key: 'fullPerformanceMaljevac', d: '20:41', v: 3696 },
      { kind: 'yt', id: 'PyLxh8jqR7s', key: 'fullPerformanceZagreb', d: '25:39', v: 181 },
    ],
  },
  zenski: {
    img: 'p/mijesani-2.jpg', vid: 'v/mijesani-2.mp4',
    vids: [{ kind: 'clip', id: 'mijesani-2', key: 'ilahijaAtGathering', d: '0:32' }],
  },
  mijesani: {
    img: 'p/mijesani-3.jpg',
    vids: [
      { kind: 'clip', id: 'mijesani-3', key: 'ilahijaInMosque', d: '1:05', tall: true },
      { kind: 'clip', id: 'mijesani-1', key: 'performanceInMosque', d: '0:34', tall: true },
    ],
  },
  vecer: {
    img: 'p/vecer.jpg',
    vids: [
      { kind: 'clip', id: 'vecer-ucenje', key: 'quranRecitation', d: '7:57' },
      { kind: 'clip', id: 'vecer-dorada', key: 'quranRecitationInDzemat', d: '0:35', tall: true },
      { kind: 'clip', id: 'DT3bXE_CAGN', key: 'suraIbrahim', d: '1:46' },
      { kind: 'clip', id: 'DTNmcHXCAL8', key: 'suraFussilat', d: '1:32' },
      { kind: 'clip', id: 'DS7xB71CJmd', key: 'suraIsra', d: '1:35' },
      { kind: 'yt', id: '1SS-DJ5ecE0', key: 'mukabelaJuz13', d: '56:48', v: 2675, src: 'BIR TV' },
    ],
  },
}

// ── Youth gatherings ────────────────────────────────────────────────────────

/** What a gathering offers (texts: pozovite.gatherings.offer.<key>) */
export const DRUZENJA_OFFER = ['lectures', 'workshops', 'quizzes'] as const

/** Photos (alt texts: pozovite.gatherings.photos.<key>) */
export const DRUZENJA_PHOTOS = [
  { src: 'p/mladi-predavanje.jpg', key: 'youthLecture' },
  { src: 'p/mladi-predavaci.jpg', key: 'spousesLecture' },
  { src: 'p/mladi-dzamija.jpg', key: 'youthInMosque' },
  { src: 'p/mladi-iftar.jpg', key: 'youthIftar' },
]

export const DRUZENJA_VIDS: Vid[] = [
  { kind: 'clip', id: 'hidzra', key: 'hijriNewYearCarina', d: '0:56' },
  { kind: 'clip', id: 'zagreb', key: 'youthIftarZagreb', d: '0:55' },
]

/** Figures on the section's home page (labels: pozovite.home.stats.<key>); `plus` adds "+" */
export const STATS: { key: string; n: number; plus?: boolean }[] = [
  { key: 'videos', n: 221 },
  { key: 'views', n: 310000, plus: true },
  { key: 'circles', n: 3 },
  { key: 'authors', n: 18 },
]

/** Thumbnail, media file and badge (YouTube, or pozovite.videoGrid.badges.<badge>) for a video card */
export function vidMedia(v: Vid): { thumb: string; src?: string; badge: 'youtube' | 'short' | 'clip'; tall: boolean } {
  switch (v.kind) {
    case 'yt':
      return { thumb: IMG(`y/${v.id}.jpg`), badge: 'youtube', tall: false }
    case 'reel':
      return { thumb: IMG(`i/${v.id}.jpg`), src: VIDEO(`r/${v.id}.mp4`), badge: 'short', tall: true }
    case 'short':
      return { thumb: IMG(`p/s-${v.id}.jpg`), src: VIDEO(`s/${v.id}.mp4`), badge: 'short', tall: true }
    case 'clip':
      return { thumb: IMG(`p/${v.id}.jpg`), src: VIDEO(`v/${v.id}.mp4`), badge: 'clip', tall: !!v.tall }
  }
}

export const BASE = '/pozovite-nas'

/** Every page of the section, for static generation and the sitemap */
export function allPaths(): string[][] {
  return [
    [],
    ['predavanja'],
    ...(['muskarci', 'dzemat'] as const).flatMap(a => [['predavanja', a], ...MEN.map(id => ['predavanja', a, id])]),
    ['predavanja', 'zene'],
    ['hor'],
    ...Object.keys(HOR).map(k => ['hor', k]),
    ['druzenja'],
    ['kontakt'],
  ]
}
