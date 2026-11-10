import { Suspense, type ReactNode } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  allPaths, AUD, BASE, CONTACT, DRUZENJA_OFFER, DRUZENJA_PHOTOS, DRUZENJA_VIDS, HOR, IMG, MEN, PEOPLE, STATS, VIDEO,
  type Audience, type HorKey,
} from '@/lib/pozovite'
import { ContactQuick, HeroVideo, InquiryForm, ProfileInvite, TileVideo, VideoGrid } from '../ui'

// Built from the "Pozovite nas" mini-site, laid out with the same pieces as the
// rest of misbah-edu.com (home hero, section heads, cards, buttons).

export const dynamicParams = false

export function generateStaticParams() {
  return allPaths().map(slug => ({ slug }))
}

interface Crumb { href: string; label: string }

/** Resolves /pozovite-nas/... to its view; null = 404 */
function resolve(slug: string[]): { crumbs: Crumb[]; title: string; body: ReactNode } | null {
  const [a, b, c] = slug
  const home = { href: BASE, label: 'Pozovite nas' }
  if (!a) return { crumbs: [home], title: 'Pozovite nas', body: <Home /> }

  if (a === 'predavanja') {
    const pred = { href: `${BASE}/predavanja`, label: 'Predavanja' }
    if (!b) return { crumbs: [home, pred], title: 'Predavanja', body: <Predavanja /> }
    if (b === 'zene') {
      return { crumbs: [home, pred, { href: `${BASE}/predavanja/zene`, label: AUD.zene.t }], title: PEOPLE.mubina.n, body: <Profile aud="zene" id="mubina" back={pred} /> }
    }
    if (b !== 'muskarci' && b !== 'dzemat') return null
    const aud = { href: `${BASE}/predavanja/${b}`, label: AUD[b].t }
    if (!c) return { crumbs: [home, pred, aud], title: `Predavanja · ${AUD[b].t}`, body: <Lecturers aud={b} /> }
    if (!MEN.includes(c)) return null
    return { crumbs: [home, pred, aud, { href: `${BASE}/predavanja/${b}/${c}`, label: PEOPLE[c].n }], title: PEOPLE[c].n, body: <Profile aud={b} id={c} back={aud} /> }
  }

  if (a === 'hor') {
    const hor = { href: `${BASE}/hor`, label: 'Hor' }
    if (!b) return { crumbs: [home, hor], title: 'Hor Misbah', body: <Hor /> }
    if (!(b in HOR)) return null
    const k = b as HorKey
    return { crumbs: [home, hor, { href: `${BASE}/hor/${k}`, label: HOR[k].t }], title: HOR[k].t, body: <HorOne k={k} /> }
  }

  if (a === 'druzenja') return { crumbs: [home, { href: `${BASE}/druzenja`, label: 'Omladinska druženja' }], title: 'Omladinska druženja', body: <Druzenja /> }
  if (a === 'kontakt') return { crumbs: [home, { href: `${BASE}/kontakt`, label: 'Upit' }], title: 'Upit za nastup', body: <Kontakt /> }
  return null
}

export function generateMetadata({ params }: { params: { slug?: string[] } }): Metadata {
  const r = resolve(params.slug ?? [])
  if (!r) return {}
  return {
    title: r.title === 'Pozovite nas' ? 'Pozovite nas — Misbah EDU' : `${r.title} — Pozovite nas — Misbah EDU`,
    description: 'Misbah EDU: predavanja, Hor Misbah i omladinska druženja. Izaberite program i pozovite nas u svoj džemat, školu ili zajednicu.',
    openGraph: { images: [IMG('p/showreel.jpg')] },
  }
}

export default function PozoviteNasPage({ params }: { params: { slug?: string[] } }) {
  const r = resolve(params.slug ?? [])
  if (!r) notFound()
  const isHome = r.crumbs.length === 1
  const isInquiry = params.slug?.[0] === 'kontakt'
  return (
    <div className="min-h-screen w-full bg-white">
      {isHome ? null : <Crumbs crumbs={r.crumbs} />}
      {r.body}
      {isInquiry ? null : <InviteSection />}
    </div>
  )
}

// ── Site building blocks (as on the home page) ──────────────────────────────

const WRAP = 'max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20'

function ArrowUpRight() {
  return (
    <svg className="block shrink-0" width="16" height="16" fill="none" viewBox="0 0 11.5 11.5" aria-hidden="true">
      <path d="M0.75 10.75L10.75 0.75M10.75 10.75V0.75H0.75" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  )
}

function PrimaryLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href}
      className="bg-[#8b1e3f] text-white flex items-center gap-2 pl-8 pr-6 py-3 text-base font-normal shrink-0 hover:bg-[#7a1a37] transition-colors self-start">
      {children}
      <ArrowUpRight />
    </Link>
  )
}

function OutlineLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="border border-[#8b1e3f] text-[#8b1e3f] px-6 py-3 text-base font-normal hover:bg-[#faf5f5] transition-colors">
      {children}
    </Link>
  )
}

function Section({ children, bg = 'bg-white' }: { children: ReactNode; bg?: string }) {
  return (
    <section className={`${bg} w-full`}>
      <div className={`${WRAP} py-16 lg:py-20 flex flex-col gap-14`}>{children}</div>
    </section>
  )
}

function SectionHead({ back, tag, title, description, cta }: {
  back?: Crumb; tag: string; title: string; description?: string; cta?: ReactNode
}) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
      <div className="flex flex-col gap-4 max-w-[705px]">
        {back ? (
          <Link href={back.href} className="inline-flex items-center gap-1 self-start text-sm text-[#746860] hover:text-[#8b1e3f]">
            <ChevronLeft size={16} /> {back.label}
          </Link>
        ) : null}
        <p className="font-medium text-[#8b1e3f] text-base uppercase">{tag}</p>
        <div className="flex flex-col gap-6">
          <h1 className="font-semibold text-[#141110]" style={{ fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.3, letterSpacing: '-0.44px' }}>
            {title}
          </h1>
          {description ? (
            <p className="font-normal text-[#746860]" style={{ fontSize: 18, lineHeight: 1.5, letterSpacing: '-0.18px' }}>{description}</p>
          ) : null}
        </div>
      </div>
      {cta}
    </div>
  )
}

function Crumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Putanja" className="bg-[#faf7f2] border-b border-[#ede5dc]">
      <ol className={`${WRAP} flex items-center gap-1.5 py-3 text-sm overflow-x-auto whitespace-nowrap`}>
        {crumbs.map((c, i) => (
          <li key={c.href} className="flex items-center gap-1.5 shrink-0">
            {i > 0 ? <ChevronRight size={14} className="text-[#a89888]" aria-hidden="true" /> : null}
            {i === crumbs.length - 1
              ? <span aria-current="page" className="text-[#8b1e3f] font-medium">{c.label}</span>
              : <Link href={c.href} className="text-[#746860] hover:text-[#8b1e3f]">{c.label}</Link>}
          </li>
        ))}
      </ol>
    </nav>
  )
}

/** Card with a picture on top and text below (like the site's video and team cards) */
function Card({ href, tag, title, description, img, video, footer, tall = false }: {
  href: string; tag: string; title: string; description: string; img: string; video?: string; footer?: string; tall?: boolean
}) {
  return (
    <Link href={href} className="group flex flex-col overflow-hidden h-full">
      <div className="relative w-full overflow-hidden shrink-0 bg-[#e0d8d0]" style={{ height: tall ? 340 : 240 }}>
        {video ? <TileVideo src={VIDEO(video)} poster={IMG(img)} /> : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={IMG(img)} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300" />
        )}
      </div>
      <div className="bg-[#f5f2ef] flex flex-col gap-3 p-6 flex-1">
        <p className="font-medium text-[#8b1e3f] text-xs uppercase tracking-wide">{tag}</p>
        <p className="font-medium text-[#241f1d] group-hover:text-[#8b1e3f] transition-colors" style={{ fontSize: 24, lineHeight: 1.12, letterSpacing: '-0.72px' }}>
          {title}
        </p>
        <p className="font-normal text-[#5a4f49] text-base leading-normal">{description}</p>
        {footer ? <p className="font-medium text-[#8b1e3f] text-sm mt-auto pt-1">{footer} →</p> : null}
      </div>
    </Link>
  )
}

/** Closing call to action */
function InviteSection() {
  return (
    <Section bg="bg-[#fcfbfa]">
      <SectionHead tag="POZOVITE NAS" title="Dovedite Misbah u svoju zajednicu"
        description="Pišite nam s datumom, mjestom i vrstom programa, pa ćemo zajedno dogovoriti detalje."
        cta={
          <div className="flex flex-wrap gap-4 self-start lg:self-auto">
            <PrimaryLink href={`${BASE}/kontakt`}>Pošaljite upit</PrimaryLink>
            <a href={`mailto:${CONTACT.email}`} className="border border-[#8b1e3f] text-[#8b1e3f] px-6 py-3 text-base font-normal hover:bg-[#faf5f5] transition-colors">
              {CONTACT.email}
            </a>
          </div>
        } />
    </Section>
  )
}

