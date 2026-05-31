import Link from 'next/link'
import { ArrowRight, Youtube, Instagram, Facebook, Play, BookOpen } from 'lucide-react'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'
import VideoCard from '@/components/VideoCard'
import BlogCard from '@/components/BlogCard'

const TikTokIcon = ({ size = 16 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: size, height: size }}>
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.25 8.25 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z" />
  </svg>
)

async function getData() {
  try {
    const [videos, posts] = await Promise.all([
      prisma.video.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' }, take: 6 }),
      prisma.blogPost.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' }, take: 3 }),
    ])
    return { videos, posts }
  } catch { return { videos: [], posts: [] } }
}

export default async function HomePage() {
  const { videos, posts } = await getData()

  return (
    <div>

      {/* ── Hero — rich burgundy, NOT black ─────────────────────────── */}
      <section
        className="relative overflow-hidden hero-pattern grain"
        style={{ background: '#8B1E3F' }}
      >
        <div className="hero-glow absolute inset-0 z-0 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-28 lg:py-36">
          <div className="max-w-2xl">
            <p className="font-mono text-xs tracking-[0.25em] mb-8 uppercase" style={{ color: '#E0C99A' }}>
              بسم الله الرحمن الرحيم
            </p>

            <h1 className="font-extrabold leading-[1.02] tracking-tight text-white mb-6"
              style={{ fontSize: 'clamp(2.8rem, 7.5vw, 5.2rem)' }}>
              Misbah
              <span style={{ color: '#C8A96B' }}> EDU</span>
            </h1>

            <p className="text-lg sm:text-xl font-light leading-relaxed mb-3 max-w-lg"
              style={{ color: 'rgba(255,255,255,0.72)' }}>
              Islamska predavanja i sadržaj
            </p>
            <p className="font-mono text-xs tracking-widest mb-12"
              style={{ color: 'rgba(255,255,255,0.35)' }}>
              Islamska predavanja · Bosna i Hercegovina
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/videos"
                className="inline-flex items-center gap-2 font-semibold text-sm px-6 py-3 text-white transition-colors bg-brand-dark hover:bg-brand"
                style={{ borderRadius: 8 }}>
                <Play size={15} fill="currentColor" />
                Gledaj predavanja
              </Link>
              <Link href="/blog"
                className="inline-flex items-center gap-2 font-medium text-sm px-6 py-3 transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.22)', borderRadius: 8, color: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(4px)' }}>
                <BookOpen size={15} />
                Čitaj blog
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-6 mt-12"
              style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24 }}>
              {[
                { href: 'https://www.youtube.com/@misbah_ba',    Icon: Youtube,    label: 'YouTube' },
                { href: 'https://www.instagram.com/misbah_bih/', Icon: Instagram,  label: 'Instagram' },
                { href: 'https://www.tiktok.com/@misbah_ba',     Icon: TikTokIcon, label: 'TikTok' },
                { href: 'https://www.facebook.com/MisbahBIH/',   Icon: Facebook,   label: 'Facebook' },
              ].map(s => (
                <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 font-mono text-xs tracking-wide transition-opacity hover:opacity-100"
                  style={{ color: 'rgba(255,255,255,0.45)' }}>
                  <s.Icon size={13} /> {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Straight fade — no wave — to body background */}
        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, #F5F2EF)' }} />
      </section>

      {/* ── Latest Videos ──────────────────────────────────────────────── */}
      <section style={{ background: '#F5F2EF' }} className="py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeader eyebrow="Najnovija" title="Predavanja" href="/videos" show={videos.length > 0} />
          {videos.length === 0
            ? <EmptySlate icon={<Play size={36} />} text="Nema predavanja još uvijek" />
            : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map(v => (
                  <VideoCard key={v.id} id={v.id} title={v.title} description={v.description}
                    platform={v.platform} thumbnailUrl={v.thumbnailUrl} isShortForm={v.isShortForm} createdAt={v.createdAt} />
                ))}
              </div>
          }
          {videos.length > 0 && (
            <div className="mt-10 text-center">
              <Link href="/videos"
                className="inline-flex items-center gap-2 font-semibold text-sm transition-colors text-brand hover:text-brand-light">
                Vidi sva predavanja <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Warm divider */}
      <div style={{ height: 1, background: '#D6CCC3', margin: '0 3rem' }} />

      {/* ── Latest Blog ─────────────────────────────────────────────────── */}
      {/* Slightly different warm beige section for visual rhythm */}
      <section style={{ background: '#F6EFE7' }} className="py-24 px-6 lg:px-8">
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
              <Link href="/blog"
                className="inline-flex items-center gap-2 font-semibold text-sm transition-colors text-brand hover:text-brand-light">
                Vidi sve postove <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Social CTA — warm beige, NOT black ─────────────────────────── */}
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
