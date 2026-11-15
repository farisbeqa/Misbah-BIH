'use client'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Check, Copy, Play, Volume2, VolumeX, X } from 'lucide-react'
import Link, { useCurrentLocale, useRouter } from '@/i18n/navigation'
import { LOCALE_INFO } from '@/i18n/config'
import {
  BASE, CONTACT, FORMATS, INQUIRY_BS, INVITE_TEMPLATE, RUBRIKE, vidMedia,
  type Audience, type Format, type Rubrika, type Vid,
} from '@/lib/pozovite'

// ── Shared bits ─────────────────────────────────────────────────────────────

export function WhatsAppIcon({ className = 'size-[18px]' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1.1 2.7.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.5-.3z" />
    </svg>
  )
}

export function ViberIcon({ className = 'size-[18px]' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path fill="currentColor" d="M11.4 1C8.6 1 3.2 1.4 1.8 6.5c-.5 2-.6 4.4-.5 6.7.1 2.6.6 6.6 4.4 7.7v2.6s0 .6.4.7c.4.1.7-.3 1.1-.7l1.9-2.2c3.4.3 6-.4 6.3-.5.7-.2 4.6-.7 5.2-5.8.7-5.2-.3-8.5-2-10C17.7 3.6 15 1 11.4 1zm.1 1.6c3 0 5.4 2 6.4 2.9 1.4 1.2 2.1 4.1 1.6 8.5-.5 4.1-3.5 4.3-4.1 4.5-.3.1-2.7.7-5.8.5l-2.8 3.2v-3c-3.2-.9-3.4-4.1-3.5-6.4-.1-2.2 0-4.4.4-6.2C5 3 9 2.6 11.5 2.6z" />
    </svg>
  )
}

const waHref = (text: string) => `https://wa.me/${CONTACT.phoneDigits}?text=${encodeURIComponent(text)}`
const vbHref = (text: string) => `viber://chat?number=%2B${CONTACT.phoneDigits}&draft=${encodeURIComponent(text)}`

