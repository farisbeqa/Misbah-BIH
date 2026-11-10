import { Suspense, type ReactNode } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  allPaths, AUD, BASE, CONTACT, DRUZENJA_OFFER, DRUZENJA_PHOTOS, DRUZENJA_VIDS, HOR, IMG, MEN, PEOPLE, STATS, VIDEO,
  type Audience, type HorKey,
} from '@/lib/pozovite'
import { ContactQuick, HeroShowreel, InquiryForm, ProfileInvite, TileVideo, VideoGrid } from '../ui'

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
    <div className="w-full bg-white">
      {isHome ? null : <Crumbs crumbs={r.crumbs} />}
      {r.body}
      {isInquiry ? null : <InviteBand />}
    </div>
  )
}

// ── Layout pieces ───────────────────────────────────────────────────────────

const WRAP = 'max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20'

// Mihrab arch for the lecturer portraits
const ARCH = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 400' preserveAspectRatio='none'%3E%3Cpath d='M0 400V120C0 70 70 52 110 30C130 19 143 8 150 0C157 8 170 19 190 30C230 52 300 70 300 120V400Z'/%3E%3C/svg%3E") center/100% 100% no-repeat`

function Arch({ src, alt = '', className = '' }: { src: string; alt?: string; className?: string }) {
  return (
    <span className={`block aspect-[3/4] overflow-hidden bg-[#ede6db] ${className}`} style={{ WebkitMask: ARCH, mask: ARCH }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={IMG(src)} alt={alt} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]" />
    </span>
  )
}

function Crumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Putanja" className="bg-[#faf7f2] border-b border-[#ede5dc]">
      <ol className={`${WRAP} flex items-center gap-1.5 py-3 text-sm overflow-x-auto whitespace-nowrap`}>
        {crumbs.map((c, i) => (
          <li key={c.href} className="flex items-center gap-1.5 shrink-0">
            {i > 0 ? <ChevronRight size={14} className="text-[#c8a96b]" aria-hidden="true" /> : null}
            {i === crumbs.length - 1
              ? <span aria-current="page" className="text-[#8b1e3f] font-semibold">{c.label}</span>
              : <Link href={c.href} className="text-[#746860] hover:text-[#8b1e3f]">{c.label}</Link>}
          </li>
        ))}
      </ol>
    </nav>
  )
}

function Head({ back, tag, title, accent, description, children }: {
  back?: Crumb; tag: string; title: string; accent?: string; description?: string; children?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 max-w-[760px]">
      {back ? (
        <Link href={back.href} className="inline-flex items-center gap-1 self-start text-sm font-medium text-[#8b1e3f] hover:underline">
          <ChevronLeft size={16} /> {back.label}
        </Link>
      ) : null}
      <p className="font-medium text-[#8b1e3f] text-base uppercase">{tag}</p>
      <h1 className="font-semibold text-[#141110]" style={{ fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.25, letterSpacing: '-0.44px' }}>
        {title}{accent ? <> <span className="text-[#8b1e3f]">{accent}</span></> : null}
      </h1>
      {description ? <p className="text-[#746860]" style={{ fontSize: 18, lineHeight: 1.5 }}>{description}</p> : null}
      {children}
    </div>
  )
}

function Section({ children, tint = false }: { children: ReactNode; tint?: boolean }) {
  return (
    <section className={tint ? 'bg-[#fcfbfa]' : 'bg-white'}>
      <div className={`${WRAP} py-12 lg:py-16 flex flex-col gap-10`}>{children}</div>
    </section>
  )
}

