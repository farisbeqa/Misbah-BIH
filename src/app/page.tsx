import { getTranslations } from 'next-intl/server'
import { prisma } from '@/lib/db'
import { localizeRows } from '@/lib/translations'
import Link from '@/i18n/navigation'
import { getLocale } from '@/i18n/server'
import { formatShortDate } from '@/i18n/format'
import type { Locale } from '@/i18n/config'
import MisaoDana from '@/components/MisaoDana'
import GlasoviSection from '@/components/GlasoviSection'
import MisaoDanaPopup from '@/components/MisaoDanaPopup'
import CardImage from '@/components/CardImage'

export const dynamic = 'force-dynamic'

async function getData(locale: Locale) {
  try {
    const [predavanja, kuran, podcasts, posts, quotes] = await Promise.all([
      prisma.video.findMany({ where: { published: true, category: 'predavanja' }, orderBy: { createdAt: 'desc' }, take: 3 }),
      prisma.video.findMany({ where: { published: true, category: 'kuran' }, orderBy: { createdAt: 'desc' }, take: 3 }),
      prisma.video.findMany({ where: { published: true, category: 'podcast' }, orderBy: { createdAt: 'desc' }, take: 2 }),
      prisma.blogPost.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' }, take: 3 }),
      prisma.quote.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' }, take: 8 }),
    ])
    const [videos, localizedPosts, localizedQuotes] = await Promise.all([
      localizeRows('video', [...predavanja, ...kuran, ...podcasts], locale),
      localizeRows('blog', posts, locale),
      localizeRows('quote', quotes, locale),
    ])
    const byId = new Map(videos.map(v => [v.id, v]))
    const pick = (rows: { id: number }[]) => rows.map(r => byId.get(r.id)!)
    return { predavanja: pick(predavanja), kuran: pick(kuran), podcasts: pick(podcasts), posts: localizedPosts, quotes: localizedQuotes }
  } catch {
    return { predavanja: [], kuran: [], podcasts: [], posts: [], quotes: [] }
  }
}

// ── Arrow icon (16 px) ───────────────────────────────────────────────────────
function ArrowUpRight() {
  return (
    <svg className="block shrink-0 flip-rtl" width="16" height="16" fill="none" viewBox="0 0 11.5 11.5">
      <path d="M0.75 10.75L10.75 0.75M10.75 10.75V0.75H0.75"
        stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  )
}

// ── Section heading block ────────────────────────────────────────────────────
function SectionHead({
  tag, title, description, cta,
}: {
  tag: string
  title: string
  description: string
  cta?: { label: string; href: string }
}) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
      <div className="flex flex-col gap-4 max-w-[705px]">
        <p className="font-medium text-[var(--fg-8b1e3f)] text-base">{tag}</p>
        <div className="flex flex-col gap-6">
          <h2 className="font-semibold text-[var(--fg-141110)]"
            style={{ fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.3, letterSpacing: '-0.44px' }}>
            {title}
          </h2>
          <p className="font-normal text-[var(--fg-746860)]"
            style={{ fontSize: 18, lineHeight: 1.5, letterSpacing: '-0.18px' }}>
            {description}
          </p>
        </div>
      </div>
      {cta && (
        <Link href={cta.href}
          className="bg-[var(--bg-8b1e3f)] text-white flex items-center gap-2 ps-8 pe-6 py-3 text-base font-normal shrink-0 hover:bg-[var(--bg-7a1a37)] transition-colors self-start lg:self-auto">
          {cta.label}
          <ArrowUpRight />
        </Link>
      )}
    </div>
  )
}

// ── Content card for videos ──────────────────────────────────────────────────
type VideoRow = {
  id: number; title: string; description?: string | null
  platform: string; thumbnailUrl?: string | null; createdAt: string | Date
}