function useToast() {
  const [msg, setMsg] = useState('')
  const timer = useRef<ReturnType<typeof setTimeout>>()
  const show = (m: string) => {
    setMsg(m)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setMsg(''), 2400)
  }
  const node = (
    <div role="status" aria-live="polite"
      className={`fixed left-1/2 bottom-8 -translate-x-1/2 z-[60] px-5 py-2.5 text-sm font-semibold text-white bg-[#8b1e3f] shadow-lg transition-all duration-200 pointer-events-none ${msg ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
      {msg}
    </div>
  )
  return { show, node }
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

// ── Home hero: the showreel in the image panel, sound on request ───────────

export function HeroVideo({ src, poster }: { src: string; poster: string }) {
  const t = useTranslations('pozovite')
  const ref = useRef<HTMLVideoElement>(null)
  const [sound, setSound] = useState(false)

  useEffect(() => {
    const v = ref.current
    if (!v || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    v.play().catch(() => {})
  }, [])

  const toggle = () => {
    const v = ref.current
    if (!v) return
    const on = !sound
    v.muted = !on
    if (on) {
      v.currentTime = 0
      v.play().catch(() => {})
    }
    setSound(on)
  }

  return (
    <>
      <video ref={ref} src={src} poster={poster} muted loop playsInline preload="metadata" aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover" />
      <button type="button" onClick={toggle} aria-pressed={sound}
        className="absolute start-4 bottom-4 flex items-center gap-2 bg-[#faf5f5] text-[#8b1e3f] px-3 py-2 text-sm hover:bg-white transition-colors">
        {sound ? <Volume2 size={16} /> : <VolumeX size={16} />}
        {sound ? t('heroVideo.mute') : t('heroVideo.unmute')}
      </button>
    </>
  )
}

/** Hor tile with a muted looping clip instead of a photo */
export function TileVideo({ src, poster }: { src: string; poster: string }) {
  return (
    <video src={src} poster={poster} muted loop autoPlay playsInline preload="metadata" aria-hidden="true"
      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
  )
}

// ── Videos with a player overlay ────────────────────────────────────────────

const ArrowUpRight = () => (
  <svg className="block shrink-0 flip-rtl" width="16" height="16" fill="none" viewBox="0 0 11.5 11.5" aria-hidden="true">
    <path d="M0.75 10.75L10.75 0.75M10.75 10.75V0.75H0.75" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
  </svg>
)

/** Video cards (same look as the site's VideoCard) that open a player */
export function VideoGrid({ vids, label, portrait = false }: { vids: Vid[]; label: string; portrait?: boolean }) {
  const t = useTranslations('pozovite')
  const [open, setOpen] = useState<Vid | null>(null)
  return (
    <>
      <div className={portrait
        ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5'
        : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'}>
        {vids.map(v => {
          const m = vidMedia(v)
          const meta = [v.kind === 'yt' ? v.src : null, v.d, v.v != null ? t('videoGrid.views', { count: v.v }) : null].filter(Boolean).join(' · ')
          return (
            <button key={`${v.kind}-${v.id}`} type="button" onClick={() => setOpen(v)} className="group block h-full text-start">
              <span className="bg-[#f5f2ef] overflow-hidden border border-black/5 flex flex-col h-full">
                <span className={`relative block w-full shrink-0 overflow-hidden bg-[#e0d8d0] ${portrait ? 'aspect-[9/16]' : 'h-[228px]'}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.thumb} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute top-4 start-4 bg-[#faf5f5] px-2.5 py-1.5">
                    <span className="text-[#8b1e3f] uppercase" style={{ fontSize: 10, letterSpacing: '0.3px' }}>{m.badge === 'youtube' ? 'YouTube' : t(`videoGrid.badges.${m.badge}`)}</span>
                  </span>
                  <span className="absolute inset-0 m-auto size-12 rounded-full bg-black/40 grid place-items-center text-white opacity-90 group-hover:bg-[#8b1e3f] transition-colors">
                    {/* Play icons are not mirrored in right-to-left languages, so this optical nudge stays physical */}
                    <Play size={18} className="ml-0.5" fill="currentColor" />
                  </span>
                </span>
                <span className={`flex flex-col gap-2.5 flex-1 ${portrait ? 'px-4 py-4' : 'px-6 py-6'}`}>
                  {meta ? <span className="font-medium text-[#8b1e3f] text-xs uppercase tracking-wide">{meta}</span> : null}
                  <span className="font-medium text-[#241f1d] leading-[1.15] line-clamp-3 group-hover:text-[#8b1e3f] transition-colors"
                    style={{ fontSize: portrait ? 16 : 20, letterSpacing: portrait ? '-0.3px' : '-0.6px' }}>
                    {t(`videoTitles.${v.key}`)}
                  </span>
                </span>
              </span>
            </button>
          )
        })}
      </div>
      {open ? <Player vid={open} label={label} onClose={() => setOpen(null)} /> : null}
    </>
  )
}

function Player({ vid, label, onClose }: { vid: Vid; label: string; onClose: () => void }) {
  const t = useTranslations('pozovite')
  const m = vidMedia(vid)
  const title = t(`videoTitles.${vid.key}`)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
    }
  }, [onClose])

  return (
    <div role="dialog" aria-modal="true" aria-label={title} onClick={onClose}
      className="fixed inset-0 z-[70] bg-[#141110]/90 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div onClick={e => e.stopPropagation()} className={`w-full flex flex-col gap-3 ${m.tall ? 'max-w-[420px]' : 'max-w-[1016px]'}`}>
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-[#e0d8d0]">{label}</p>
            <h3 className="text-white font-semibold text-lg sm:text-xl leading-snug">{title}</h3>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label={t('player.close')}
            className="shrink-0 size-10 grid place-items-center border border-white/30 text-white hover:bg-white/10">
            <X size={18} />
          </button>
        </div>
        {vid.kind === 'yt' ? (
          <iframe src={`https://www.youtube-nocookie.com/embed/${vid.id}?autoplay=1&rel=0&playsinline=1`} title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen
            className="w-full aspect-video bg-black border border-white/10" />
        ) : (
          <video src={m.src} poster={m.thumb} controls autoPlay playsInline
            className="w-full max-h-[calc(100dvh-140px)] bg-black border border-white/10" />
        )}
      </div>
    </div>
  )
}