function Tile({ href, eyebrow, title, description, img, video, count }: {
  href: string; eyebrow: string; title: string; description: string; img: string; video?: string; count?: string
}) {
  return (
    <Link href={href} className="group relative isolate flex flex-col justify-end gap-2 min-h-[240px] lg:min-h-[300px] p-6 overflow-hidden bg-[#2a0814] text-white">
      {video ? <TileVideo src={VIDEO(video)} poster={IMG(img)} /> : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={IMG(img)} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover -z-20 transition-transform duration-500 group-hover:scale-[1.04]" />
      )}
      <span className="absolute inset-0 -z-10 bg-gradient-to-t from-[#2a0814]/95 via-[#2a0814]/55 to-[#2a0814]/10" />
      <span className="absolute top-4 right-4 size-10 grid place-items-center bg-[#c8a96b] text-[#2a1410] group-hover:bg-white transition-colors">
        <ArrowRight size={18} />
      </span>
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#dfc89a] pr-12">{eyebrow}</span>
      <span className="font-semibold leading-tight" style={{ fontSize: 'clamp(24px, 2.4vw, 32px)' }}>{title}</span>
      <span className="text-[15px] text-white/85 leading-snug max-w-[46ch]">{description}</span>
      {count ? <span className="text-sm font-semibold text-[#dfc89a]">{count}</span> : null}
    </Link>
  )
}

