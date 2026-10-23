import { NextResponse } from 'next/server'
import { getAuthorPage } from '@/lib/authorContent'
import { BIOS } from '@/lib/bios'

export const dynamic = 'force-dynamic'

// Same data as the /autori/[slug] page; item hrefs are web paths, which the app mirrors
export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  try {
    const data = await getAuthorPage(params.slug)
    if (!data) return NextResponse.json({ error: 'Autor nije pronađen' }, { status: 404 })

    const { author, sections, total } = data
    const bio = author.bioSlug ? BIOS[author.bioSlug] : undefined
    return NextResponse.json({
      author: {
        slug: author.slug,
        name: author.name,
        bioSlug: author.bioSlug ?? null,
        photo: bio?.photo ?? null,
        role: bio?.role ?? null,
      },
      total,
      sections: sections.map(s => ({
        key: s.key,
        title: s.title,
        items: s.items.map(i => ({ key: i.key, title: i.title, href: i.href, date: i.date, image: i.image ?? null, label: i.label })),
      })),
    })
  } catch {
    return NextResponse.json({ error: 'Greška' }, { status: 500 })
  }
}
