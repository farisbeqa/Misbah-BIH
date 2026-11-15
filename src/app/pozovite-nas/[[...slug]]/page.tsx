import { Suspense, type ReactNode } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from '@/i18n/navigation'
import { getLocale, intlLocale } from '@/i18n/server'
import { LOCALE_INFO } from '@/i18n/config'
import {
  allPaths, AUD, BASE, CONTACT, DRUZENJA_OFFER, DRUZENJA_PHOTOS, DRUZENJA_VIDS, HOR, IMG, INQUIRY_BS, MEN, PEOPLE, STATS, VIDEO,
  type Audience, type HorKey,
} from '@/lib/pozovite'
import { ContactQuick, HeroVideo, InquiryForm, ProfileInvite, TileVideo, VideoGrid } from '../ui'

// Built from the "Pozovite nas" mini-site, laid out with the same pieces as the
// rest of misbah-edu.com (home hero, section heads, cards, buttons).
// Texts: messages/<locale>/pozovite.json; URL slugs stay the same in every language.

export const dynamicParams = false

export function generateStaticParams() {
  return allPaths().map(slug => ({ slug }))
}

type T = Awaited<ReturnType<typeof getTranslations<'pozovite'>>>

interface Crumb { href: string; label: string }

/** Resolves /pozovite-nas/... to its view; null = 404 */
function resolve(slug: string[], t: T): { crumbs: Crumb[]; title: string; body: ReactNode } | null {
  const [a, b, c] = slug
  const home = { href: BASE, label: t('sections.home') }
  if (!a) return { crumbs: [home], title: t('sections.home'), body: <Home t={t} /> }

  if (a === 'predavanja') {
    const pred = { href: `${BASE}/predavanja`, label: t('sections.lectures') }
    if (!b) return { crumbs: [home, pred], title: t('sections.lectures'), body: <Predavanja t={t} /> }
    if (b === 'zene') {
      return { crumbs: [home, pred, { href: `${BASE}/predavanja/zene`, label: t('audiences.zene.title') }], title: PEOPLE.mubina.n, body: <Profile t={t} aud="zene" id="mubina" back={pred} /> }
    }
    if (b !== 'muskarci' && b !== 'dzemat') return null
    const aud = { href: `${BASE}/predavanja/${b}`, label: t(`audiences.${b}.title`) }
    if (!c) return { crumbs: [home, pred, aud], title: t('lecturers.pageTitle', { audience: aud.label }), body: <Lecturers t={t} aud={b} /> }
    if (!MEN.includes(c)) return null
    return { crumbs: [home, pred, aud, { href: `${BASE}/predavanja/${b}/${c}`, label: PEOPLE[c].n }], title: PEOPLE[c].n, body: <Profile t={t} aud={b} id={c} back={aud} /> }
  }

  if (a === 'hor') {
    const hor = { href: `${BASE}/hor`, label: t('sections.choir') }
    if (!b) return { crumbs: [home, hor], title: t('choir.pageTitle'), body: <Hor t={t} /> }
    if (!(b in HOR)) return null
    const k = b as HorKey
    const title = t(`choir.groups.${k}.title`)
    return { crumbs: [home, hor, { href: `${BASE}/hor/${k}`, label: title }], title, body: <HorOne t={t} k={k} /> }
  }

  if (a === 'druzenja') return { crumbs: [home, { href: `${BASE}/druzenja`, label: t('sections.gatherings') }], title: t('sections.gatherings'), body: <Druzenja t={t} /> }
  if (a === 'kontakt') return { crumbs: [home, { href: `${BASE}/kontakt`, label: t('sections.inquiry') }], title: t('form.title'), body: <Kontakt t={t} /> }
  return null
}

export async function generateMetadata({ params }: { params: { slug?: string[] } }): Promise<Metadata> {
  const t = await getTranslations('pozovite')
  const r = resolve(params.slug ?? [], t)
  if (!r) return {}
  return {
    title: r.crumbs.length === 1 ? t('meta.title') : t('meta.pageTitle', { page: r.title }),
    description: t('meta.description'),
    openGraph: { images: [IMG('p/showreel.jpg')] },
  }
}