/** Closing call to action on every page except the inquiry itself */
function InviteBand() {
  return (
    <section className="bg-[#8b1e3f] text-white">
      <div className={`${WRAP} py-12 flex flex-col md:flex-row md:items-center gap-6 justify-between`}>
        <div className="flex flex-col gap-2 max-w-[640px]">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#dfc89a]">Pozovite nas</p>
          <p className="font-semibold" style={{ fontSize: 'clamp(22px, 2.6vw, 30px)', lineHeight: 1.25 }}>Dovedite Misbah u svoju zajednicu</p>
          <p className="text-white/80">Pišite nam s datumom, mjestom i vrstom programa — zajedno ćemo dogovoriti detalje.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link href={`${BASE}/kontakt`} className="bg-[#c8a96b] text-[#2a1410] font-semibold px-7 py-3 hover:bg-[#dfc89a] transition-colors">Pošaljite upit</Link>
          <a href={`mailto:${CONTACT.email}`} className="border border-white/50 px-6 py-3 hover:bg-white/10 transition-colors">{CONTACT.email}</a>
        </div>
      </div>
    </section>
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
      <HeroShowreel src={VIDEO('v/showreel.mp4')} poster={IMG('p/showreel.jpg')}
        className={`${WRAP} py-16 lg:py-24 min-h-[560px] lg:min-h-[640px] flex flex-col justify-end gap-6`}
        cta={<Link href={`${BASE}/kontakt`} className="bg-[#c8a96b] text-[#2a1410] font-semibold px-7 py-3 hover:bg-[#dfc89a] transition-colors">Pozovite nas</Link>}>
          <p className="text-[#dfc89a] text-lg" dir="rtl" lang="ar" style={{ fontFamily: "'Noto Sans Arabic', Manrope, sans-serif", textAlign: 'left' }}>
            بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </p>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#c8a96b]">Omladinska inicijativa · Sarajevo · od 2022.</p>
          <h1 className="font-semibold text-white max-w-[14ch]" style={{ fontSize: 'clamp(36px, 6vw, 72px)', lineHeight: 1.08, letterSpacing: '-1.5px' }}>
            Svjetlo znanja, <span className="text-[#c8a96b]">uživo</span> u vašoj zajednici
          </h1>
          <p className="text-white/85 max-w-[56ch]" style={{ fontSize: 'clamp(16px, 1.4vw, 19px)', lineHeight: 1.55 }}>
            Mladi hafizi, imami i predavači. Izaberite šta želite ugostiti, a mi dolazimo u vaš džemat, školu ili na vašu manifestaciju.
          </p>
      </HeroShowreel>

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Tile href={`${BASE}/predavanja`} eyebrow="Za muškarce · za žene · za džemat" title="Predavanja" img="p/hamdo-tin.jpg"
            description="Izaberite publiku, predavača i vrstu programa: predavanje, edukaciju, radionicu ili višednevnu edukaciju." />
          <Tile href={`${BASE}/hor`} eyebrow="Muški · ženski · miješani" title="Hor" img="p/hor-maljevac.jpg"
            description="Ilahije i kaside uz defove za otvorenja džamija, mevlude, iftare i svečanosti." />
          <Tile href={`${BASE}/druzenja`} eyebrow="Predavanja · radionice · kvizovi" title="Omladinska druženja" img="p/zagreb.jpg"
            description="Edukativna predavanja, interaktivne radionice i kvizovi znanja za mlade." />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#ede5dc] border border-[#ede5dc]">
          {STATS.map(s => (
            <div key={s.t} className="bg-white px-5 py-6 flex flex-col gap-1">
              <span className="font-semibold text-[#8b1e3f]" style={{ fontSize: 'clamp(26px, 3vw, 36px)', letterSpacing: '-0.5px' }}>{s.n}</span>
              <span className="text-[#746860]">{s.t}</span>
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
      <Head back={{ href: BASE, label: 'Pozovite nas' }} tag="Predavanja" title="Za koga" accent="pripremamo program?"
        description="Izaberite publiku. Zatim birate predavača i vrstu programa." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(Object.keys(AUD) as Audience[]).map(k => (
          <Tile key={k} href={`${BASE}/predavanja/${k}`} eyebrow="Predavanja" title={AUD[k].t} description={AUD[k].d} img={AUD[k].img}
            count={k === 'zene' ? '1 predavačica' : count(MEN.length, 'predavač', 'predavača', 'predavača')} />
        ))}
      </div>
    </Section>
  )
}

function Lecturers({ aud }: { aud: 'muskarci' | 'dzemat' }) {
  const a = AUD[aud]
  return (
    <Section>
      <Head back={{ href: `${BASE}/predavanja`, label: 'Predavanja' }} tag={`Predavanja · ${a.t}`} title="Izaberite" accent="predavača"
        description={`${a.d} Na profilu predavača birate vrstu programa i šaljete upit.`} />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-5 gap-y-8">
        {MEN.map(id => {
          const p = PEOPLE[id]
          return (
            <Link key={id} href={`${BASE}/predavanja/${aud}/${id}`} className="group flex flex-col gap-1.5">
              <Arch src={p.img} className="mb-2" />
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[#8b1e3f]">{p.r}</span>
              <span className="font-semibold text-[#241f1d] text-lg leading-tight group-hover:text-[#8b1e3f]">{p.n}</span>
              <span className="text-sm text-[#978a81]">{p.vids.length ? count(p.vids.length, 'video', 'videa', 'videa') : 'Snimci uskoro'}</span>
            </Link>
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
        <Link href={back.href} className="inline-flex items-center gap-1 self-start text-sm font-medium text-[#8b1e3f] hover:underline -mb-4">
          <ChevronLeft size={16} /> {back.label}
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-8 lg:gap-12 items-start">
          <div className="grid grid-cols-[110px_minmax(0,1fr)] sm:grid-cols-[170px_minmax(0,1fr)] gap-5 sm:gap-7 items-center p-5 sm:p-7 bg-[#faf7f2] border border-[#ede5dc]">
            <Arch src={p.img} alt={p.n} />
            <div className="flex flex-col gap-3 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8b1e3f]">{p.r}</p>
              <h1 className="font-semibold text-[#141110] leading-tight" style={{ fontSize: 'clamp(24px, 3vw, 36px)', letterSpacing: '-0.4px' }}>{p.n}</h1>
              <p className="text-[#5a4f49] text-[15px] leading-relaxed">{p.bio}</p>
              <div className="flex flex-wrap gap-1.5">
                {p.topics.map(t => <span key={t} className="text-xs px-2.5 py-1 border border-[#ede5dc] bg-white text-[#5a4f49]">{t}</span>)}
              </div>
              {p.author ? (
                <Link href={`/autori/${p.author}`} className="inline-flex items-center gap-1 self-start text-sm font-medium text-[#8b1e3f] hover:underline">
                  Svi sadržaji na Misbahu <ArrowRight size={14} />
                </Link>
              ) : null}
            </div>
          </div>
          <ProfileInvite name={p.n} audience={AUD[aud].t} path={path} />
        </div>
      </Section>
      <Section tint>
        <h2 className="font-semibold text-[#141110] text-2xl lg:text-3xl -mb-2">Pogledajte predavanja</h2>
        {short.length ? <VideoGrid vids={short} label={p.n} portrait /> : null}
        {long.length ? <VideoGrid vids={long} label={p.n} /> : null}
        {!p.vids.length ? <Soon /> : null}
      </Section>
    </>
  )
}

function Soon() {
  return (
    <div className="border border-dashed border-[#c8a96b] p-6 flex flex-col gap-2 items-start max-w-[620px] bg-white">
      <p className="font-semibold text-[#241f1d] text-lg">Snimci uskoro</p>
      <p className="text-[#746860]">Snimke ćemo uskoro dodati. Do tada nam se javite i poslat ćemo vam primjere nastupa.</p>
      <Link href={`${BASE}/kontakt`} className="border border-[#8b1e3f] text-[#8b1e3f] px-5 py-2 mt-1 hover:bg-[#faf5f5]">Pitajte nas</Link>
    </div>
  )
}

function Hor() {
  return (
    <Section>
      <Head back={{ href: BASE, label: 'Pozovite nas' }} tag="Hor Misbah" title="Izaberite" accent="hor"
        description="Nastupamo na otvorenjima džamija, mevludima, iftarima i svečanostima." />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {(Object.keys(HOR) as HorKey[]).map(k => {
          const h = HOR[k]
          return (
            <Tile key={k} href={`${BASE}/hor/${k}`} eyebrow="Hor" title={h.t} description={h.d} img={h.img} video={h.vid}
              count={h.vids.length ? count(h.vids.length, 'snimak', 'snimka', 'snimaka') : 'Snimci uskoro'} />
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
      <Head back={{ href: `${BASE}/hor`, label: 'Hor' }} tag="Hor Misbah" title={h.t} description={h.d}>
        <Link href={`${BASE}/kontakt?${q}`} className="self-start bg-[#8b1e3f] text-white px-7 py-3 hover:bg-[#7a1a37] transition-colors">
          Pozovite: {h.t}
        </Link>
      </Head>
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
        <Head back={{ href: BASE, label: 'Pozovite nas' }} tag="Omladinska druženja" title="Družite se" accent="sa nama">
          <Link href={`${BASE}/kontakt?${q}`} className="self-start bg-[#8b1e3f] text-white px-7 py-3 hover:bg-[#7a1a37] transition-colors">
            Organizujte druženje s nama
          </Link>
        </Head>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-8 lg:gap-12 items-center">
          <div className="flex flex-col gap-4">
            <h2 className="font-semibold text-[#141110] text-2xl lg:text-3xl">Šta Misbah nudi mladima?</h2>
            <ul className="flex flex-col gap-3">
              {DRUZENJA_OFFER.map(o => (
                <li key={o.t} className="flex flex-col gap-1 p-4 border border-[#ede5dc] bg-[#faf7f2]">
                  <b className="font-semibold text-[#8b1e3f] text-lg">{o.t}</b>
                  <span className="text-[#5a4f49] leading-relaxed">{o.d}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-2.5">
            {DRUZENJA_PHOTOS.map(ph => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={ph.src} src={IMG(ph.src)} alt={ph.alt} loading="lazy" className="w-full h-[150px] sm:h-[220px] object-cover" style={{ objectPosition: 'center 45%' }} />
            ))}
          </div>
        </div>
      </Section>
      <Section tint>
        <h2 className="font-semibold text-[#141110] text-2xl lg:text-3xl -mb-2">Sa naših druženja</h2>
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
        <div className="flex flex-col gap-6">
          <Head tag="Pozovite nas" title="Dovedite Misbah" accent="u svoju zajednicu"
            description="Pišite nam s datumom, mjestom i vrstom programa, pa ćemo zajedno dogovoriti detalje." />
          <ContactQuick />
          <div className="flex flex-wrap gap-2">
            {SOCIALS.map(s => (
              <a key={s.href} href={s.href} target="_blank" rel="noopener"
                className="px-4 py-2 border border-[#ede5dc] text-sm text-[#5a4f49] hover:border-[#8b1e3f] hover:text-[#8b1e3f] transition-colors">
                {s.label} ↗
              </a>
            ))}
          </div>
          <p className="text-sm text-[#978a81]">Sarajevo, Bosna i Hercegovina</p>
        </div>
        <Suspense>
          <InquiryForm />
        </Suspense>
      </div>
    </Section>
  )
}