function VideoCard({ v, locale }: { v: VideoRow; locale: Locale }) {
  return (
    <Link href={`/videos/${v.id}`} className="group block h-full">
      <div className="bg-[var(--bg-f5f2ef)] overflow-hidden border border-[var(--line-black5)] flex flex-col h-full">
        <div className="relative h-[228px] w-full shrink-0 overflow-hidden">
          <CardImage src={v.thumbnailUrl} alt={v.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <div className="absolute top-4 start-4 bg-[var(--bg-faf5f5)] px-2.5 py-1.5">
            <span className="text-[var(--fg-8b1e3f)] uppercase" style={{ fontSize: 10, letterSpacing: '0.3px' }}>
              {v.platform}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2.5 px-6 py-7 flex-1">
          <p className="font-medium text-[var(--fg-8b1e3f)] text-xs uppercase tracking-wide">{formatShortDate(v.createdAt, locale)}</p>
          <p className="font-medium text-[var(--fg-241f1d)] leading-[1.12] line-clamp-2 group-hover:text-[var(--fg-8b1e3f)] transition-colors"
            style={{ fontSize: 20, letterSpacing: '-0.6px' }}>
            {v.title}
          </p>
          {v.description && (
            <p className="font-normal text-[var(--fg-5a4f49)] text-base leading-normal line-clamp-2 mt-auto">{v.description}</p>
          )}
        </div>
      </div>
    </Link>
  )
}

// ── Content card for blog posts ──────────────────────────────────────────────
type PostRow = { id: number; title: string; content: string; imageUrl?: string | null; createdAt: string | Date }

function PostCard({ p, locale }: { p: PostRow; locale: Locale }) {
  return (
    <Link href={`/blog/${p.id}`} className="group block h-full">
      <div className="bg-[var(--bg-f5f2ef)] overflow-hidden border border-[var(--line-black5)] flex flex-col h-full">
        <div className="relative h-[228px] w-full shrink-0 overflow-hidden">
          <CardImage src={p.imageUrl} alt={p.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
        <div className="flex flex-col gap-2.5 px-6 py-7 flex-1">
          <p className="font-medium text-[var(--fg-8b1e3f)] text-xs uppercase tracking-wide">{formatShortDate(p.createdAt, locale)}</p>
          <p className="font-medium text-[var(--fg-241f1d)] leading-[1.12] line-clamp-2 group-hover:text-[var(--fg-8b1e3f)] transition-colors"
            style={{ fontSize: 20, letterSpacing: '-0.6px' }}>
            {p.title}
          </p>
          <p className="font-normal text-[var(--fg-5a4f49)] text-base leading-normal line-clamp-3 mt-auto">
            {p.content.replace(/\n+/g, ' ').trim()}
          </p>
        </div>
      </div>
    </Link>
  )
}

// ── Empty state ──────────────────────────────────────────────────────────────
function EmptySlate({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center py-20 bg-[var(--bg-f5f2ef)] border border-[var(--line-black5)]">
      <p className="text-sm text-[var(--fg-a89888)]">{text}</p>
    </div>
  )
}

// ── Benefits data ────────────────────────────────────────────────────────────
const BENEFITS = [
  { key: 'spirituality', image: '/benefits/duhovnost.svg' },
  { key: 'family',       image: '/benefits/porodica.svg' },
  { key: 'society',      image: '/benefits/zajednica.svg' },
  { key: 'character',    image: '/benefits/karakter.svg' },
] as const


// ════════════════════════════════════════════════════════════════════════════
export default async function HomePage() {
  const locale = getLocale()
  const t = await getTranslations('home')
  const { predavanja, kuran, podcasts, posts, quotes } = await getData(locale)

  return (
    <div className="min-h-screen w-full bg-[var(--bg-ffffff)]">
      <MisaoDanaPopup />

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="bg-[var(--bg-ffffff)] w-full">
        <div className="max-w-[1440px] mx-auto w-full flex flex-col lg:flex-row items-stretch min-h-[520px] lg:min-h-[640px]">
          {/* Left panel */}
          <div className="bg-[var(--bg-faf7f2)] flex flex-col justify-end gap-16 lg:gap-20 px-6 sm:px-10 lg:px-[60px] py-16 lg:py-[104px] w-full lg:w-[55%] xl:w-[798px] shrink-0">
            <div className="flex flex-col gap-2">
              <p className={`text-base font-medium text-[var(--fg-141110)] text-center ${locale === 'ar' ? 'lg:text-right' : 'lg:text-left'}`}
                dir="rtl" style={{ fontFamily: "'Noto Sans Arabic', Manrope, sans-serif" }}>
                بسم الله الرحمن الرحيم
              </p>
              <div className="flex flex-col gap-6 mt-2">
                <h1 className="font-semibold text-[var(--fg-141110)]"
                  style={{ fontSize: 'clamp(32px, 5vw, 52px)', lineHeight: 1.3, letterSpacing: '-1.04px' }}>
                  {t('hero.title')}
                </h1>
                <p className="font-normal text-[var(--fg-5a4f49)]"
                  style={{ fontSize: 18, lineHeight: 1.5, letterSpacing: '-0.18px' }}>
                  {t('hero.text')}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/predavanja/duga"
                className="bg-[var(--bg-8b1e3f)] text-white flex items-center gap-2 ps-8 pe-6 py-3 text-base font-normal hover:bg-[var(--bg-7a1a37)] transition-colors">
                {t('hero.explore')}
                <ArrowUpRight />
              </Link>
              <Link href="/autori"
                className="border border-[var(--line-8b1e3f)] text-[var(--fg-8b1e3f)] px-6 py-3 text-base font-normal hover:bg-[var(--bg-faf5f5)] transition-colors">
                {t('hero.authors')}
              </Link>
            </div>
          </div>

          {/* Right: hero image */}
          <div className="relative flex-1 min-w-0 min-h-[300px] lg:min-h-0 overflow-hidden bg-[var(--bg-ede6db)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/hero.png" alt="" className="absolute inset-0 w-full h-full" style={{ objectFit: 'fill' }} />
          </div>
        </div>
      </section>

      {/* ── Benefits ─────────────────────────────────────────────────────── */}
      <section className="bg-[var(--bg-ffffff)] w-full">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20 py-16 lg:py-20 flex flex-col gap-14">
          <div className="flex flex-col gap-4 max-w-[705px]">
            <p className="font-medium text-[var(--fg-8b1e3f)] text-base">{t('benefits.tag')}</p>
            <div className="flex flex-col gap-6">
              <h2 className="font-semibold text-[var(--fg-141110)]"
                style={{ fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.3, letterSpacing: '-0.44px' }}>
                {t('benefits.title')}
              </h2>
              <p className="font-normal text-[var(--fg-746860)]"
                style={{ fontSize: 18, lineHeight: 1.5, letterSpacing: '-0.18px' }}>
                {t('benefits.text')}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {BENEFITS.map(b => (
              <div key={b.key} className="bg-[var(--bg-faf5f5)] flex flex-col gap-6 p-8" style={{ minHeight: 380 }}>
                <div className="flex-1 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={b.image} alt={t(`benefits.${b.key}.title`)} className="w-full h-full object-cover object-center" style={{ maxHeight: 220 }} />
                </div>
                <div className="flex flex-col gap-4 shrink-0">
                  <h3 className="font-medium text-[var(--fg-241f1d)]"
                    style={{ fontSize: 24, lineHeight: 1.12, letterSpacing: '-0.72px' }}>
                    {t(`benefits.${b.key}.title`)}
                  </h3>
                  <p className="font-normal text-[var(--fg-5a4f49)] text-base leading-normal">{t(`benefits.${b.key}.description`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────────────────────── */}
      <section className="bg-[var(--bg-fcfbfa)] w-full">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20 py-16 lg:py-20 flex flex-col gap-14">
          <div className="flex flex-col gap-4 max-w-[705px]">
            <p className="font-medium text-[var(--fg-8b1e3f)] text-base">{t('team.tag')}</p>
            <div className="flex flex-col gap-6">
              <h2 className="font-semibold text-[var(--fg-141110)]"
                style={{ fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.3, letterSpacing: '-0.44px' }}>
                {t('team.title')}
              </h2>
              <p className="font-normal text-[var(--fg-746860)]"
                style={{ fontSize: 18, lineHeight: 1.5, letterSpacing: '-0.18px' }}>
                {t('team.text')}
              </p>
            </div>
          </div>
          <GlasoviSection />
        </div>
      </section>

      {/* ── Misao dana ───────────────────────────────────────────────────── */}
      {quotes.length > 0 && <MisaoDana quotes={quotes} />}

      {/* ── Qur'an quote with background ─────────────────────────────────── */}
      <section className="relative w-full overflow-hidden">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/quote-bg.png" alt="" className="absolute inset-0 w-full h-full object-cover object-center" />
        </div>
        <div className="relative max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20 py-24 lg:py-32">
          <div className="max-w-[646px]">
            <blockquote className="font-medium text-[var(--fg-8b1e3f)] leading-[1.08]"
              style={{ fontSize: 'clamp(32px, 5vw, 64px)', letterSpacing: '-2.56px' }}>
              &ldquo;{t('verse.text')}&rdquo;
            </blockquote>
            <p className="font-medium text-[var(--fg-8b1e3f)] mt-8"
              style={{ fontSize: 'clamp(18px, 2vw, 24px)', lineHeight: 1.12, letterSpacing: '-0.72px' }}>
              {t('verse.source')}
            </p>
          </div>
        </div>
      </section>

      {/* ── Predavanja ───────────────────────────────────────────────────── */}
      <section className="bg-[var(--bg-ffffff)] w-full">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20 py-16 lg:py-20 flex flex-col gap-14">
          <SectionHead
            tag={t('lectures.tag')}
            title={t('lectures.title')}
            description={t('lectures.text')}
            cta={{ label: t('lectures.cta'), href: '/predavanja/duga' }}
          />
          {predavanja.length === 0
            ? <EmptySlate text={t('lectures.empty')} />
            : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {predavanja.map(v => <VideoCard key={v.id} v={v} locale={locale} />)}
              </div>
          }
        </div>
      </section>

      {/* ── Kur'an ───────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: 'var(--bg-fcfbfa)' }} className="w-full">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20 py-16 lg:py-20 flex flex-col gap-14">
          <SectionHead
            tag={t('quran.tag')}
            title={t('quran.title')}
            description={t('quran.text')}
            cta={{ label: t('quran.cta'), href: '/kuran' }}
          />
          {kuran.length === 0
            ? <EmptySlate text={t('quran.empty')} />
            : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {kuran.map(v => <VideoCard key={v.id} v={v} locale={locale} />)}
              </div>
          }
        </div>
      </section>

      {/* ── Podcast ──────────────────────────────────────────────────────── */}
      <section className="bg-[var(--bg-ffffff)] w-full">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20 py-16 lg:py-20 flex flex-col gap-14">
          <SectionHead
            tag={t('podcast.tag')}
            title={t('podcast.title')}
            description={t('podcast.text')}
            cta={{ label: t('podcast.cta'), href: '/podcasts' }}
          />
          {podcasts.length === 0
            ? <EmptySlate text={t('podcast.empty')} />
            : <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {podcasts.map(v => <VideoCard key={v.id} v={v} locale={locale} />)}
              </div>
          }
        </div>
      </section>

      {/* ── Blog ─────────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: 'var(--bg-fcfbfa)' }} className="w-full">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20 py-16 lg:py-20 flex flex-col gap-14">
          <SectionHead
            tag={t('blog.tag')}
            title={t('blog.title')}
            description={t('blog.text')}
            cta={{ label: t('blog.cta'), href: '/blog' }}
          />
          {posts.length === 0
            ? <EmptySlate text={t('blog.empty')} />
            : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map(p => <PostCard key={p.id} p={p} locale={locale} />)}
              </div>
          }
        </div>
      </section>


    </div>
  )
}
