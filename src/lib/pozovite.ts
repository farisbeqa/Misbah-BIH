// "Pozovite nas": invite Misbah EDU (lectures, choir, youth gatherings) to a
// džemat, school or community. Content from the original mini-site made for
// Hamdo; the page lives at /pozovite-nas.

/** Videos are served from the media CDN, images from /public/pozovite-nas */
export const VIDEO_BASE = process.env.NEXT_PUBLIC_POZOVITE_VIDEO_BASE ?? ''
export const IMG = (path: string) => `/pozovite-nas/${path}`
export const VIDEO = (path: string) => `${VIDEO_BASE}/pozovite-nas/${path}`

export const CONTACT = {
  email: 'misbah.bosna@gmail.com',
  phone: '+387 61 991 990',
  phoneDigits: '38761991990',
}

export const INVITE_TEMPLATE =
  'Selam alejkum,\n\nželio/željela bih ugostiti Misbah EDU (predavanje, hor ili omladinsko druženje). Možete li mi poslati više informacija o terminima i uslovima?\n\nHvala i selam!'

export const FORMATS = [
  { id: 'predavanje', t: 'Predavanje', d: 'Jedno predavanje ili tribina, s pitanjima publike.' },
  { id: 'edukacija', t: 'Edukacija', d: 'Tematski ciklus od nekoliko susreta, npr. sedmično.' },
  { id: 'radionica', t: 'Radionica', d: 'Rad u manjoj grupi, kroz razgovor i zadatke.' },
  { id: 'visednevna', t: 'Višednevna edukacija', d: 'Intenzivan program kroz vikend ili više dana.' },
]

export type Audience = 'muskarci' | 'zene' | 'dzemat'

export const AUD: Record<Audience, { t: string; img: string; d: string }> = {
  muskarci: { t: 'Za muškarce', img: 'p/hamza.jpg', d: 'Predavanja i halke za muške džematlije, omladinu i studente.' },
  zene: { t: 'Za žene', img: 'tim/mubina-suljic-solo.jpg', d: 'Predavanja, edukacije i radionice za žene i djevojke.' },
  dzemat: { t: 'Za džemat', img: 'p/hidzra.jpg', d: "Za cijeli džemat i porodice: tribine, večeri Kur'ana, mevludi." },
}

/** Lecturers offered to men and to the whole džemat (women: Mubina) */
export const MEN = ['hamdo', 'hamza']

/**
 * A video: `reel` and `short` are portrait phone clips, `clip` a landscape
 * clip (all hosted with the page), `yt` a YouTube video.
 */
export type Vid =
  | { kind: 'reel' | 'short' | 'clip'; id: string; t: string; d?: string; v?: string; tall?: boolean }
  | { kind: 'yt'; id: string; t: string; d: string; v?: string; src?: string }

export interface Person {
  n: string
  r: string
  img: string
  /** /autori/[slug] on this site */
  author?: string
  bio: string
  topics: string[]
  vids: Vid[]
}