// ── Lecturer profile: choose the kind of program, then invite ──────────────

export function ProfileInvite({ name, aud, path }: { name: string; aud: Audience; path: string }) {
  const t = useTranslations('pozovite')
  const router = useRouter()
  const [format, setFormat] = useState<Format>(FORMATS[0])
  const invite = () => {
    // Bosnian names: the choice goes into the message for the Misbah team (see InquiryForm)
    const q = new URLSearchParams({ rubrika: INQUIRY_BS.rubrike.predavanja, izbor: `${INQUIRY_BS.audiences[aud]} · ${name} · ${INQUIRY_BS.formats[format]}`, nazad: path })
    router.push(`${BASE}/kontakt?${q}`)
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <p className="font-medium text-[#8b1e3f] text-base uppercase">{t('programPicker.label')}</p>
        <h2 className="font-semibold text-[#141110]" style={{ fontSize: 28, lineHeight: 1.3, letterSpacing: '-0.3px' }}>{t('programPicker.title')}</h2>
      </div>
      <div role="radiogroup" aria-label={t('programPicker.label')} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {FORMATS.map(f => {
          const on = f === format
          return (
            <button key={f} type="button" role="radio" aria-checked={on} onClick={() => setFormat(f)}
              className={`relative text-start flex flex-col gap-1 p-4 pe-10 border transition-colors ${on ? 'border-[#8b1e3f] bg-[#faf5f5]' : 'border-[#ede5dc] bg-white hover:border-[#d6ccc3]'}`}>
              <span className="font-semibold text-[#241f1d]">{t(`formats.${f}.title`)}</span>
              <span className="text-sm text-[#746860] leading-snug">{t(`formats.${f}.description`)}</span>
              <span className={`absolute top-4 end-4 size-5 rounded-full border-2 grid place-items-center ${on ? 'border-[#8b1e3f] bg-[#8b1e3f]' : 'border-[#d6ccc3]'}`}>
                {on ? <Check size={12} className="text-white" strokeWidth={3} /> : null}
              </span>
            </button>
          )
        })}
      </div>
      <button type="button" onClick={invite}
        className="self-start bg-[#8b1e3f] text-white flex items-center gap-2 ps-8 pe-6 py-3 text-base font-normal hover:bg-[#7a1a37] transition-colors">
        {t('actions.invite', { name })}
        <ArrowUpRight />
      </button>
    </div>
  )
}

// ── Contact ─────────────────────────────────────────────────────────────────

export function ContactQuick() {
  const t = useTranslations('pozovite')
  const toast = useToast()
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3 p-3 ps-4 border border-[#ede5dc] bg-[#faf7f2]">
        <span className="font-semibold text-[#241f1d] break-all select-all">{CONTACT.email}</span>
        <button type="button" className="ms-auto inline-flex items-center gap-1.5 border border-[#d6ccc3] px-3 py-1.5 text-sm text-[#5a4f49] hover:border-[#8b1e3f] hover:text-[#8b1e3f]"
          onClick={async () => toast.show((await copyText(CONTACT.email)) ? t('quickContact.addressCopied') : t('quickContact.copyAddressManually'))}>
          <Copy size={14} /> {t('quickContact.copy')}
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {/* INVITE_TEMPLATE is the Bosnian message for the Misbah team, in every language */}
        <a href={waHref(INVITE_TEMPLATE)} target="_blank" rel="noopener"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25d366] text-[#06301a] font-semibold hover:bg-[#45e283] transition-colors">
          <WhatsAppIcon /> WhatsApp
        </a>
        <a href={vbHref(INVITE_TEMPLATE)}
          onClick={async () => (await copyText(INVITE_TEMPLATE)) && toast.show(t('quickContact.viberCopied'))}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#7360f2] text-white font-semibold hover:bg-[#8a7bf5] transition-colors">
          <ViberIcon /> Viber
        </a>
        {/* dir="ltr": the digit groups of the number would be reversed in right-to-left text */}
        <span className="text-[#746860] text-sm font-mono" dir="ltr">{CONTACT.phone}</span>
      </div>
      {toast.node}
    </div>
  )
}

