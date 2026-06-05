import Link from 'next/link'
import { prisma } from '@/lib/db'
import MisaoDana from '@/components/MisaoDana'

export const dynamic = 'force-dynamic'

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec']
function fmtDate(d: string | Date) {
  const dt = new Date(d)
  return `${dt.getDate()}. ${MONTHS[dt.getMonth()]} ${dt.getFullYear()}.`
}

async function getData() {
  try {
    const [predavanja, kuran, podcasts, posts, quotes] = await Promise.all([
      prisma.video.findMany({ where: { published: true, category: 'predavanja' }, orderBy: { createdAt: 'desc' }, take: 3 }),
      prisma.video.findMany({ where: { published: true, category: 'kuran' }, orderBy: { createdAt: 'desc' }, take: 3 }),
      prisma.video.findMany({ where: { published: true, category: 'podcast' }, orderBy: { createdAt: 'desc' }, take: 2 }),
      prisma.blogPost.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' }, take: 3 }),
      prisma.quote.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' }, take: 8 }),
    ])
    return { predavanja, kuran, podcasts, posts, quotes }
  } catch {
    return { predavanja: [], kuran: [], podcasts: [], posts: [], quotes: [] }
  }
}

// ── Arrow icon (16 px) ───────────────────────────────────────────────────────
function ArrowUpRight() {
  return (
    <svg className="block shrink-0" width="16" height="16" fill="none" viewBox="0 0 11.5 11.5">
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
        <p className="font-medium text-[#8b1e3f] text-base">{tag}</p>
        <div className="flex flex-col gap-6">
          <h2 className="font-semibold text-[#141110]"
            style={{ fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.3, letterSpacing: '-0.44px' }}>
            {title}
          </h2>
          <p className="font-normal text-[#746860]"
            style={{ fontSize: 18, lineHeight: 1.5, letterSpacing: '-0.18px' }}>
            {description}
          </p>
        </div>
      </div>
      {cta && (
        <Link href={cta.href}
          className="bg-[#8b1e3f] text-white flex items-center gap-2 pl-8 pr-6 py-3 text-base font-normal shrink-0 hover:bg-[#7a1a37] transition-colors self-start lg:self-auto">
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

function VideoCard({ v }: { v: VideoRow }) {
  return (
    <Link href={`/videos/${v.id}`} className="group block h-full">
      <div className="bg-[#f5f2ef] overflow-hidden border border-black/5 flex flex-col h-full">
        <div className="relative h-[228px] w-full shrink-0 overflow-hidden">
          {v.thumbnailUrl
            ? <img alt={v.title} src={v.thumbnailUrl} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            : <div className="absolute inset-0 bg-[#e0d8d0] flex items-center justify-center">
                <span className="text-[#a89888] text-4xl">▶</span>
              </div>
          }
          <div className="absolute top-4 left-4 bg-[#faf5f5] px-2.5 py-1.5">
            <span className="text-[#8b1e3f] uppercase" style={{ fontSize: 10, letterSpacing: '0.3px' }}>
              {v.platform}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2.5 px-6 py-7 flex-1">
          <p className="font-medium text-[#8b1e3f] text-xs uppercase tracking-wide">{fmtDate(v.createdAt)}</p>
          <p className="font-medium text-[#241f1d] leading-[1.12] line-clamp-2 group-hover:text-[#8b1e3f] transition-colors"
            style={{ fontSize: 20, letterSpacing: '-0.6px' }}>
            {v.title}
          </p>
          {v.description && (
            <p className="font-normal text-[#5a4f49] text-base leading-normal line-clamp-2 mt-auto">{v.description}</p>
          )}
        </div>
      </div>
    </Link>
  )
}

// ── Content card for blog posts ──────────────────────────────────────────────
type PostRow = { id: number; title: string; content: string; imageUrl?: string | null; createdAt: string | Date }

function PostCard({ p }: { p: PostRow }) {
  return (
    <Link href={`/blog/${p.id}`} className="group block h-full">
      <div className="bg-[#f5f2ef] overflow-hidden border border-black/5 flex flex-col h-full">
        <div className="relative h-[228px] w-full shrink-0 overflow-hidden">
          {p.imageUrl
            ? <img alt={p.title} src={p.imageUrl} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            : <div className="absolute inset-0 bg-[#e0d8d0]" />
          }
        </div>
        <div className="flex flex-col gap-2.5 px-6 py-7 flex-1">
          <p className="font-medium text-[#8b1e3f] text-xs uppercase tracking-wide">{fmtDate(p.createdAt)}</p>
          <p className="font-medium text-[#241f1d] leading-[1.12] line-clamp-2 group-hover:text-[#8b1e3f] transition-colors"
            style={{ fontSize: 20, letterSpacing: '-0.6px' }}>
            {p.title}
          </p>
          <p className="font-normal text-[#5a4f49] text-base leading-normal line-clamp-3 mt-auto">
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
    <div className="flex items-center justify-center py-20 bg-[#f5f2ef] border border-black/5">
      <p className="text-sm text-[#a89888]">{text}</p>
    </div>
  )
}

// ── Benefits data ────────────────────────────────────────────────────────────
const BENEFITS = [
  {
    title: 'Duhovnost',
    description: 'Jačanje veze sa Allahom kroz znanje, ibadet i iskreno preispitivanje sebe.',
    image: '/benefits/duhovnost.svg',
  },
  {
    title: 'Porodica',
    description: 'Teme o zdravijim odnosima, snažnijim brakovima i odgoju djece.',
    image: '/benefits/porodica.svg',
  },
  {
    title: 'Društvo',
    description: 'Promišljanja o pitanjima koja oblikuju našu zajednicu i svakodnevni život.',
    image: '/benefits/zajednica.svg',
  },
  {
    title: 'Karakter',
    description: 'Razvijajte vrijednosti i navike koje oblikuju snažan, odgovoran i ispunjen život.',
    image: '/benefits/karakter.svg',
  },
]

// ── Team data ─────────────────────────────────────────────────────────────────
const TEAM = [
  { image: '/tim/hamdo-solo.jpg',          tag: "Kur'anske nauke i kiraeti", name: 'Hamdo Solo',          bio: "Kur'an, kiraeti i duhovni razvoj." },
  { image: '/tim/mubina-suljic-solo.jpg',  tag: 'Fikh i savremena pitanja', name: 'Mubina Suljić Solo',  bio: 'Ibadet, šerijatsko pravo i savremena pitanja muslimana.' },
  { image: '/tim/hamza-bajraktarevic.jpg', tag: 'Sira i islamska etika',    name: 'Hamza Bajraktarević', bio: 'Sira Poslanika ﷺ, islamska etika i životne lekcije.' },
  { image: '/tim/esma-klisura.jpg',        tag: 'Odgoj i obrazovanje',      name: 'Esma Klisura',        bio: 'Odgoj, obrazovanje i savremeni izazovi mladih.' },
]

// ════════════════════════════════════════════════════════════════════════════
export default async function HomePage() {
  const { predavanja, kuran, podcasts, posts, quotes } = await getData()

  return (
    <div className="min-h-screen w-full bg-white">

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="bg-white w-full">
        <div className="max-w-[1440px] mx-auto w-full flex flex-col lg:flex-row items-stretch min-h-[520px] lg:min-h-[640px]">
          {/* Left panel */}
          <div className="bg-[#faf7f2] flex flex-col justify-end gap-16 lg:gap-20 px-6 sm:px-10 lg:px-[60px] py-16 lg:py-[104px] w-full lg:w-[55%] xl:w-[798px] shrink-0">
            <div className="flex flex-col gap-2">
              <p className="text-base font-medium text-[#141110] text-center lg:text-left"
                dir="rtl" style={{ fontFamily: "'Noto Sans Arabic', Manrope, sans-serif" }}>
                بسم الله الرحمن الرحيم
              </p>
              <div className="flex flex-col gap-6 mt-2">
                <h1 className="font-semibold text-[#141110]"
                  style={{ fontSize: 'clamp(32px, 5vw, 52px)', lineHeight: 1.3, letterSpacing: '-1.04px' }}>
                  Svjetlo znanja za srce i razum.
                </h1>
                <p className="font-normal text-[#5a4f49]"
                  style={{ fontSize: 18, lineHeight: 1.5, letterSpacing: '-0.18px' }}>
                  Pažljivo odabrana predavanja, hutbe i sadržaji koji inspirišu
                  razum, oplemenjuju srce i približavaju vjeru svakodnevnici.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/predavanja/duga"
                className="bg-[#8b1e3f] text-white flex items-center gap-2 pl-8 pr-6 py-3 text-base font-normal hover:bg-[#7a1a37] transition-colors">
                Istraži sadržaj
                <ArrowUpRight />
              </Link>
              <Link href="/podcasts"
                className="border border-[#8b1e3f] text-[#8b1e3f] px-6 py-3 text-base font-normal hover:bg-[#faf5f5] transition-colors">
                Podcasti
              </Link>
            </div>
          </div>

          {/* Right: hero image */}
          <div className="relative flex-1 min-w-0 min-h-[300px] lg:min-h-0 overflow-hidden bg-[#ede6db]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/hero.png" alt="" className="absolute inset-0 w-full h-full object-cover object-top" />
          </div>
        </div>
      </section>

      {/* ── Benefits ─────────────────────────────────────────────────────── */}
      <section className="bg-white w-full">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20 py-16 lg:py-20 flex flex-col gap-14">
          <div className="flex flex-col gap-4 max-w-[705px]">
            <p className="font-medium text-[#8b1e3f] text-base">TEME KOJE ISTRAŽUJEMO</p>
            <div className="flex flex-col gap-6">
              <h2 className="font-semibold text-[#141110]"
                style={{ fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.3, letterSpacing: '-0.44px' }}>
                Znanje koje ostavlja trag
              </h2>
              <p className="font-normal text-[#746860]"
                style={{ fontSize: 18, lineHeight: 1.5, letterSpacing: '-0.18px' }}>
                Od duhovnosti i ibadeta, preko porodice i odgoja, do izazova savremenog
                društva — Misbah okuplja sadržaje koji pomažu razumjeti vjeru i živjeti
                njene vrijednosti u svakodnevici.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {BENEFITS.map(b => (
              <div key={b.title} className="bg-[#faf5f5] flex flex-col gap-6 p-8" style={{ minHeight: 380 }}>
                <div className="flex-1 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={b.image} alt={b.title} className="w-full h-full object-cover object-center" style={{ maxHeight: 220 }} />
                </div>
                <div className="flex flex-col gap-4 shrink-0">
                  <h3 className="font-medium text-[#241f1d]"
                    style={{ fontSize: 24, lineHeight: 1.12, letterSpacing: '-0.72px' }}>
                    {b.title}
                  </h3>
                  <p className="font-normal text-[#5a4f49] text-base leading-normal">{b.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────────────────────── */}
      <section className="bg-[#fcfbfa] w-full">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20 py-16 lg:py-20 flex flex-col gap-14">
          <div className="flex flex-col gap-4 max-w-[705px]">
            <p className="font-medium text-[#8b1e3f] text-base">LJUDI IZA SADRŽAJA</p>
            <div className="flex flex-col gap-6">
              <h2 className="font-semibold text-[#141110]"
                style={{ fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.3, letterSpacing: '-0.44px' }}>
                Glasovi koji dijele znanje
              </h2>
              <p className="font-normal text-[#746860]"
                style={{ fontSize: 18, lineHeight: 1.5, letterSpacing: '-0.18px' }}>
                Sadržaj na Misbahu nastaje kroz saradnju predavača, profesora, hafiza i
                stručnjaka koji svojim znanjem i iskustvom doprinose zajedničkoj misiji
                širenja korisnog znanja.
              </p>
            </div>
          </div>
          {/* Grid ensures all cards equal width and height per row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {TEAM.map(m => (
              <div key={m.name} className="flex flex-col overflow-hidden">
                <div className="relative w-full overflow-hidden shrink-0" style={{ height: 340 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt={m.name} src={m.image}
                    className="absolute inset-0 w-full h-full object-cover object-top" />
                </div>
                <div className="bg-[#f5f2ef] flex flex-col gap-3 p-4 flex-1">
                  <p className="font-medium text-[#8b1e3f] text-xs uppercase tracking-wide">{m.tag}</p>
                  <p className="font-medium text-[#241f1d]"
                    style={{ fontSize: 20, lineHeight: 1.12, letterSpacing: '-0.6px' }}>
                    {m.name}
                  </p>
                  <p className="font-normal text-[#5a4f49] text-base leading-normal">{m.bio}</p>
                </div>
              </div>
            ))}
          </div>
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
            <blockquote className="font-medium text-[#8b1e3f] leading-[1.08]"
              style={{ fontSize: 'clamp(32px, 5vw, 64px)', letterSpacing: '-2.56px' }}>
              &ldquo;I reci: Gospodaru moj, povećaj mi znanje.&rdquo;
            </blockquote>
            <p className="font-medium text-[#8b1e3f] mt-8"
              style={{ fontSize: 'clamp(18px, 2vw, 24px)', lineHeight: 1.12, letterSpacing: '-0.72px' }}>
              Kur&apos;an 20:114
            </p>
          </div>
        </div>
      </section>

      {/* ── Predavanja ───────────────────────────────────────────────────── */}
      <section className="bg-white w-full">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20 py-16 lg:py-20 flex flex-col gap-14">
          <SectionHead
            tag="NAJNOVIJI SADRŽAJI"
            title="Predavanja"
            description="Sadržaji koji povezuju islamsko znanje sa pitanjima i izazovima svakodnevnog života."
            cta={{ label: 'Pogledaj sva predavanja', href: '/predavanja/duga' }}
          />
          {predavanja.length === 0
            ? <EmptySlate text="Nema predavanja još uvijek" />
            : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {predavanja.map(v => <VideoCard key={v.id} v={v} />)}
              </div>
          }
        </div>
      </section>

      {/* ── Kur'an ───────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#fcfbfa' }} className="w-full">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20 py-16 lg:py-20 flex flex-col gap-14">
          <SectionHead
            tag="KUR'ANSKE NAUKE"
            title="Kur'an"
            description="Učenje, tumačenje i promišljanje kur'anskih ajeta kroz predavanja, tefsire i odabrane sadržaje."
            cta={{ label: "Istraži kur'anske sadržaje", href: '/kuran' }}
          />
          {kuran.length === 0
            ? <EmptySlate text="Nema Kur'an sadržaja još uvijek" />
            : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {kuran.map(v => <VideoCard key={v.id} v={v} />)}
              </div>
          }
        </div>
      </section>

      {/* ── Podcast ──────────────────────────────────────────────────────── */}
      <section className="bg-white w-full">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20 py-16 lg:py-20 flex flex-col gap-14">
          <SectionHead
            tag="RAZGOVORI"
            title="Podcast"
            description="Razgovori sa predavačima, stručnjacima i gostima o vjeri, društvu, odgoju i temama koje oblikuju naš svakodnevni život."
            cta={{ label: 'Poslušaj epizode', href: '/podcasts' }}
          />
          {podcasts.length === 0
            ? <EmptySlate text="Nema podcast epizoda još uvijek" />
            : <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {podcasts.map(v => <VideoCard key={v.id} v={v} />)}
              </div>
          }
        </div>
      </section>

      {/* ── Blog ─────────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#fcfbfa' }} className="w-full">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20 py-16 lg:py-20 flex flex-col gap-14">
          <SectionHead
            tag="PROMIŠLJANJA"
            title="Blog"
            description="Tekstovi, osvrti i razmišljanja o vjeri, znanju, porodici i izazovima savremenog čovjeka."
            cta={{ label: 'Čitaj sve tekstove', href: '/blog' }}
          />
          {posts.length === 0
            ? <EmptySlate text="Nema blog postova još uvijek" />
            : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map(p => <PostCard key={p.id} p={p} />)}
              </div>
          }
        </div>
      </section>


    </div>
  )
}
