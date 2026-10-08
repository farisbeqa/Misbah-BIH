import { prisma } from '@/lib/db'
import { resolveAuthors, knownAuthor, type AuthorRef } from '@/lib/authors'

export interface AuthorItem {
  key: string
  title: string
  href: string
  date: Date
  image?: string | null
  label: string
  authors: AuthorRef[]
}

export interface AuthorSection {
  key: string
  title: string
  items: AuthorItem[]
}

// Display order of the sections on an author page
const SECTIONS: { key: string; title: string }[] = [
  { key: 'predavanja', title: 'Predavanja' },
  { key: 'kratka',     title: 'Kratka predavanja' },
  { key: 'blog',       title: 'Promišljanja i hutbe' },
  { key: 'kuran',      title: "Kur'an" },
  { key: 'podcast',    title: 'Podcast' },
  { key: 'price',      title: 'Poučne priče' },
  { key: 'zikrovi',    title: 'Zikrovi' },
  { key: 'dove',       title: 'Dove' },
  { key: 'ilahije',    title: 'Ilahije' },
  { key: 'mekteb',     title: 'Mekteb' },
]

const BLOG_LABELS: Record<string, string> = {
  hutbe: 'Hutba', 'aktuelne-teme': 'Aktuelne teme', duhovnost: 'Duhovnost',
  'tefsir-kuran': "Tefsir i Kur'an", sira: 'Sira', fikh: 'Fikh', savjeti: 'Savjeti', odgoj: 'Odgoj i porodica',
}

function videoSection(category: string, isShortForm: boolean): string {
  if (category === 'predavanja') return isShortForm ? 'kratka' : 'predavanja'
  if (['kuran', 'podcast', 'ilahije', 'zikrovi'].includes(category)) return category
  return 'predavanja'
}

/** Every published item on the site, tagged with its section and resolved authors. */
async function loadAllContent(): Promise<(AuthorItem & { section: string })[]> {
  const pub = { where: { published: true } }
  const [videos, posts, price, zikrovi, dove, ilahije, mekteb] = await Promise.all([
    prisma.video.findMany({ ...pub, select: { id: true, title: true, author: true, createdAt: true, thumbnailUrl: true, category: true, isShortForm: true } }),
    prisma.blogPost.findMany({ ...pub, select: { id: true, title: true, author: true, createdAt: true, imageUrl: true, category: true } }),
    prisma.prica.findMany({ ...pub, select: { id: true, title: true, author: true, createdAt: true, imageUrl: true } }),
    prisma.zikrText.findMany({ ...pub, select: { id: true, title: true, author: true, createdAt: true, thumbnailUrl: true } }),
    prisma.duaText.findMany({ ...pub, select: { id: true, title: true, author: true, createdAt: true } }),
    prisma.ilahijaText.findMany({ ...pub, select: { id: true, title: true, author: true, createdAt: true } }),
    prisma.mektebPost.findMany({ ...pub, select: { id: true, title: true, author: true, createdAt: true, imageUrl: true } }),
  ])

  const items: (AuthorItem & { section: string })[] = []
  const push = (section: string, key: string, href: string, label: string, r: { title: string; author: string | null; createdAt: Date }, image?: string | null) =>
    items.push({ section, key, href, label, image, title: r.title, date: r.createdAt, authors: resolveAuthors(r.author, r.title) })

  for (const v of videos) {
    const s = videoSection(v.category, v.isShortForm)
    push(s, `v${v.id}`, `/videos/${v.id}`, SECTIONS.find(x => x.key === s)!.title, v, v.thumbnailUrl)
  }
  for (const p of posts)   push('blog',    `b${p.id}`, `/blog/${p.id}`,             BLOG_LABELS[p.category] ?? 'Promišljanje', p, p.imageUrl)
  for (const p of price)   push('price',   `p${p.id}`, `/price/${p.id}`,            'Poučna priča', p, p.imageUrl)
  for (const z of zikrovi) push('zikrovi', `z${z.id}`, `/zikrovi/tekst/${z.id}`,    'Zikr', z, z.thumbnailUrl)
  for (const d of dove)    push('dove',    `d${d.id}`, `/zikrovi/tekstovi/${d.id}`, 'Dova', d)
  for (const i of ilahije) push('ilahije', `i${i.id}`, `/ilahije/tekstovi/${i.id}`, 'Ilahija', i)
  for (const m of mekteb)  push('mekteb',  `m${m.id}`, `/mekteb/${m.id}`,           'Mekteb', m, m.imageUrl)

  return items
}

export async function getAuthorPage(slug: string): Promise<{ author: AuthorRef; sections: AuthorSection[]; total: number } | null> {
  const all = await loadAllContent()
  const mine = all.filter(i => i.authors.some(a => a.slug === slug))
  if (mine.length === 0) return null

  const author = knownAuthor(slug) ?? mine[0].authors.find(a => a.slug === slug)!
  mine.sort((a, b) => b.date.getTime() - a.date.getTime())

  const sections = SECTIONS
    .map(s => ({ ...s, items: mine.filter(i => i.section === s.key) }))
    .filter(s => s.items.length > 0)

  return { author, sections, total: mine.length }
}

export async function getAllAuthors(): Promise<(AuthorRef & { count: number })[]> {
  const all = await loadAllContent()
  const counts = new Map<string, AuthorRef & { count: number }>()
  for (const item of all) {
    for (const a of item.authors) {
      const cur = counts.get(a.slug)
      if (cur) cur.count++
      else counts.set(a.slug, { ...(knownAuthor(a.slug) ?? a), count: 1 })
    }
  }
  return Array.from(counts.values()).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'bs'))
}
