import { prisma } from '@/lib/db'
import BlogSearch from '@/components/BlogSearch'

export const dynamic = 'force-dynamic'
export const metadata = {
  title: 'Blog | Misbah EDU',
  description: 'Islamski tekstovi, razmišljanja i članci',
}

async function getPosts() {
  try {
    return await prisma.blogPost.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' } })
  } catch { return [] }
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20 py-12 sm:py-16">
      <div className="mb-12">
        <p className="font-medium text-[#8b1e3f] text-base mb-2">PROMIŠLJANJA</p>
        <h1 className="font-semibold text-[#141110] mb-3"
          style={{ fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.3, letterSpacing: '-0.44px' }}>
          Blog
        </h1>
        <p className="font-normal text-[#746860]" style={{ fontSize: 18 }}>
          Tekstovi, osvrti i razmišljanja o vjeri, znanju i svakodnevnom životu.
        </p>
      </div>

      <BlogSearch posts={posts} />
    </div>
  )
}