export default async function PozoviteNasPage({ params }: { params: { slug?: string[] } }) {
  const t = await getTranslations('pozovite')
  const r = resolve(params.slug ?? [], t)
  if (!r) notFound()
  const isHome = r.crumbs.length === 1
  const isInquiry = params.slug?.[0] === 'kontakt'
  return (
    <div className="min-h-screen w-full bg-[var(--bg-ffffff)]">
      {isHome ? null : <Crumbs crumbs={r.crumbs} label={t('sections.breadcrumbs')} />}
      {r.body}
      {isInquiry ? null : <InviteSection t={t} />}
    </div>
  )
}

// ── Site building blocks (as on the home page) ──────────────────────────────

const WRAP = 'max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20'

const isRtl = () => LOCALE_INFO[getLocale()].dir === 'rtl'

/** Arrows typed in the text point the other way in right-to-left languages */
const textArrow = () => (isRtl() ? '←' : '→')
const externalArrow = () => (isRtl() ? '↖' : '↗')

function ArrowUpRight() {
  return (
    <svg className="block shrink-0 flip-rtl" width="16" height="16" fill="none" viewBox="0 0 11.5 11.5" aria-hidden="true">
      <path d="M0.75 10.75L10.75 0.75M10.75 10.75V0.75H0.75" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  )
}

function PrimaryLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href}
      className="bg-[var(--bg-8b1e3f)] text-white flex items-center gap-2 ps-8 pe-6 py-3 text-base font-normal shrink-0 hover:bg-[var(--bg-7a1a37)] transition-colors self-start">
      {children}
      <ArrowUpRight />
    </Link>
  )
}

function OutlineLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="border border-[var(--line-8b1e3f)] text-[var(--fg-8b1e3f)] px-6 py-3 text-base font-normal hover:bg-[var(--bg-faf5f5)] transition-colors">
      {children}
    </Link>
  )
}

function Section({ children, bg = 'bg-[var(--bg-ffffff)]' }: { children: ReactNode; bg?: string }) {
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
          <Link href={back.href} className="inline-flex items-center gap-1 self-start text-sm text-[var(--fg-746860)] hover:text-[var(--fg-8b1e3f)]">
            <ChevronLeft size={16} className="flip-rtl" /> {back.label}
          </Link>
        ) : null}
        <p className="font-medium text-[var(--fg-8b1e3f)] text-base uppercase">{tag}</p>
        <div className="flex flex-col gap-6">
          <h1 className="font-semibold text-[var(--fg-141110)]" style={{ fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.3, letterSpacing: '-0.44px' }}>
            {title}
          </h1>
          {description ? (
            <p className="font-normal text-[var(--fg-746860)]" style={{ fontSize: 18, lineHeight: 1.5, letterSpacing: '-0.18px' }}>{description}</p>
          ) : null}
        </div>
      </div>
      {cta}
    </div>
  )
}