export const PEOPLE: Record<string, Person> = {
  hamdo: {
    n: 'hfz. Hamdo Solo', r: 'Tefsir', img: 'tim/hamdo-solo.jpg', author: 'hamdo-solo',
    bio: 'Saradnik za kiraet na FIN-u i doktorand. Vodi halku tefsira četvrtkom u džematu Carina.',
    topics: ['Tefsir kratkih sura', 'Brak i porodica'],
    vids: [
      { kind: 'reel', id: 'DdRtvWRxkkk', t: 'Sura el-Inširah: nakon teškoće dolazi olakšanje', d: '1:15' },
      { kind: 'reel', id: 'DcQ7iiGS_--', t: 'Šta nam sura ez-Zilzal govori o Sudnjem danu?', d: '0:56' },
      { kind: 'reel', id: 'DbiyGx2Iar9', t: 'Sura en-Nas: zaštita od zlih misli i šejtanskih došaptavanja', d: '0:33' },
      { kind: 'yt', id: 'daQdzhD7CwI', t: 'Sura et-Tin: zašto je Allah spomenuo smokvu i maslinu?', d: '30:52', v: '77.850' },
      { kind: 'yt', id: 'hKoHnSXGAwM', t: 'Sura ed-Duha: poruka za trenutke kad ti je teško', d: '24:49', v: '10.534' },
      { kind: 'yt', id: 'wc849Ricw2E', t: 'Sura el-Adijat: sura o kojoj znamo najmanje?', d: '21:43', v: '1.398' },
      { kind: 'yt', id: '50ecLEJfQyk', t: "Dimenzije islama: Poslanik Muhammed, s.a.v.s., u Kur'anu", d: '40:10', v: '435' },
    ],
  },
  hamza: {
    n: 'Hamza ef. Bajraktarević', r: 'Sira i etika', img: 'tim/hamza-bajraktarevic.jpg', author: 'hamza-bajraktarevic',
    bio: 'Život Poslanika ﷺ i pouke za danas. Vodi halku sire ponedjeljkom nakon akšama u džematu Bjelave.',
    topics: ['Sira Poslanika ﷺ', 'Sabur i smirenost', 'Iman'],
    vids: [
      { kind: 'clip', id: 'hamza', t: 'Smirenost u vremenu anksioznosti', d: '1:24' },
      { kind: 'yt', id: 'DRB-XX9V8QY', t: 'Kako sabur mijenja srce', d: '14:14', v: '2.370' },
      { kind: 'yt', id: '2_dF6g2zsVA', t: 'Bereket u spomenu Poslanika ﷺ', d: '21:49', v: '1.791' },
      { kind: 'yt', id: 'YAXzsYlSCl0', t: 'Šta znači biti istinski vjernik?', d: '17:52', v: '854' },
      { kind: 'yt', id: '-8ksFYv4K90', t: 'Brak koji je promijenio historiju (Sira, 7. dio)', d: '18:09', v: '516' },
    ],
  },
  mubina: {
    n: 'hfz. Mubina Suljić Solo', r: "Fikh · hafiza Kur'ana", img: 'tim/mubina-suljic-solo.jpg', author: 'mubina-suljic-solo',
    bio: "Asistentica na Katedri za šerijatsko pravo (fikh) na FIN-u i hafiza Kur'ana. Govori o ibadetu, porodici i pitanjima s kojima se susreće savremena muslimanka.",
    topics: ['Fikh za žene', 'Namaz i ibadet', 'Poslanikov ﷺ karakter', 'Ramazan'],
    vids: [
      { kind: 'yt', id: 'vXfi425ptIk', t: 'Milostivost Muhameda, a.s.', d: '5:19', v: '2.007', src: 'islamEDU' },
      { kind: 'yt', id: '0XpC3AVFJ7M', t: 'Emocionalna inteligencija Muhameda, a.s.', d: '4:44', v: '1.709', src: 'islamEDU' },
      { kind: 'yt', id: 'dKNgKdnp8dE', t: 'Da li je islam pravedan prema ženi?', d: '3:31', v: '2.661', src: 'Ramazanske misli' },
      { kind: 'yt', id: '4tKtftVXWzM', t: 'Namazom do zahvalnosti', d: '5:22', v: '1.550', src: 'Ramazanske misli' },
      { kind: 'yt', id: 'zgBCuxJLJbY', t: 'Poslije iskušenja dolazi olakšanje', d: '7:13', v: '1.038', src: 'Ramazanske misli' },
      { kind: 'yt', id: 'rA9Qc6RDMrA', t: 'Kako post utiče na međuljudske odnose', d: '10:27', v: '1.553', src: 'Hayat' },
    ],
  },
}

export type HorKey = 'muski' | 'zenski' | 'mijesani' | 'vecer'

