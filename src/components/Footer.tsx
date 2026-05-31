import Link from 'next/link'
import Image from 'next/image'
import { Youtube, Instagram, Facebook } from 'lucide-react'

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.25 8.25 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z" />
  </svg>
)

const socials = [
  { href: 'https://www.youtube.com/@misbah_ba',    Icon: Youtube,    label: 'YouTube' },
  { href: 'https://www.instagram.com/misbah_bih/', Icon: Instagram,  label: 'Instagram' },
  { href: 'https://www.tiktok.com/@misbah_ba',     Icon: TikTokIcon, label: 'TikTok' },
  { href: 'https://www.facebook.com/MisbahBIH/',   Icon: Facebook,   label: 'Facebook' },
]

// Warm beige footer — rich and editorial, no black
const BG      = '#E7D6C7'  // secondary-default
const BORDER  = '#CDB8A6'  // secondary-dark
const TEXT    = '#3F3733'  // warm-800
const MUTED   = '#746860'  // warm-600
const LINK    = '#5A4F49'  // warm-700
const BURGUNDY = '#8B1E3F'
const GOLD     = '#C8A96B'

export default function Footer() {
  return (
    <footer style={{ background: BG, borderTop: `1px solid ${BORDER}` }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-12">

          {/* Brand */}
          <div className="sm:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <Image src="/logo.jpg" alt="Misbah EDU" width={36} height={36} className="rounded-lg object-cover" />
              <span className="font-extrabold text-base tracking-tight" style={{ color: TEXT }}>
                Misbah{' '}
                <span style={{ color: BURGUNDY }}>EDU</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: MUTED }}>
              Islamska predavanja i sadržaj za muslimansku zajednicu u Bosni i Hercegovini.
            </p>
            <p className="font-mono text-xs mt-4 tracking-wider" style={{ color: MUTED }}>
              بسم الله الرحمن الرحيم
            </p>
          </div>

          {/* Nav */}
          <div className="sm:col-span-3">
            <p className="font-mono text-[11px] uppercase tracking-widest mb-4" style={{ color: MUTED }}>
              Navigacija
            </p>
            <ul className="space-y-2.5">
              {[['/', 'Početna'], ['/videos', 'Predavanja'], ['/blog', 'Blog']].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-sm transition-colors hover:underline"
                    style={{ color: LINK }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div className="sm:col-span-4">
            <p className="font-mono text-[11px] uppercase tracking-widest mb-4" style={{ color: MUTED }}>
              Društvene mreže
            </p>
            <div className="flex flex-col gap-2.5">
              {socials.map(s => (
                <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm transition-colors hover:underline"
                  style={{ color: LINK }}>
                  <s.Icon />
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: `1px solid ${BORDER}` }}>
          <p className="font-mono text-[11px]" style={{ color: MUTED }}>
            © {new Date().getFullYear()} Strossa d.o.o. Sva prava zadržana.
          </p>
        </div>
      </div>
    </footer>
  )
}
