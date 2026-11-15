import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('videos')
  return {
    title: t('meta.shortLectures.title'),
    description: t('meta.shortLectures.description'),
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
