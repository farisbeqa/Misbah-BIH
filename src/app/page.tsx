import Link from 'next/link'
import { ArrowRight, Youtube, Instagram, Facebook, Play, BookOpen, MapPin } from 'lucide-react'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'
import VideoCard from '@/components/VideoCard'
import BlogCard from '@/components/BlogCard'
import QuoteCarousel from '@/components/QuoteCarousel'

const TikTokIcon = ({ size = 16 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: size, height: size }}>
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.25 8.25 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z" />
  </svg>
)
// TikTokIcon used in Social CTA section below

async function getData() {
  try {
    const [predavanja, kuran, podcasts, posts, activities, quotes] = await Promise.all([
      prisma.video.findMany({ where: { published: true, category: 'predavanja' }, orderBy: { createdAt: 'desc' }, take: 6 }),
      prisma.video.findMany({ where: { published: true, category: 'kuran' }, orderBy: { createdAt: 'desc' }, take: 3 }),
      prisma.video.findMany({ where: { published: true, category: 'podcast' }, orderBy: { createdAt: 'desc' }, take: 3 }),
      prisma.blogPost.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' }, take: 3 }),
      prisma.activity.findMany({ where: { published: true }, orderBy: { date: 'desc' }, take: 3 }),
      prisma.quote.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' } }),
    ])
    return { predavanja, kuran, podcasts, posts, activities, quotes }
  } catch { return { predavanja: [], kuran: [], podcasts: [], posts: [], activities: [], quotes: [] } }
}