const count = (n: number, one: string, few: string, many: string) => {
  const m10 = n % 10, m100 = n % 100
  return `${n} ${m10 === 1 && m100 !== 11 ? one : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? few : many}`
}

// ── Views ───────────────────────────────────────────────────────────────────

function Home() {
  return (
    <>
      {/* Hero, as on the home page: text panel left, showreel right */}
      <section className="bg-white w-full">
        <div className="max-w-[1440px] mx-auto w-full flex flex-col lg:flex-row items-stretch min-h-[520px] lg:min-h-[640px]">
          <div className="bg-[#faf7f2] flex flex-col justify-end gap-16 lg:gap-20 px-6 sm:px-10 lg:px-[60px] py-16 lg:py-[104px] w-full lg:w-[55%] xl:w-[798px] shrink-0">
            <div className="flex flex-col gap-2">
              <p className="text-base font-medium text-[#141110] text-center lg:text-left" dir="rtl"
                style={{ fontFamily: "'Noto Sans Arabic', Manrope, sans-serif" }}>
                بسم الله الرحمن الرحيم
              </p>
              <div className="flex flex-col gap-6 mt-2">
                <p className="font-medium text-[#8b1e3f] text-base uppercase">Pozovite nas · Omladinska inicijativa · Sarajevo · od 2022.</p>
                <h1 className="font-semibold text-[#141110]" style={{ fontSize: 'clamp(32px, 5vw, 52px)', lineHeight: 1.3, letterSpacing: '-1.04px' }}>
                  Svjetlo znanja, uživo u vašoj zajednici
                </h1>
                <p className="font-normal text-[#5a4f49]" style={{ fontSize: 18, lineHeight: 1.5, letterSpacing: '-0.18px' }}>
                  Mladi hafizi, imami i predavači. Izaberite šta želite ugostiti, a mi dolazimo u vaš džemat, školu ili na vašu manifestaciju.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <PrimaryLink href={`${BASE}/kontakt`}>Pošaljite upit</PrimaryLink>
              <OutlineLink href={`${BASE}/predavanja`}>Predavanja</OutlineLink>
            </div>
          </div>
          <div className="relative flex-1 min-w-0 min-h-[300px] lg:min-h-0 overflow-hidden bg-[#ede6db]">
            <HeroVideo src={VIDEO('v/showreel.mp4')} poster={IMG('p/showreel.jpg')} />
          </div>
        </div>
      </section>

      <Section>
        <SectionHead tag="ŠTA NUDIMO" title="Izaberite šta želite ugostiti"
          description="Predavanja za muškarce, žene i cijeli džemat, Hor Misbah i omladinska druženja s predavanjima, radionicama i kvizovima." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card href={`${BASE}/predavanja`} tag="Za muškarce · za žene · za džemat" title="Predavanja" img="p/hamdo-tin.jpg"
            description="Izaberite publiku, predavača i vrstu programa: predavanje, edukaciju, radionicu ili višednevnu edukaciju." footer="Izaberite predavanje" />
          <Card href={`${BASE}/hor`} tag="Muški · ženski · miješani" title="Hor" img="p/hor-maljevac.jpg"
            description="Ilahije i kaside uz defove za otvorenja džamija, mevlude, iftare i svečanosti." footer="Izaberite hor" />
          <Card href={`${BASE}/druzenja`} tag="Predavanja · radionice · kvizovi" title="Omladinska druženja" img="p/zagreb.jpg"
            description="Edukativna predavanja, interaktivne radionice i kvizovi znanja za mlade." footer="Saznajte više" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map(s => (
            <div key={s.t} className="bg-[#faf5f5] px-6 py-6 flex flex-col gap-1">
              <span className="font-semibold text-[#8b1e3f]" style={{ fontSize: 'clamp(26px, 3vw, 36px)', letterSpacing: '-0.5px' }}>{s.n}</span>
              <span className="text-[#5a4f49]">{s.t}</span>
            </div>
          ))}
        </div>
      </Section>
    </>
  )
}

function Predavanja() {
  return (
    <Section>
      <SectionHead back={{ href: BASE, label: 'Pozovite nas' }} tag="PREDAVANJA" title="Za koga pripremamo program?"
        description="Izaberite publiku. Zatim birate predavača i vrstu programa." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {(Object.keys(AUD) as Audience[]).map(k => (
          <Card key={k} href={`${BASE}/predavanja/${k}`} tag="Predavanja" title={AUD[k].t} description={AUD[k].d} img={AUD[k].img}
            footer={k === 'zene' ? '1 predavačica' : count(MEN.length, 'predavač', 'predavača', 'predavača')} />
        ))}
      </div>
    </Section>
  )
}

