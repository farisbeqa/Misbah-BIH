import { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'
import { allPaths } from '@/lib/pozovite'
import { LOCALES } from '@/i18n/config'
import { localizeHref } from '@/i18n/href'

// Built per request so it always lists the current content (the database is
// reachable at runtime, not during the build)
export const dynamic = 'force-dynamic'

const BASE = 'https://www.misbah-edu.com'

// Every page exists in all website languages: /blog, /en/blog, /ar/blog, ...
function withLanguages(entries: MetadataRoute.Sitemap): MetadataRoute.Sitemap {
  return entries.map(e => {
    const path = e.url.slice(BASE.length) || '/'
    const languages: Record<string, string> = {}
    for (const l of LOCALES) languages[l] = BASE + localizeHref(path, l)
    languages['x-default'] = BASE + localizeHref(path, 'bs')
    return { ...e, alternates: { languages } }
  })
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`,                  lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE}/predavanja/duga`,   lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/predavanja/kratka`, lastModified: now, changeFrequency: 'daily',   priority: 0.8 },
    { url: `${BASE}/kuran`,             lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/podcasts`,          lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/ilahije/izvedba`,   lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/ilahije/tekstovi`,  lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/zikrovi`,           lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/zikrovi/tekstovi`,  lastModified: now, changeFrequency: 'weekly',  priority: 0.6 },
    { url: `${BASE}/blog`,              lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/aktivnosti`,        lastModified: now, changeFrequency: 'weekly',  priority: 0.6 },
    { url: `${BASE}/galerija`,          lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/o-nama`,            lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/autori`,            lastModified: now, changeFrequency: 'weekly',  priority: 0.6 },
    ...allPaths().map(p => ({ url: `${BASE}/pozovite-nas${p.length ? '/' + p.join('/') : ''}`, lastModified: now, changeFrequency: 'monthly' as const, priority: p.length ? 0.5 : 0.8 })),
    { url: `${BASE}/privatnost`,        lastModified: now, changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${BASE}/pravila-koristenja`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE}/mekteb`,            lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/price`,             lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
  ]

  let videoRoutes:   MetadataRoute.Sitemap = []
  let postRoutes:    MetadataRoute.Sitemap = []
  let ilahijeRoutes: MetadataRoute.Sitemap = []
  let duaRoutes:     MetadataRoute.Sitemap = []
  let mektebRoutes:  MetadataRoute.Sitemap = []
  let pricaRoutes:   MetadataRoute.Sitemap = []

  try {
    const [videos, posts, ilahijeTekstovi, duaTekstovi, mektebPosts, pricaList] = await Promise.all([
      prisma.video.findMany({ where: { published: true }, select: { id: true, updatedAt: true }, orderBy: { createdAt: 'desc' } }),
      prisma.blogPost.findMany({ where: { published: true }, select: { id: true, updatedAt: true }, orderBy: { createdAt: 'desc' } }),
      prisma.ilahijaText.findMany({ where: { published: true }, select: { id: true, updatedAt: true } }),
      prisma.duaText.findMany({ where: { published: true }, select: { id: true, updatedAt: true } }),
      prisma.mektebPost.findMany({ where: { published: true }, select: { id: true, updatedAt: true } }),
      prisma.prica.findMany({ where: { published: true }, select: { id: true, updatedAt: true } }),
    ])

    videoRoutes   = videos.map(v => ({ url: `${BASE}/videos/${v.id}`,           lastModified: v.updatedAt, changeFrequency: 'monthly', priority: 0.6 }))
    postRoutes    = posts.map(p => ({ url: `${BASE}/blog/${p.id}`,              lastModified: p.updatedAt, changeFrequency: 'monthly', priority: 0.7 }))
    ilahijeRoutes = ilahijeTekstovi.map(t => ({ url: `${BASE}/ilahije/tekstovi/${t.id}`, lastModified: t.updatedAt, changeFrequency: 'yearly',  priority: 0.4 }))
    duaRoutes     = duaTekstovi.map(t => ({ url: `${BASE}/zikrovi/tekstovi/${t.id}`,     lastModified: t.updatedAt, changeFrequency: 'yearly',  priority: 0.5 }))
    mektebRoutes  = mektebPosts.map(p => ({ url: `${BASE}/mekteb/${p.id}`,      lastModified: p.updatedAt, changeFrequency: 'monthly', priority: 0.6 }))
    pricaRoutes   = pricaList.map(p => ({ url: `${BASE}/price/${p.id}`,         lastModified: p.updatedAt, changeFrequency: 'monthly', priority: 0.6 }))
  } catch (err) {
    console.error('[sitemap] DB fetch failed, returning static routes only:', err)
  }

  return withLanguages([...staticRoutes, ...videoRoutes, ...postRoutes, ...ilahijeRoutes, ...duaRoutes, ...mektebRoutes, ...pricaRoutes])
}
