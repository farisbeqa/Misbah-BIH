import { NextResponse } from 'next/server'
import { getAllAuthors } from '@/lib/authorContent'
import { BIOS } from '@/lib/bios'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const authors = await getAllAuthors()
    return NextResponse.json(authors.map(a => ({
      slug: a.slug,
      name: a.name,
      bioSlug: a.bioSlug ?? null,
      photo: a.bioSlug ? BIOS[a.bioSlug]?.photo ?? null : null,
      count: a.count,
    })))
  } catch {
    return NextResponse.json({ error: 'Greška' }, { status: 500 })
  }
}