function Crumbs({ crumbs, label }: { crumbs: Crumb[]; label: string }) {
  return (
    <nav aria-label={label} className="bg-[var(--bg-faf7f2)] border-b border-[var(--line-ede5dc)]">
      <ol className={`${WRAP} flex items-center gap-1.5 py-3 text-sm overflow-x-auto whitespace-nowrap`}>
        {crumbs.map((c, i) => (
          <li key={c.href} className="flex items-center gap-1.5 shrink-0">
            {i > 0 ? <ChevronRight size={14} className="text-[var(--fg-a89888)] flip-rtl" aria-hidden="true" /> : null}
            {i === crumbs.length - 1
              ? <span aria-current="page" className="text-[var(--fg-8b1e3f)] font-medium">{c.label}</span>
              : <Link href={c.href} className="text-[var(--fg-746860)] hover:text-[var(--fg-8b1e3f)]">{c.label}</Link>}
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
      <div className="relative w-full overflow-hidden shrink-0 bg-[var(--bg-e0d8d0)]" style={{ height: tall ? 340 : 240 }}>
        {video ? <TileVideo src={VIDEO(video)} poster={IMG(img)} /> : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={IMG(img)} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300" />
        )}
      </div>
      <div className="bg-[var(--bg-f5f2ef)] flex flex-col gap-3 p-6 flex-1">
        <p className="font-medium text-[var(--fg-8b1e3f)] text-xs uppercase tracking-wide">{tag}</p>
        <p className="font-medium text-[var(--fg-241f1d)] group-hover:text-[var(--fg-8b1e3f)] transition-colors" style={{ fontSize: 24, lineHeight: 1.12, letterSpacing: '-0.72px' }}>
          {title}
        </p>
        <p className="font-normal text-[var(--fg-5a4f49)] text-base leading-normal">{description}</p>
        {footer ? <p className="font-medium text-[var(--fg-8b1e3f)] text-sm mt-auto pt-1">{footer} {textArrow()}</p> : null}
      </div>
    </Link>
  )
}

/** Closing call to action */
function InviteSection({ t }: { t: T }) {
  return (
    <Section bg="bg-[var(--bg-fcfbfa)]">
      <SectionHead tag={t('invite.tag')} title={t('invite.title')}
        description={t('invite.text')}
        cta={
          <div className="flex flex-wrap gap-4 self-start lg:self-auto">
            <PrimaryLink href={`${BASE}/kontakt`}>{t('actions.sendInquiry')}</PrimaryLink>
            <a href={`mailto:${CONTACT.email}`} className="border border-[var(--line-8b1e3f)] text-[var(--fg-8b1e3f)] px-6 py-3 text-base font-normal hover:bg-[var(--bg-faf5f5)] transition-colors">
              {CONTACT.email}
            </a>
          </div>
        } />
    </Section>
  )
}

// ── Views ───────────────────────────────────────────────────────────────────

function Home({ t }: { t: T }) {
  const number = new Intl.NumberFormat(intlLocale())
  return (
    <>
      {/* Hero, as on the home page: text panel first, showreel after it */}
      <section className="bg-[var(--bg-ffffff)] w-full">
        <div className="max-w-[1440px] mx-auto w-full flex flex-col lg:flex-row items-stretch min-h-[520px] lg:min-h-[640px]">
          <div className="bg-[var(--bg-faf7f2)] flex flex-col justify-end gap-16 lg:gap-20 px-6 sm:px-10 lg:px-[60px] py-16 lg:py-[104px] w-full lg:w-[55%] xl:w-[798px] shrink-0">
            <div className="flex flex-col gap-2">
              {/* The line itself is dir="rtl", where text-start would mean right in every
                  language; on large screens it lines up with the start of the page instead */}
              <p className={`text-base font-medium text-[var(--fg-141110)] text-center ${isRtl() ? 'lg:text-right' : 'lg:text-left'}`} dir="rtl"
                style={{ fontFamily: "'Noto Sans Arabic', Manrope, sans-serif" }}>
                بسم الله الرحمن الرحيم
              </p>
              <div className="flex flex-col gap-6 mt-2">
                <p className="font-medium text-[var(--fg-8b1e3f)] text-base uppercase">{t('home.hero.tag')}</p>
                <h1 className="font-semibold text-[var(--fg-141110)]" style={{ fontSize: 'clamp(32px, 5vw, 52px)', lineHeight: 1.3, letterSpacing: '-1.04px' }}>
                  {t('home.hero.title')}
                </h1>
                <p className="font-normal text-[var(--fg-5a4f49)]" style={{ fontSize: 18, lineHeight: 1.5, letterSpacing: '-0.18px' }}>
                  {t('home.hero.text')}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <PrimaryLink href={`${BASE}/kontakt`}>{t('actions.sendInquiry')}</PrimaryLink>
              <OutlineLink href={`${BASE}/predavanja`}>{t('sections.lectures')}</OutlineLink>
            </div>
          </div>
          <div className="relative flex-1 min-w-0 min-h-[300px] lg:min-h-0 overflow-hidden bg-[var(--bg-ede6db)]">
            <HeroVideo src={VIDEO('v/showreel.mp4')} poster={IMG('p/showreel.jpg')} />
          </div>
        </div>
      </section>

      <Section>
        <SectionHead tag={t('home.offer.tag')} title={t('home.offer.title')}
          description={t('home.offer.text')} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card href={`${BASE}/predavanja`} tag={t('home.offer.lectures.tag')} title={t('home.offer.lectures.title')} img="p/hamdo-tin.jpg"
            description={t('home.offer.lectures.text')} footer={t('home.offer.lectures.cta')} />
          <Card href={`${BASE}/hor`} tag={t('home.offer.choir.tag')} title={t('home.offer.choir.title')} img="p/hor-maljevac.jpg"
            description={t('home.offer.choir.text')} footer={t('home.offer.choir.cta')} />
          <Card href={`${BASE}/druzenja`} tag={t('home.offer.gatherings.tag')} title={t('home.offer.gatherings.title')} img="p/zagreb.jpg"
            description={t('home.offer.gatherings.text')} footer={t('home.offer.gatherings.cta')} />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map(s => (
            <div key={s.key} className="bg-[var(--bg-faf5f5)] px-6 py-6 flex flex-col gap-1">
              <span className="font-semibold text-[var(--fg-8b1e3f)]" style={{ fontSize: 'clamp(26px, 3vw, 36px)', letterSpacing: '-0.5px' }}>{`${number.format(s.n)}${s.plus ? '+' : ''}`}</span>
              <span className="text-[var(--fg-5a4f49)]">{t(`home.stats.${s.key}`, { count: s.n })}</span>
            </div>
          ))}
        </div>
      </Section>
    </>
  )
}

function Predavanja({ t }: { t: T }) {
  return (
    <Section>
      <SectionHead back={{ href: BASE, label: t('sections.home') }} tag={t('lectures.tag')} title={t('lectures.title')}
        description={t('lectures.text')} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {(Object.keys(AUD) as Audience[]).map(k => (
          <Card key={k} href={`${BASE}/predavanja/${k}`} tag={t('sections.lectures')} title={t(`audiences.${k}.title`)} description={t(`audiences.${k}.description`)} img={AUD[k].img}
            footer={k === 'zene' ? t('lectures.femaleLecturers', { count: 1 }) : t('lectures.lecturers', { count: MEN.length })} />
        ))}
      </div>
    </Section>
  )
}

function Lecturers({ t, aud }: { t: T; aud: 'muskarci' | 'dzemat' }) {
  const audience = t(`audiences.${aud}.title`)
  return (
    <Section>
      <SectionHead back={{ href: `${BASE}/predavanja`, label: t('sections.lectures') }}
        tag={t('lecturers.tag', { audience: audience.toLocaleUpperCase(getLocale()) })} title={t('lecturers.title')}
        description={t('lecturers.text', { description: t(`audiences.${aud}.description`) })} />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {MEN.map(id => {
          const p = PEOPLE[id]
          return (
            <Card key={id} href={`${BASE}/predavanja/${aud}/${id}`} tag={t(`people.${id}.role`)} title={p.n} description={t(`people.${id}.bio`)} img={p.img} tall
              footer={p.vids.length ? t('lecturers.videos', { count: p.vids.length }) : t('soon.title')} />
          )
        })}
      </div>
    </Section>
  )
}

function Profile({ t, aud, id, back }: { t: T; aud: Audience; id: string; back: Crumb }) {
  const p = PEOPLE[id]
  const topics = t.raw(`people.${id}.topics`) as string[]
  const short = p.vids.filter(v => v.kind === 'reel' || v.kind === 'short')
  const long = p.vids.filter(v => v.kind !== 'reel' && v.kind !== 'short')
  const path = aud === 'zene' ? `${BASE}/predavanja/zene` : `${BASE}/predavanja/${aud}/${id}`
  return (
    <>
      <Section>
        <Link href={back.href} className="inline-flex items-center gap-1 self-start text-sm text-[var(--fg-746860)] hover:text-[var(--fg-8b1e3f)] -mb-8">
          <ChevronLeft size={16} className="flip-rtl" /> {back.label}
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-10 lg:gap-14 items-start">
          <div className="flex flex-col sm:flex-row overflow-hidden">
            <div className="relative w-full sm:w-[240px] shrink-0 overflow-hidden bg-[var(--bg-e0d8d0)]" style={{ minHeight: 300 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG(p.img)} alt={p.n} className="absolute inset-0 w-full h-full object-cover object-top" />
            </div>
            <div className="bg-[var(--bg-f5f2ef)] flex flex-col gap-3 p-6 flex-1">
              <p className="font-medium text-[var(--fg-8b1e3f)] text-xs uppercase tracking-wide">{t(`people.${id}.role`)}</p>
              <h1 className="font-medium text-[var(--fg-241f1d)]" style={{ fontSize: 'clamp(24px, 2.6vw, 32px)', lineHeight: 1.12, letterSpacing: '-0.72px' }}>{p.n}</h1>
              <p className="font-normal text-[var(--fg-5a4f49)] text-base leading-normal">{t(`people.${id}.bio`)}</p>
              <div className="flex flex-wrap gap-2">
                {topics.map(topic => <span key={topic} className="bg-[var(--bg-faf5f5)] px-2.5 py-1.5 text-[var(--fg-8b1e3f)] uppercase" style={{ fontSize: 10, letterSpacing: '0.3px' }}>{topic}</span>)}
              </div>
              {p.author ? (
                <Link href={`/autori/${p.author}`} className="self-start text-sm font-medium text-[var(--fg-8b1e3f)] hover:underline mt-auto pt-1">
                  {t('profile.allContent')} {textArrow()}
                </Link>
              ) : null}
            </div>
          </div>
          <ProfileInvite name={p.n} aud={aud} path={path} />
        </div>
      </Section>
      <Section bg="bg-[var(--bg-fcfbfa)]">
        <SectionHead tag={t('profile.recordings.tag')} title={t('profile.recordings.title')} />
        {short.length ? <VideoGrid vids={short} label={p.n} portrait /> : null}
        {long.length ? <VideoGrid vids={long} label={p.n} /> : null}
        {!p.vids.length ? <Soon t={t} /> : null}
      </Section>
    </>
  )
}

function Soon({ t }: { t: T }) {
  return (
    <div className="bg-[var(--bg-f5f2ef)] p-8 flex flex-col gap-3 items-start max-w-[620px]">
      <p className="font-medium text-[var(--fg-241f1d)]" style={{ fontSize: 20 }}>{t('soon.title')}</p>
      <p className="text-[var(--fg-5a4f49)]">{t('soon.text')}</p>
      <OutlineLink href={`${BASE}/kontakt`}>{t('soon.cta')}</OutlineLink>
    </div>
  )
}

function Hor({ t }: { t: T }) {
  return (
    <Section>
      <SectionHead back={{ href: BASE, label: t('sections.home') }} tag={t('choir.tag')} title={t('choir.title')}
        description={t('choir.text')} />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {(Object.keys(HOR) as HorKey[]).map(k => {
          const h = HOR[k]
          return (
            <Card key={k} href={`${BASE}/hor/${k}`} tag={t('sections.choir')} title={t(`choir.groups.${k}.title`)} description={t(`choir.groups.${k}.description`)} img={h.img} video={h.vid}
              footer={h.vids.length ? t('choir.recordings', { count: h.vids.length }) : t('soon.title')} />
          )
        })}
      </div>
    </Section>
  )
}

function HorOne({ t, k }: { t: T; k: HorKey }) {
  const h = HOR[k]
  const title = t(`choir.groups.${k}.title`)
  const tall = h.vids.filter(v => v.kind !== 'yt' && v.tall)
  const wide = h.vids.filter(v => !(v.kind !== 'yt' && v.tall))
  // The inquiry link carries the Bosnian names: they go into the message for the Misbah team
  const q = new URLSearchParams({ rubrika: INQUIRY_BS.rubrike.hor, izbor: INQUIRY_BS.hor[k], nazad: `${BASE}/hor/${k}` })
  return (
    <Section>
      <SectionHead back={{ href: `${BASE}/hor`, label: t('sections.choir') }} tag={t('choir.tag')} title={title} description={t(`choir.groups.${k}.description`)}
        cta={<PrimaryLink href={`${BASE}/kontakt?${q}`}>{t('actions.invite', { name: title })}</PrimaryLink>} />
      {wide.length ? <VideoGrid vids={wide} label={title} /> : null}
      {tall.length ? <VideoGrid vids={tall} label={title} portrait /> : null}
      {!h.vids.length ? <Soon t={t} /> : null}
    </Section>
  )
}

function Druzenja({ t }: { t: T }) {
  // Bosnian names in the inquiry link, as in HorOne
  const q = new URLSearchParams({ rubrika: INQUIRY_BS.rubrike.druzenja, izbor: INQUIRY_BS.druzenje, nazad: `${BASE}/druzenja` })
  return (
    <>
      <Section>
        <SectionHead back={{ href: BASE, label: t('sections.home') }} tag={t('gatherings.tag')} title={t('gatherings.title')}
          description={t('gatherings.text')}
          cta={<PrimaryLink href={`${BASE}/kontakt?${q}`}>{t('gatherings.cta')}</PrimaryLink>} />
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-10 lg:gap-14 items-start">
          <div className="grid grid-cols-1 gap-4">
            {DRUZENJA_OFFER.map(o => (
              <div key={o} className="bg-[var(--bg-faf5f5)] flex flex-col gap-3 p-8">
                <h3 className="font-medium text-[var(--fg-241f1d)]" style={{ fontSize: 24, lineHeight: 1.12, letterSpacing: '-0.72px' }}>{t(`gatherings.offer.${o}.title`)}</h3>
                <p className="font-normal text-[var(--fg-5a4f49)] text-base leading-normal">{t(`gatherings.offer.${o}.description`)}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-2.5">
            {DRUZENJA_PHOTOS.map(ph => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={ph.src} src={IMG(ph.src)} alt={t(`gatherings.photos.${ph.key}`, { mubina: PEOPLE.mubina.n, hamdo: PEOPLE.hamdo.n })} loading="lazy" className="w-full h-[150px] sm:h-[230px] object-cover" style={{ objectPosition: 'center 45%' }} />
            ))}
          </div>
        </div>
      </Section>
      <Section bg="bg-[var(--bg-fcfbfa)]">
        <SectionHead tag={t('gatherings.recordings.tag')} title={t('gatherings.recordings.title')} />
        <VideoGrid vids={DRUZENJA_VIDS} label={t('sections.gatherings')} />
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

function Kontakt({ t }: { t: T }) {
  return (
    <Section>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-10 lg:gap-14 items-start">
        <div className="flex flex-col gap-8">
          <SectionHead tag={t('invite.tag')} title={t('invite.title')}
            description={t('invite.text')} />
          <ContactQuick />
          <div className="flex flex-col gap-3">
            <p className="font-normal text-[var(--fg-746860)] uppercase" style={{ fontSize: 13, letterSpacing: '0.42px' }}>{t('contact.stayConnected')}</p>
            <div className="flex flex-wrap gap-2">
              {SOCIALS.map(s => (
                <a key={s.href} href={s.href} target="_blank" rel="noopener"
                  className="border border-[var(--line-ede5dc)] px-4 py-2 text-sm text-[var(--fg-5a4f49)] hover:border-[var(--line-8b1e3f)] hover:text-[var(--fg-8b1e3f)] transition-colors">
                  {s.label} {externalArrow()}
                </a>
              ))}
            </div>
            <p className="text-sm text-[var(--fg-978a81)]">{t('contact.location')}</p>
          </div>
        </div>
        <Suspense>
          <InquiryForm />
        </Suspense>
      </div>
    </Section>
  )
}