export const HOR: Record<HorKey, { t: string; img: string; vid?: string; d: string; vids: Vid[] }> = {
  muski: {
    t: 'Muški hor', img: 'p/hor-maljevac.jpg', d: 'Ilahije i kaside uz defove: otvorenja džamija, mevludi, iftari i svečanosti.',
    vids: [
      { kind: 'clip', id: 'muski-1627', t: 'Kolaž ilahija', d: '7:09' },
      { kind: 'clip', id: 'muski-svicarska', t: 'Nastup u Švicarskoj', d: '0:38', tall: true },
      { kind: 'clip', id: 'muski-7263', t: 'Ilahija uz kandilj', d: '2:14', tall: true },
      { kind: 'clip', id: 'hor-maljevac', t: 'Otvorenje džamije u Maljevcu', d: '0:56' },
      { kind: 'clip', id: 'zagreb', t: 'Omladinski iftar u Zagrebu', d: '0:55' },
      { kind: 'clip', id: 'hor-zagreb-studio', t: 'Omladinski iftar u Zagrebu (studio zvuk)', d: '1:00' },
      { kind: 'yt', id: '140o_dege3Q', t: 'Cijeli nastup u Maljevcu', d: '20:41', v: '3.696' },
      { kind: 'yt', id: 'PyLxh8jqR7s', t: 'Cijeli nastup u Zagrebu', d: '25:39', v: '181' },
    ],
  },
  zenski: {
    t: 'Ženski hor', img: 'p/mijesani-2.jpg', vid: 'v/mijesani-2.mp4', d: 'Ilahije za ženske programe, mevlude, mektebske priredbe i svečanosti.',
    vids: [{ kind: 'clip', id: 'mijesani-2', t: 'Ilahija na druženju', d: '0:32' }],
  },
  mijesani: {
    t: 'Miješani hor', img: 'p/mijesani-3.jpg', d: 'Zajednički nastupi za porodične i svečane programe džemata.',
    vids: [
      { kind: 'clip', id: 'mijesani-3', t: 'Ilahija u džamiji', d: '1:05', tall: true },
      { kind: 'clip', id: 'mijesani-1', t: 'Nastup u džamiji', d: '0:34', tall: true },
    ],
  },
  vecer: {
    t: "Večer Kur'ana", img: 'p/vecer.jpg', d: "Učenje Kur'ana uz prijevod i ilahije: večeri za džemat, ramazanski programi i posebne prilike.",
    vids: [
      { kind: 'clip', id: 'vecer-ucenje', t: "Učenje Kur'ana", d: '7:57' },
      { kind: 'clip', id: 'vecer-dorada', t: "Učenje Kur'ana u džematu", d: '0:35', tall: true },
      { kind: 'clip', id: 'DT3bXE_CAGN', t: 'Sura Ibrahim (23–27)', d: '1:46' },
      { kind: 'clip', id: 'DTNmcHXCAL8', t: 'Sura Fussilet (30–33)', d: '1:32' },
      { kind: 'clip', id: 'DS7xB71CJmd', t: 'Sura el-Isra (11–12)', d: '1:35' },
      { kind: 'yt', id: '1SS-DJ5ecE0', t: 'Mukabela, 13. džuz', d: '56:48', v: '2.675', src: 'BIR TV' },
    ],
  },
}

export const DRUZENJA_OFFER = [
  { t: 'Edukativna predavanja', d: 'Otvaramo važne teme iz vjere i svakodnevnog života, približavajući mladima islamske vrijednosti na savremen i njima blizak način.' },
  { t: 'Interaktivne radionice', d: 'Kroz kreativne zadatke, razgovor i timski rad podstičemo aktivno učešće, razmjenu ideja i razvoj novih vještina.' },
  { t: 'Kvizovi znanja', d: 'Kroz zabavu, timsko nadmetanje i druženje podstičemo mlade da proširuju svoje znanje o islamu, islamskoj historiji i općoj kulturi.' },
]

export const DRUZENJA_PHOTOS = [
  { src: 'p/mladi-predavanje.jpg', alt: 'Mladi na predavanju u Istiklal džamiji' },
  { src: 'p/mladi-predavaci.jpg', alt: 'hfz. Mubina Suljić Solo i hfz. Hamdo Solo na predavanju „Uloga supružnika u islamu”' },
  { src: 'p/mladi-dzamija.jpg', alt: 'Mladi na predavanju u džamiji' },
  { src: 'p/mladi-iftar.jpg', alt: 'Omladinski iftar' },
]

export const DRUZENJA_VIDS: Vid[] = [
  { kind: 'clip', id: 'hidzra', t: 'Nova hidžretska godina u džematu Carina', d: '0:56' },
  { kind: 'clip', id: 'zagreb', t: 'Omladinski iftar u Zagrebu', d: '0:55' },
]

export const STATS = [
  { n: '221', t: 'video na YouTubeu' },
  { n: '310.000+', t: 'pregleda' },
  { n: '3', t: 'sedmične halke' },
  { n: '18', t: 'autora i predavača' },
]

export const RUBRIKE = ['Predavanja', 'Hor', 'Omladinska druženja'] as const

/** Thumbnail, media file and label for a video card */
export function vidMedia(v: Vid): { thumb: string; src?: string; badge: string; tall: boolean } {
  switch (v.kind) {
    case 'yt':
      return { thumb: IMG(`y/${v.id}.jpg`), badge: 'YouTube', tall: false }
    case 'reel':
      return { thumb: IMG(`i/${v.id}.jpg`), src: VIDEO(`r/${v.id}.mp4`), badge: 'Kratko', tall: true }
    case 'short':
      return { thumb: IMG(`p/s-${v.id}.jpg`), src: VIDEO(`s/${v.id}.mp4`), badge: 'Kratko', tall: true }
    case 'clip':
      return { thumb: IMG(`p/${v.id}.jpg`), src: VIDEO(`v/${v.id}.mp4`), badge: 'Isječak', tall: !!v.tall }
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
