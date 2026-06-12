import { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'

const BASE = 'https://www.misbah-edu.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [videos, posts, ilahijeTekstovi, duaTekstovi, mektebPosts, pricaList] = await Promise.all([
    prisma.video.findMany({ where: { published: true }, select: { id: true, updatedAt: true }, orderBy: { createdAt: 'desc' } }),
    prisma.blogPost.findMany({ where: { published: true }, select: { id: true, updatedAt: true }, orderBy: { createdAt: 'desc' } }),
    prisma.ilahijaText.findMany({ where: { published: true }, select: { id: true, updatedAt: true } }).catch(() => []),
    prisma.duaText.findMany({ where: { published: true }, select: { id: true, updatedAt: true } }).catch(() => []),
    prisma.mektebPost.findMany({ where: { published: true }, select: { id: true, updatedAt: true } }).catch(() => []),
    prisma.prica.findMany({ where: { published: true }, select: { id: true, updatedAt: true } }).catch(() => []),
  ])

  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                          lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE}/predavanja/duga`,     lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/predavanja/kratka`,   lastModified: now, changeFrequency: 'daily',   priority: 0.8 },
    { url: `${BASE}/kuran`,               lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/podcasts`,            lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/ilahije/izvedba`,     lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/ilahije/tekstovi`,    lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/zikrovi`,             lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/blog`,                lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/aktivnosti`,          lastModified: now, changeFrequency: 'weekly',  priority: 0.6 },
    { url: `${BASE}/galerija`,            lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/o-nama`,              lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/zikrovi/tekstovi`,   lastModified: now, changeFrequency: 'weekly',  priority: 0.6 },
    { url: `${BASE}/mekteb`,             lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/price`,              lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
  ]

  const videoRoutes: MetadataRoute.Sitemap = videos.map(v => ({
    url: `${BASE}/videos/${v.id}`,
    lastModified: v.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const postRoutes: MetadataRoute.Sitemap = posts.map(p => ({
    url: `${BASE}/blog/${p.id}`,
    lastModified: p.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const ilahijeRoutes: MetadataRoute.Sitemap = ilahijeTekstovi.map(t => ({
    url: `${BASE}/ilahije/tekstovi/${t.id}`,
    lastModified: t.updatedAt,
    changeFrequency: 'yearly',
    priority: 0.4,
  }))

  const duaRoutes: MetadataRoute.Sitemap = duaTekstovi.map(t => ({
    url: `${BASE}/zikrovi/tekstovi/${t.id}`,
    lastModified: t.updatedAt,
    changeFrequency: 'yearly',
    priority: 0.5,
  }))

  const mektebRoutes: MetadataRoute.Sitemap = mektebPosts.map(p => ({
    url: `${BASE}/mekteb/${p.id}`,
    lastModified: p.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const pricaRoutes: MetadataRoute.Sitemap = pricaList.map(p => ({
    url: `${BASE}/price/${p.id}`,
    lastModified: p.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...videoRoutes, ...postRoutes, ...ilahijeRoutes, ...duaRoutes, ...mektebRoutes, ...pricaRoutes]
}