function Lecturers({ aud }: { aud: 'muskarci' | 'dzemat' }) {
  const a = AUD[aud]
  return (
    <Section>
      <SectionHead back={{ href: `${BASE}/predavanja`, label: 'Predavanja' }} tag={`PREDAVANJA · ${a.t.toUpperCase()}`} title="Izaberite predavača"
        description={`${a.d} Na profilu predavača birate vrstu programa i šaljete upit.`} />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {MEN.map(id => {
          const p = PEOPLE[id]
          return (
            <Card key={id} href={`${BASE}/predavanja/${aud}/${id}`} tag={p.r} title={p.n} description={p.bio} img={p.img} tall
              footer={p.vids.length ? count(p.vids.length, 'video', 'videa', 'videa') : 'Snimci uskoro'} />
          )
        })}
      </div>
    </Section>
  )
}

function Profile({ aud, id, back }: { aud: Audience; id: string; back: Crumb }) {
  const p = PEOPLE[id]
  const short = p.vids.filter(v => v.kind === 'reel' || v.kind === 'short')
  const long = p.vids.filter(v => v.kind !== 'reel' && v.kind !== 'short')
  const path = aud === 'zene' ? `${BASE}/predavanja/zene` : `${BASE}/predavanja/${aud}/${id}`
  return (
    <>
      <Section>
        <Link href={back.href} className="inline-flex items-center gap-1 self-start text-sm text-[#746860] hover:text-[#8b1e3f] -mb-8">
          <ChevronLeft size={16} /> {back.label}
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-10 lg:gap-14 items-start">
          <div className="flex flex-col sm:flex-row overflow-hidden">
            <div className="relative w-full sm:w-[240px] shrink-0 overflow-hidden bg-[#e0d8d0]" style={{ minHeight: 300 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG(p.img)} alt={p.n} className="absolute inset-0 w-full h-full object-cover object-top" />
            </div>
            <div className="bg-[#f5f2ef] flex flex-col gap-3 p-6 flex-1">
              <p className="font-medium text-[#8b1e3f] text-xs uppercase tracking-wide">{p.r}</p>
              <h1 className="font-medium text-[#241f1d]" style={{ fontSize: 'clamp(24px, 2.6vw, 32px)', lineHeight: 1.12, letterSpacing: '-0.72px' }}>{p.n}</h1>
              <p className="font-normal text-[#5a4f49] text-base leading-normal">{p.bio}</p>
              <div className="flex flex-wrap gap-2">
                {p.topics.map(t => <span key={t} className="bg-[#faf5f5] px-2.5 py-1.5 text-[#8b1e3f] uppercase" style={{ fontSize: 10, letterSpacing: '0.3px' }}>{t}</span>)}
              </div>
              {p.author ? (
                <Link href={`/autori/${p.author}`} className="self-start text-sm font-medium text-[#8b1e3f] hover:underline mt-auto pt-1">
                  Svi sadržaji na Misbahu →
                </Link>
              ) : null}
            </div>
          </div>
          <ProfileInvite name={p.n} audience={AUD[aud].t} path={path} />
        </div>
      </Section>
      <Section bg="bg-[#fcfbfa]">
        <SectionHead tag="SNIMCI" title="Pogledajte predavanja" />
        {short.length ? <VideoGrid vids={short} label={p.n} portrait /> : null}
        {long.length ? <VideoGrid vids={long} label={p.n} /> : null}
        {!p.vids.length ? <Soon /> : null}
      </Section>
    </>
  )
}

function Soon() {
  return (
    <div className="bg-[#f5f2ef] p-8 flex flex-col gap-3 items-start max-w-[620px]">
      <p className="font-medium text-[#241f1d]" style={{ fontSize: 20 }}>Snimci uskoro</p>
      <p className="text-[#5a4f49]">Snimke ćemo uskoro dodati. Do tada nam se javite i poslat ćemo vam primjere nastupa.</p>
      <OutlineLink href={`${BASE}/kontakt`}>Pitajte nas</OutlineLink>
    </div>
  )
}

function Hor() {
  return (
    <Section>
      <SectionHead back={{ href: BASE, label: 'Pozovite nas' }} tag="HOR MISBAH" title="Izaberite hor"
        description="Nastupamo na otvorenjima džamija, mevludima, iftarima i svečanostima." />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {(Object.keys(HOR) as HorKey[]).map(k => {
          const h = HOR[k]
          return (
            <Card key={k} href={`${BASE}/hor/${k}`} tag="Hor" title={h.t} description={h.d} img={h.img} video={h.vid}
              footer={h.vids.length ? count(h.vids.length, 'snimak', 'snimka', 'snimaka') : 'Snimci uskoro'} />
          )
        })}
      </div>
    </Section>
  )
}

function HorOne({ k }: { k: HorKey }) {
  const h = HOR[k]
  const tall = h.vids.filter(v => v.kind !== 'yt' && v.tall)
  const wide = h.vids.filter(v => !(v.kind !== 'yt' && v.tall))
  const q = new URLSearchParams({ rubrika: 'Hor', izbor: h.t, nazad: `${BASE}/hor/${k}` })
  return (
    <Section>
      <SectionHead back={{ href: `${BASE}/hor`, label: 'Hor' }} tag="HOR MISBAH" title={h.t} description={h.d}
        cta={<PrimaryLink href={`${BASE}/kontakt?${q}`}>Pozovite: {h.t}</PrimaryLink>} />
      {wide.length ? <VideoGrid vids={wide} label={h.t} /> : null}
      {tall.length ? <VideoGrid vids={tall} label={h.t} portrait /> : null}
      {!h.vids.length ? <Soon /> : null}
    </Section>
  )
}

function Druzenja() {
  const q = new URLSearchParams({ rubrika: 'Omladinska druženja', izbor: 'Omladinsko druženje', nazad: `${BASE}/druzenja` })
  return (
    <>
      <Section>
        <SectionHead back={{ href: BASE, label: 'Pozovite nas' }} tag="OMLADINSKA DRUŽENJA" title="Družite se sa nama"
          description="Šta Misbah nudi mladima?"
          cta={<PrimaryLink href={`${BASE}/kontakt?${q}`}>Organizujte druženje s nama</PrimaryLink>} />
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-10 lg:gap-14 items-start">
          <div className="grid grid-cols-1 gap-4">
            {DRUZENJA_OFFER.map(o => (
              <div key={o.t} className="bg-[#faf5f5] flex flex-col gap-3 p-8">
                <h3 className="font-medium text-[#241f1d]" style={{ fontSize: 24, lineHeight: 1.12, letterSpacing: '-0.72px' }}>{o.t}</h3>
                <p className="font-normal text-[#5a4f49] text-base leading-normal">{o.d}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-2.5">
            {DRUZENJA_PHOTOS.map(ph => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={ph.src} src={IMG(ph.src)} alt={ph.alt} loading="lazy" className="w-full h-[150px] sm:h-[230px] object-cover" style={{ objectPosition: 'center 45%' }} />
            ))}
          </div>
        </div>
      </Section>
      <Section bg="bg-[#fcfbfa]">
        <SectionHead tag="SNIMCI" title="Sa naših druženja" />
        <VideoGrid vids={DRUZENJA_VIDS} label="Omladinska druženja" />
      </Section>
    </>
  )
}

const SOCIALS = [
  { href: 'https://www.youtube.com/@misbah_ba', label: 'YouTube' },
  { href: 'https://www.instagram.com/misbah_edu', label: 'Instagram' },
  { href: 'https://www.tiktok.com/@misbah_ba', label: 'TikTok' },
  { href: 'https://www.facebook.com/MisbahBIH/', label: 'Facebook' },
]

function Kontakt() {
  return (
    <Section>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-10 lg:gap-14 items-start">
        <div className="flex flex-col gap-8">
          <SectionHead tag="POZOVITE NAS" title="Dovedite Misbah u svoju zajednicu"
            description="Pišite nam s datumom, mjestom i vrstom programa, pa ćemo zajedno dogovoriti detalje." />
          <ContactQuick />
          <div className="flex flex-col gap-3">
            <p className="font-normal text-[#746860] uppercase" style={{ fontSize: 13, letterSpacing: '0.42px' }}>Ostanimo povezani</p>
            <div className="flex flex-wrap gap-2">
              {SOCIALS.map(s => (
                <a key={s.href} href={s.href} target="_blank" rel="noopener"
                  className="border border-[#ede5dc] px-4 py-2 text-sm text-[#5a4f49] hover:border-[#8b1e3f] hover:text-[#8b1e3f] transition-colors">
                  {s.label} ↗
                </a>
              ))}
            </div>
            <p className="text-sm text-[#978a81]">Sarajevo, Bosna i Hercegovina</p>
          </div>
        </div>
        <Suspense>
          <InquiryForm />
        </Suspense>
      </div>
    </Section>
  )
}
