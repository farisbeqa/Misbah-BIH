import { getTranslations } from 'next-intl/server'
import { prisma } from '@/lib/db'
import { localizeRows } from '@/lib/translations'
import { getLocale } from '@/i18n/server'
import BlogSearch from '@/components/BlogSearch'

// Rendered per request: the database is reachable at runtime, not during the build
export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const t = await getTranslations('blog')
  return {
    title: `${t('blogPage.meta.title')} | Misbah EDU`,
    description: t('blogPage.meta.description'),
  }
}

async function getPosts() {
  try {
    return await prisma.blogPost.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' } })
  } catch { return [] }
}

export default async function BlogPage() {
  const t = await getTranslations('blog')
  const posts = await localizeRows('blog', await getPosts(), getLocale())

  return (
    <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20 py-12 sm:py-16">
      <div className="mb-12">
        <p className="font-medium text-[var(--fg-8b1e3f)] text-base mb-2">{t('blogPage.tag')}</p>
        <h1 className="font-semibold text-[var(--fg-141110)] mb-3"
          style={{ fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.3, letterSpacing: '-0.44px' }}>
          {t('blogPage.title')}
        </h1>
        <p className="font-normal text-[var(--fg-746860)]" style={{ fontSize: 18 }}>
          {t('blogPage.subtitle')}
        </p>
      </div>

      <BlogSearch posts={posts} />
    </div>
  )
}
