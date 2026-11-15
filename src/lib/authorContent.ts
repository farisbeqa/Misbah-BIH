import { getTranslations } from 'next-intl/server'
import { prisma } from '@/lib/db'
import { resolveAuthors, knownAuthor, type AuthorRef } from '@/lib/authors'
import { localizeRows } from '@/lib/translations'
import type { Entity } from '@/lib/translation-spec'
import { DEFAULT_LOCALE, type Locale } from '@/i18n/config'
import bsAbout from '../../messages/bs/about.json'

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

// Section titles and item labels live in messages/<locale>/about.json under
// contentTypes. Bosnian (the default, also returned by the mobile app API) is
// read straight from the Bosnian file; other languages through next-intl.
const BS_CONTENT_TYPES: Record<string, Record<string, string>> = bsAbout.contentTypes

// Display order of the sections on an author page
const SECTIONS = ['predavanja', 'kratka', 'blog', 'kuran', 'podcast', 'price', 'zikrovi', 'dove', 'ilahije', 'mekteb'] as const
type SectionKey = (typeof SECTIONS)[number]

// Blog category (database value) → key in contentTypes.blogCategories
const BLOG_CATEGORIES = new Map([
  ['hutbe', 'hutbe'], ['aktuelne-teme', 'aktuelneTeme'], ['duhovnost', 'duhovnost'], ['tefsir-kuran', 'tefsirKuran'],
  ['sira', 'sira'], ['fikh', 'fikh'], ['savjeti', 'savjeti'], ['odgoj', 'odgoj'],
])

type ContentItem = AuthorItem & {
  section: SectionKey
  /** Database row behind the item (for translations) */
  entity: Entity
  id: number
  /** Key of `label` in contentTypes, e.g. "blogCategories.hutbe" */
  labelKey: string
}

/** Bosnian text of a key in contentTypes ("sections.kratka") */
function bsText(key: string): string {
  const [group, name] = key.split('.')
  return BS_CONTENT_TYPES[group][name]
}

function blogLabelKey(category: string): string {
  const key = BLOG_CATEGORIES.get(category)
  return key ? `blogCategories.${key}` : 'items.reflection'
}

function videoSection(category: string, isShortForm: boolean): SectionKey {
  if (category === 'predavanja') return isShortForm ? 'kratka' : 'predavanja'
  if (category === 'kuran' || category === 'podcast' || category === 'ilahije' || category === 'zikrovi') return category
  return 'predavanja'
}

/** Every published item on the site, tagged with its section and resolved authors. */
async function loadAllContent(): Promise<ContentItem[]> {
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

  const items: ContentItem[] = []
  const push = (
    section: SectionKey, entity: Entity, key: string, href: string, labelKey: string,
    r: { id: number; title: string; author: string | null; createdAt: Date }, image?: string | null,
  ) =>
    items.push({ section, entity, id: r.id, labelKey, key, href, label: bsText(labelKey), image, title: r.title, date: r.createdAt, authors: resolveAuthors(r.author, r.title) })

  for (const v of videos) {
    const s = videoSection(v.category, v.isShortForm)
    push(s, 'video', `v${v.id}`, `/videos/${v.id}`, `sections.${s}`, v, v.thumbnailUrl)
  }
  for (const p of posts)   push('blog',    'blog',    `b${p.id}`, `/blog/${p.id}`,             blogLabelKey(p.category), p, p.imageUrl)
  for (const p of price)   push('price',   'prica',   `p${p.id}`, `/price/${p.id}`,            'items.story', p, p.imageUrl)
  for (const z of zikrovi) push('zikrovi', 'zikr',    `z${z.id}`, `/zikrovi/tekst/${z.id}`,    'items.zikr', z, z.thumbnailUrl)
  for (const d of dove)    push('dove',    'dua',     `d${d.id}`, `/zikrovi/tekstovi/${d.id}`, 'items.dua', d)
  for (const i of ilahije) push('ilahije', 'ilahija', `i${i.id}`, `/ilahije/tekstovi/${i.id}`, 'items.ilahija', i)
  for (const m of mekteb)  push('mekteb',  'mekteb',  `m${m.id}`, `/mekteb/${m.id}`,           'items.mekteb', m, m.imageUrl)

  return items
}

/** Item titles in the given language (Bosnian where there is no translation yet) */
async function localizeTitles(items: ContentItem[], locale: Locale): Promise<ContentItem[]> {
  const byEntity = new Map<Entity, ContentItem[]>()
  for (const item of items) {
    const list = byEntity.get(item.entity)
    if (list) list.push(item)
    else byEntity.set(item.entity, [item])
  }
  const titles = new Map<string, string>()
  await Promise.all(Array.from(byEntity, async ([entity, list]) => {
    const rows = await localizeRows(entity, list.map(i => ({ id: i.id, title: i.title })), locale)
    rows.forEach((row, n) => titles.set(list[n].key, row.title))
  }))
  return items.map(i => ({ ...i, title: titles.get(i.key) ?? i.title }))
}

/**
 * Everything an author published, in sections (newest first inside each).
 * Bosnian by default (the mobile app API relies on that); in another language
 * the item titles, section titles and labels are translated.
 */
export async function getAuthorPage(
  slug: string,
  locale: Locale = DEFAULT_LOCALE,
): Promise<{ author: AuthorRef; sections: AuthorSection[]; total: number } | null> {
  const all = await loadAllContent()
  let mine = all.filter(i => i.authors.some(a => a.slug === slug))
  if (mine.length === 0) return null

  const author = knownAuthor(slug) ?? mine[0].authors.find(a => a.slug === slug)!
  mine.sort((a, b) => b.date.getTime() - a.date.getTime())

  let sectionTitle = (key: SectionKey) => bsText(`sections.${key}`)
  if (locale !== DEFAULT_LOCALE) {
    const t = await getTranslations({ locale, namespace: 'about.contentTypes' })
    mine = (await localizeTitles(mine, locale)).map(i => ({ ...i, label: t(i.labelKey) }))
    sectionTitle = key => t(`sections.${key}`)
  }

  const sections = SECTIONS
    .map(key => ({ key, title: sectionTitle(key), items: mine.filter(i => i.section === key) }))
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