const field = 'w-full border border-[#ede5dc] bg-white px-3.5 py-2.5 text-[15px] text-[#241f1d] placeholder:text-[#a89888] focus:outline-none focus:border-[#8b1e3f]'

/** Unicode "left-to-right isolate" and "pop directional isolate" (invisible) */
const LRI = String.fromCharCode(0x2066)
const PDI = String.fromCharCode(0x2069)

/** Message key for a Bosnian name from INQUIRY_BS (as it arrives in ?izbor=…), to show it translated */
function choiceKey(bs: string): string | null {
  const find = <K extends string>(names: Record<K, string>) => (Object.keys(names) as K[]).find(k => names[k] === bs)
  const aud = find(INQUIRY_BS.audiences)
  if (aud) return `audiences.${aud}.title`
  const format = find(INQUIRY_BS.formats)
  if (format) return `formats.${format}.title`
  const hor = find(INQUIRY_BS.hor)
  if (hor) return `choir.groups.${hor}.title`
  return bs === INQUIRY_BS.druzenje ? 'gatherings.choice' : null
}

/**
 * Builds the inquiry and opens it in WhatsApp / Viber / e-mail (no data is stored).
 *
 * The form is shown in the visitor's language, but the message it prepares
 * goes to the Misbah team, so the message (and the e-mail subject) is always
 * written in Bosnian: fixed texts here and the Bosnian names from INQUIRY_BS,
 * never translations.
 */