export default async function HomePage() {
  const { predavanja, kuran, podcasts, posts, activities, quotes } = await getData()

  return (
    <div>

      {/* Hero - Desktop */}
      <section className="hidden lg:block bg-[#faf7f2] px-5 pb-5">
        <div className="flex items-stretch w-full max-w-[1400px] mx-auto">
          {/* Left: cream content panel */}
          <div className="bg-[#faf7f2] flex flex-col justify-end gap-20 shrink-0"
            style={{ width: '57%', paddingLeft: 60, paddingRight: 60, paddingTop: 104, paddingBottom: 104 }}>
            {/* Bismillah */}
            <div className="flex flex-col gap-2">
              <p className="text-[#141110] text-[16px] text-center"
                dir="rtl" style={{ fontFamily: "Manrope, 'Noto Sans Arabic', sans-serif", fontWeight: 500 }}>
                بسم الله الرحمن الرحيم
              </p>
              <div className="flex flex-col gap-6 mt-2">
                <h1 className="text-[#141110]"
                  style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 600,
                    fontSize: 'clamp(28px, 3.2vw, 52px)', lineHeight: 1.3,
                    letterSpacing: 'clamp(-0.28px, -0.08vw, -1.04px)' }}>
                  Svjetlo znanja za srce i razum.
                </h1>
                <p className="text-[#5a4f49]"
                  style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 400,
                    fontSize: 'clamp(15px, 1.2vw, 18px)', lineHeight: 1.5, letterSpacing: '-0.18px' }}>
                  Pažljivo odabrana predavanja, hutbe i sadržaji koji inspirišu razum, oplemenjuju srce i približavaju vjeru svakodnevnici.
                </p>
              </div>
            </div>
            {/* Buttons */}
            <div className="flex gap-4 items-center flex-wrap">
              <Link href="/predavanja/duga"
                className="bg-[#8b1e3f] text-white flex items-center gap-1 pl-8 pr-6 py-3 text-[16px] hover:opacity-90 transition-opacity"
                style={{ fontFamily: 'Manrope, sans-serif' }}>
                Gledaj predavanja
                <span className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                  <svg width="12" height="12" viewBox="0 0 11.5 11.5" fill="none">
                    <path d="M0.75 10.75L10.75 0.75M10.75 10.75V0.75H0.75" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
              <Link href="/blog"
                className="border border-[#8b1e3f] text-[#8b1e3f] px-6 py-3 text-[16px] hover:bg-[#8b1e3f] hover:text-white transition-colors"
                style={{ fontFamily: 'Manrope, sans-serif' }}>
                Čitaj blog
              </Link>
            </div>
          </div>
          {/* Right: hero image */}
          <div className="flex-1 relative overflow-hidden" style={{ minHeight: 500 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/hero.png" alt=""
              className="absolute w-full object-cover object-center"
              style={{ top: '-34.32%', height: '134.25%' }} />
          </div>
        </div>
      </section>

      {/* Hero - Mobile */}
      <section className="lg:hidden bg-[#faf7f2] px-2 pb-2">
        <div className="flex flex-col w-full">
          <div className="bg-[#faf7f2] px-3 flex flex-col gap-14"
            style={{ paddingTop: 60, paddingBottom: 40 }}>
            <div className="flex flex-col gap-2">
              <p className="text-[#141110] text-[16px] text-center"
                dir="rtl" style={{ fontFamily: "Manrope, 'Noto Sans Arabic', sans-serif", fontWeight: 500 }}>
                بسم الله الرحمن الرحيم
              </p>
              <div className="flex flex-col gap-5 mt-2">
                <h1 className="text-[#141110]"
                  style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 600,
                    fontSize: 'clamp(24px, 7vw, 32px)', lineHeight: 1.3, letterSpacing: '-0.28px' }}>
                  Svjetlo znanja za srce i razum.
                </h1>
                <p className="text-[#5a4f49] text-[15px] leading-relaxed"
                  style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Pažljivo odabrana predavanja, hutbe i sadržaji koji inspirišu razum, oplemenjuju srce i približavaju vjeru svakodnevnici.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-center flex-wrap">
              <Link href="/predavanja/duga"
                className="bg-[#8b1e3f] text-white flex items-center gap-1 pl-7 pr-5 py-3 text-[15px] hover:opacity-90 transition-opacity"
                style={{ fontFamily: 'Manrope, sans-serif' }}>
                Gledaj predavanja
                <svg width="12" height="12" viewBox="0 0 11.5 11.5" fill="none">
                  <path d="M0.75 10.75L10.75 0.75M10.75 10.75V0.75H0.75" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link href="/blog"
                className="border border-[#8b1e3f] text-[#8b1e3f] px-5 py-3 text-[15px] hover:bg-[#8b1e3f] hover:text-white transition-colors"
                style={{ fontFamily: 'Manrope, sans-serif' }}>
                Čitaj blog
              </Link>
            </div>
          </div>
          <div className="relative overflow-hidden w-full" style={{ height: 326 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/hero.png" alt=""
              className="absolute w-full object-cover"
              style={{ top: '-54%', height: '154%' }} />
          </div>
        </div>
      </section>

      {/* ── Latest Predavanja ──────────────────────────────────────────── */}
      <section style={{ background: '#F5F2EF' }} className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeader eyebrow="Najnovija" title="Predavanja" href="/videos" show={predavanja.length > 0} />
          {predavanja.length === 0
            ? <EmptySlate icon={<Play size={36} />} text="Nema predavanja još uvijek" />
            : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {predavanja.map(v => (
                  <VideoCard key={v.id} id={v.id} title={v.title} description={v.description}
                    platform={v.platform} thumbnailUrl={v.thumbnailUrl} isShortForm={v.isShortForm} createdAt={v.createdAt} />
                ))}
              </div>
          }
          {predavanja.length > 0 && (
            <div className="mt-10 text-center">
              <Link href="/videos" className="inline-flex items-center gap-2 font-semibold text-sm transition-colors text-brand hover:text-brand-light">
                Vidi sva predavanja <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </section>

      <div style={{ height: 1, background: '#D6CCC3', margin: '0 2rem' }} />

      {/* ── Latest Kur'an ──────────────────────────────────────────────── */}
      <section style={{ background: '#F6EFE7' }} className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeader eyebrow="Najnovije" title="Kur'an" href="/kuran" show={kuran.length > 0} />
          {kuran.length === 0
            ? <EmptySlate icon={<BookOpen size={36} />} text="Nema Kur'an sadržaja još uvijek" />
            : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {kuran.map(v => (
                  <VideoCard key={v.id} id={v.id} title={v.title} description={v.description}
                    platform={v.platform} thumbnailUrl={v.thumbnailUrl} isShortForm={v.isShortForm} createdAt={v.createdAt} />
                ))}
              </div>
          }
          {kuran.length > 0 && (
            <div className="mt-10 text-center">
              <Link href="/kuran" className="inline-flex items-center gap-2 font-semibold text-sm transition-colors text-brand hover:text-brand-light">
                Vidi sve Kur'an snimke <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </section>

      <div style={{ height: 1, background: '#D6CCC3', margin: '0 2rem' }} />

      {/* ── Latest Podcasts ─────────────────────────────────────────────── */}
      <section style={{ background: '#F5F2EF' }} className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeader eyebrow="Najnoviji" title="Podcasts" href="/podcasts" show={podcasts.length > 0} />
          {podcasts.length === 0
            ? <EmptySlate icon={<Play size={36} />} text="Nema podcast epizoda još uvijek" />
            : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {podcasts.map(v => (
                  <VideoCard key={v.id} id={v.id} title={v.title} description={v.description}
                    platform={v.platform} thumbnailUrl={v.thumbnailUrl} isShortForm={v.isShortForm} createdAt={v.createdAt} />
                ))}
              </div>
          }
          {podcasts.length > 0 && (
            <div className="mt-10 text-center">
              <Link href="/podcasts" className="inline-flex items-center gap-2 font-semibold text-sm transition-colors text-brand hover:text-brand-light">
                Vidi sve podcast epizode <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </section>

      <div style={{ height: 1, background: '#D6CCC3', margin: '0 2rem' }} />

      {/* ── Latest Blog ─────────────────────────────────────────────────── */}
      <section style={{ background: '#F6EFE7' }} className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeader eyebrow="Najnoviji" title="Blog" href="/blog" show={posts.length > 0} />
          {posts.length === 0
            ? <EmptySlate icon={<BookOpen size={36} />} text="Nema blog postova još uvijek" />
            : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map(p => (
                  <BlogCard key={p.id} id={p.id} title={p.title} content={p.content}
                    imageUrl={p.imageUrl} createdAt={p.createdAt} />
                ))}
              </div>
          }
          {posts.length > 0 && (
            <div className="mt-10 text-center">
              <Link href="/blog" className="inline-flex items-center gap-2 font-semibold text-sm transition-colors text-brand hover:text-brand-light">
                Vidi sve postove <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </section>

      <div style={{ height: 1, background: '#D6CCC3', margin: '0 2rem' }} />

      {/* ── Latest Aktivnosti ───────────────────────────────────────────── */}
      {activities.length > 0 && (
        <section style={{ background: '#F5F2EF' }} className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <SectionHeader eyebrow="Zajednica" title="Aktivnosti" href="/aktivnosti" show={true} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities.map(a => (
                <Link key={a.id} href={`/aktivnosti/${a.id}`} className="group block">
                  <article className="h-full flex flex-col overflow-hidden transition-all duration-200 group-hover:-translate-y-0.5 shadow-card group-hover:shadow-card-hover"
                    style={{ background: '#FAF7F2', border: '1px solid #E8E1DB', borderRadius: 8 }}>
                    {a.imageUrl ? (
                      <div className="overflow-hidden flex-shrink-0" style={{ borderRadius: '8px 8px 0 0', aspectRatio: '16/9' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={a.imageUrl} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                    ) : (
                      <div className="flex-shrink-0 flex items-center justify-center" style={{ borderRadius: '8px 8px 0 0', aspectRatio: '16/9', background: 'linear-gradient(135deg,#8B1E3F,#5E1028)' }}>
                        <MapPin size={32} className="text-white/40" />
                      </div>
                    )}
                    <div className="px-4 py-4">
                      <h3 className="font-bold text-[15px] leading-snug group-hover:text-brand transition-colors line-clamp-2" style={{ color: '#241F1D' }}>
                        {a.title}
                      </h3>
                      <p className="text-sm line-clamp-2 mt-1.5" style={{ color: '#978A81' }}>
                        {a.content.replace(/\n+/g, ' ').trim()}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href="/aktivnosti" className="inline-flex items-center gap-2 font-semibold text-sm transition-colors text-brand hover:text-brand-light">
                Vidi sve aktivnosti <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Misao dana ──────────────────────────────────────────────────── */}
      {quotes.length > 0 && (
        <section style={{ background: '#FAF7F2', borderTop: '1px solid #E8E1DB' }} className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <p className="font-mono text-[11px] text-brand-light uppercase tracking-widest mb-3">
                Inspirisani Kur&apos;anom i Miljenikom
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-warm-900 tracking-tight">
                Misao dana
              </h2>
            </div>
            <QuoteCarousel quotes={quotes} />
          </div>
        </section>
      )}

      {/* ── Social CTA - warm beige, NOT black ─────────────────────────── */}
      <section style={{ background: '#E7D6C7', borderTop: '1px solid #CDB8A6' }} className="py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="font-mono text-[11px] uppercase tracking-widest mb-4" style={{ color: '#8B1E3F' }}>
            Prati nas
          </p>
          <h2 className="font-extrabold text-2xl sm:text-3xl tracking-tight mb-3" style={{ color: '#241F1D' }}>
            Misbah EDU na svim platformama
          </h2>
          <p className="font-mono text-xs mb-10 tracking-wide" style={{ color: '#746860' }}>
            Dugi sadržaj na YouTubeu · Kratki sadržaj na Instagramu, TikToku i Facebooku
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { href: 'https://www.youtube.com/@misbah_ba',    Icon: Youtube,    label: 'YouTube',   bg: '#dc2626' },
              { href: 'https://www.instagram.com/misbah_bih/', Icon: Instagram,  label: 'Instagram', bg: '#9333ea' },
              { href: 'https://www.tiktok.com/@misbah_ba',     Icon: TikTokIcon, label: 'TikTok',    bg: '#3F3733' },
              { href: 'https://www.facebook.com/MisbahBIH/',   Icon: Facebook,   label: 'Facebook',  bg: '#2563eb' },
            ].map(s => (
              <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white font-semibold px-5 py-2.5 text-sm transition-opacity hover:opacity-85"
                style={{ background: s.bg, borderRadius: 8 }}>
                <s.Icon size={15} /> {s.label}
              </a>
            ))}
          </div>
          <div className="mt-8 pt-8" style={{ borderTop: '1px solid #CDB8A6' }}>
            <p className="font-mono text-xs text-warm-500 mb-3 tracking-wide">Podržite naš rad</p>
            <Link href="/donacije"
              className="inline-flex items-center gap-2 font-semibold px-6 py-3 text-sm transition-all hover:opacity-90"
              style={{ background: '#8B1E3F', color: 'white', borderRadius: 8 }}>
              ❤ Donirajte
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function SectionHeader({ eyebrow, title, href, show }: { eyebrow: string; title: string; href: string; show: boolean }) {
  return (
    <div className="flex items-end justify-between mb-10">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-widest mb-2 text-brand-light">{eyebrow}</p>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: '#241F1D' }}>{title}</h2>
      </div>
      {show && (
        <Link href={href}
          className="hidden sm:flex items-center gap-1.5 font-mono text-xs transition-colors text-warm-500 hover:text-brand"
          style={{ color: '#978A81' }}>
          Vidi sve <ArrowRight size={12} />
        </Link>
      )}
    </div>
  )
}

function EmptySlate({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-warm-300"
      style={{ background: '#FAF7F2', border: '1px dashed #D6CCC3', borderRadius: 8 }}>
      <span style={{ color: '#D6CCC3' }}>{icon}</span>
      <p className="text-sm mt-3 font-mono" style={{ color: '#978A81' }}>{text}</p>
    </div>
  )
}