export function InquiryForm() {
  const t = useTranslations('pozovite')
  const rtl = LOCALE_INFO[useCurrentLocale()].dir === 'rtl'
  const params = useSearchParams()
  const izbor = params.get('izbor') ?? ''
  const nazad = params.get('nazad') ?? ''
  const initialRub = RUBRIKE.find(r => INQUIRY_BS.rubrike[r] === params.get('rubrika')) ?? 'predavanja'
  const [rub, setRub] = useState<Rubrika>(initialRub)
  const [msg, setMsg] = useState('')
  const toast = useToast()

  // Bosnian, for the message: the choice from the link (Bosnian names) or the category
  const program = izbor && rub === initialRub ? izbor : INQUIRY_BS.rubrike[rub]
  // The same choice in the visitor's language, for the form (names of people stay as they are)
  const choice = izbor.split(' · ').map(part => {
    const key = choiceKey(part)
    return key ? t(key) : part
  }).join(' · ')
  // Keeps the phone number and e-mail in one piece inside right-to-left text
  const ltr = (s: string) => (rtl ? LRI + s + PDI : s)

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const val = (k: string) => String(f.get(k) ?? '').trim()
    const note = val('note')
    // Always Bosnian (see above)
    setMsg(
      `Selam alejkum,\n\nželjeli bismo ugostiti Misbah EDU.\n\nOrganizator: ${val('org') || '–'}\nMjesto: ${val('place') || '–'}\nDatum: ${val('date') || 'po dogovoru'}\nRubrika: ${INQUIRY_BS.rubrike[rub]}\nProgram: ${program}\n${note ? `\nNapomena: ${note}\n` : ''}\nHvala i selam!`,
    )
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4 p-5 sm:p-7 bg-[#faf7f2] border border-[#ede5dc]">
      <h3 className="font-semibold text-[#141110] text-2xl">{t('form.title')}</h3>
      {izbor ? (
        <div className="flex flex-wrap items-center gap-2 px-3.5 py-2.5 border border-[#ede5dc] bg-[#faf5f5] text-sm">
          <span className="text-[#5a4f49]">{t.rich('form.yourChoice', { choice, b: chunks => <b className="text-[#8b1e3f] font-semibold">{chunks}</b> })}</span>
          {nazad.startsWith(BASE) ? <Link href={nazad} className="ms-auto underline text-[#746860] hover:text-[#8b1e3f]">{t('form.change')}</Link> : null}
        </div>
      ) : null}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5 text-sm text-[#746860]">{t('form.organizer')}
          <input name="org" placeholder={t('form.organizerPlaceholder')} autoComplete="organization" className={field} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm text-[#746860]">{t('form.place')}
          <input name="place" placeholder={t('form.placePlaceholder')} className={field} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm text-[#746860]">{t('form.date')}
          <input name="date" placeholder={t('form.datePlaceholder')} className={field} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm text-[#746860]">{t('form.category')}
          <select name="rub" value={rub} onChange={e => setRub(e.target.value as Rubrika)} className={field}>
            {RUBRIKE.map(r => <option key={r} value={r}>{t(`form.categories.${r}`)}</option>)}
          </select>
        </label>
      </div>
      <label className="flex flex-col gap-1.5 text-sm text-[#746860]">{t('form.note')}
        <textarea name="note" rows={3} placeholder={t('form.notePlaceholder')} className={`${field} resize-y`} />
      </label>
      <button type="submit" className="self-start bg-[#8b1e3f] text-white flex items-center gap-2 ps-8 pe-6 py-3 text-base font-normal hover:bg-[#7a1a37] transition-colors">
        {t('form.prepare')}
        <ArrowUpRight />
      </button>

      {msg ? (
        <div className="flex flex-col gap-3">
          {/* The Bosnian message: left-to-right and marked as Bosnian on every language's page */}
          <pre lang="bs" dir="ltr" className="whitespace-pre-wrap font-sans text-sm text-[#5a4f49] bg-white border border-[#ede5dc] p-3.5 max-h-48 overflow-auto">{msg}</pre>
          <div className="flex flex-wrap gap-2.5">
            <a href={waHref(msg)} target="_blank" rel="noopener"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#25d366] text-[#06301a] font-semibold hover:bg-[#45e283]">
              <WhatsAppIcon /> {t('form.sendWhatsApp')}
            </a>
            <a href={vbHref(msg)} onClick={async () => (await copyText(msg)) && toast.show(t('form.viberCopied'))}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#7360f2] text-white font-semibold hover:bg-[#8a7bf5]">
              <ViberIcon /> Viber
            </a>
            <button type="button" onClick={async () => toast.show((await copyText(msg)) ? t('form.messageCopied') : t('form.copyManually'))}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#d6ccc3] bg-white text-[#5a4f49] hover:border-[#8b1e3f] hover:text-[#8b1e3f]">
              <Copy size={15} /> {t('form.copyMessage')}
            </button>
            <a href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(`Poziv – ${program}`)}&body=${encodeURIComponent(msg)}`}
              className="inline-flex items-center px-4 py-2.5 border border-[#d6ccc3] bg-white text-[#5a4f49] hover:border-[#8b1e3f] hover:text-[#8b1e3f]">
              {t('form.openEmail')}
            </a>
          </div>
          <p className="text-xs text-[#978a81] leading-relaxed">
            {t('form.hint', { phone: ltr(CONTACT.phone), email: ltr(CONTACT.email) })}
          </p>
        </div>
      ) : null}
      {toast.node}
    </form>
  )
}
