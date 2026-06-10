import Link from 'next/link'
import Image from 'next/image'

function TikTokIcon() {
  return (
    <svg className="size-5" fill="none" viewBox="0 0 24 24">
      <path d="M16.6 5.82C15.9166 5.03953 15.5399 4.0374 15.54 3H12.45V15.4C12.4267 16.0712 12.1435 16.7071 11.6603 17.1735C11.1771 17.6399 10.5316 17.9004 9.86 17.9C8.44 17.9 7.26 16.74 7.26 15.3C7.26 13.58 8.92 12.29 10.63 12.82V9.66C7.18 9.2 4.16 11.88 4.16 15.3C4.16 18.63 6.92 21 9.85 21C12.99 21 15.54 18.45 15.54 15.3V9.01C16.793 9.90985 18.2974 10.3926 19.84 10.39V7.3C19.84 7.3 17.96 7.39 16.6 5.82Z" fill="#141110" />
    </svg>
  )
}

function YouTubeIcon() {
  return (
    <svg className="size-5" fill="none" viewBox="0 0 24 24">
      <path d="M10 15L15.19 12L10 9V15ZM21.56 7.17C21.69 7.64 21.78 8.27 21.84 9.07C21.91 9.87 21.94 10.56 21.94 11.16L22 12C22 14.19 21.84 15.8 21.56 16.83C21.31 17.73 20.73 18.31 19.83 18.56C19.36 18.69 18.5 18.78 17.18 18.84C15.88 18.91 14.69 18.94 13.59 18.94L12 19C7.81 19 5.2 18.84 4.17 18.56C3.27 18.31 2.69 17.73 2.44 16.83C2.31 16.36 2.22 15.73 2.16 14.93C2.09 14.13 2.06 13.44 2.06 12.84L2 12C2 9.81 2.16 8.2 2.44 7.17C2.69 6.27 3.27 5.69 4.17 5.44C4.64 5.31 5.5 5.22 6.82 5.16C8.12 5.09 9.31 5.06 10.41 5.06L12 5C16.19 5 18.8 5.16 19.83 5.44C20.73 5.69 21.31 6.27 21.56 7.17Z" fill="#141110" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg className="size-5" fill="none" viewBox="0 0 24 24">
      <path d="M13.028 2C14.153 2.003 14.724 2.009 15.217 2.023L15.411 2.03C15.635 2.038 15.856 2.048 16.123 2.06C17.187 2.11 17.913 2.278 18.55 2.525C19.21 2.779 19.766 3.123 20.322 3.678C20.8307 4.17773 21.2242 4.78247 21.475 5.45C21.722 6.087 21.89 6.813 21.94 7.878C21.952 8.144 21.962 8.365 21.97 8.59L21.976 8.784C21.991 9.276 21.997 9.847 21.999 10.972L22 11.718V13.028C22.0024 13.7574 21.9948 14.4868 21.977 15.216L21.971 15.41C21.963 15.635 21.953 15.856 21.941 16.122C21.891 17.187 21.721 17.912 21.475 18.55C21.2242 19.2175 20.8307 19.8223 20.322 20.322C19.8223 20.8307 19.2175 21.2242 18.55 21.475C17.913 21.722 17.187 21.89 16.123 21.94L15.411 21.97L15.217 21.976C14.724 21.99 14.153 21.997 13.028 21.999L12.282 22H10.973C10.2433 22.0026 9.51352 21.9949 8.784 21.977L8.59 21.971C8.35261 21.962 8.11527 21.9517 7.878 21.94C6.814 21.89 6.088 21.722 5.45 21.475C4.78283 21.2241 4.17844 20.8306 3.679 20.322C3.16995 19.8224 2.77611 19.2176 2.525 18.55C2.278 17.913 2.11 17.187 2.06 16.122L2.03 15.41L2.025 15.216C2.00657 14.4868 1.99823 13.7574 2 13.028V10.972C1.99723 10.2426 2.00457 9.5132 2.022 8.784L2.029 8.59C2.037 8.365 2.047 8.144 2.059 7.878C2.109 6.813 2.277 6.088 2.524 5.45C2.77569 4.7822 3.17022 4.17744 3.68 3.678C4.17915 3.16955 4.78319 2.77607 5.45 2.525C6.088 2.278 6.813 2.11 7.878 2.06C8.144 2.048 8.366 2.038 8.59 2.03L8.784 2.024C9.51319 2.00623 10.2426 1.99857 10.972 2.001L13.028 2ZM12 7C10.6739 7 9.40215 7.52678 8.46447 8.46447C7.52678 9.40215 7 10.6739 7 12C7 13.3261 7.52678 14.5979 8.46447 15.5355C9.40215 16.4732 10.6739 17 12 17C13.3261 17 14.5979 16.4732 15.5355 15.5355C16.4732 14.5979 17 13.3261 17 12C17 10.6739 16.4732 9.40215 15.5355 8.46447C14.5979 7.52678 13.3261 7 12 7ZM12 9C12.7956 9 13.5587 9.31607 14.1213 9.87868C14.6839 10.4413 15 11.2044 15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7956 15 12 15C11.2044 15 10.4413 14.6839 9.87868 14.1213C9.31607 13.5587 9 12.7956 9 12C9 11.2044 9.31607 10.4413 9.87868 9.87868C10.4413 9.31607 11.2044 9 12 9ZM17.251 5.5C16.9195 5.5 16.6015 5.6317 16.3671 5.86612C16.1327 6.10054 16.001 6.41848 16.001 6.75C16.001 7.08152 16.1327 7.39946 16.3671 7.63388C16.6015 7.8683 16.9195 8 17.251 8C17.5825 8 17.9005 7.8683 18.1349 7.63388C18.3693 7.39946 18.501 7.08152 18.501 6.75C18.501 6.41848 18.3693 6.10054 18.1349 5.86612C17.9005 5.6317 17.5825 5.5 17.251 5.5Z" fill="#141110" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg className="size-5" fill="none" viewBox="0 0 24 24">
      <path d="M22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 16.84 5.44 20.87 10 21.8V15H8V12H10V9.5C10 7.57 11.57 6 13.5 6H16V9H14C13.45 9 13 9.45 13 10V12H16V15H13V21.95C18.05 21.45 22 17.19 22 12Z" fill="#141110" />
    </svg>
  )
}

const SOCIAL = [
  { href: 'https://www.tiktok.com/@misbah_ba',     Icon: TikTokIcon,    label: 'TikTok' },
  { href: 'https://www.youtube.com/@misbah_ba',    Icon: YouTubeIcon,   label: 'YouTube' },
  { href: 'https://www.instagram.com/misbah_edu?igsh=c2N1MmJrMHQwcmZ1', Icon: InstagramIcon, label: 'Instagram' },
  { href: 'https://www.facebook.com/MisbahBIH/',   Icon: FacebookIcon,  label: 'Facebook' },
]

const NAV_LINKS = [
  { href: '/',                  label: 'Početna' },
  { href: '/predavanja/duga',   label: 'Predavanja' },
  { href: '/kuran',             label: "Kur'an" },
  { href: '/podcasts',          label: 'Podcast' },
  { href: '/blog',              label: 'Blog' },
  { href: '/o-nama',            label: 'O nama' },
]

export default function Footer() {
  return (
    <footer className="bg-[#fcfbfa] w-full overflow-hidden">
      {/* Main row */}
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20 py-12 flex flex-col lg:flex-row items-start justify-between gap-10">
        {/* Logo + description + social */}
        <div className="flex flex-col gap-8 max-w-[445px]">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Image src="/logo.jpg" alt="Misbah EDU" width={56} height={56} className="object-cover mix-blend-multiply" />
            <span className="font-bold text-[28px] leading-none text-[#8b1e3f]">
              Misbah <span className="text-[#c8a96b]">EDU</span>
            </span>
          </Link>
          <p className="font-normal text-[#746860] max-w-[320px]" style={{ fontSize: 16, lineHeight: 1.5 }}>
            Misbah EDU je digitalna platforma posvećena širenju korisnog znanja kroz
            predavanja, razgovore i pisane sadržaje koji povezuju vjeru sa
            svakodnevnim životom.
          </p>
          <div className="flex flex-col gap-4">
            <p className="font-normal text-[#746860] uppercase" style={{ fontSize: 13, letterSpacing: '0.42px' }}>
              OSTANIMO POVEZANI
            </p>
            <div className="flex gap-1.5">
              {SOCIAL.map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center border border-[#141110] hover:bg-gray-100 transition-colors"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Nav + Contact */}
        <div className="flex flex-col sm:flex-row gap-10 w-full sm:w-auto">
          <div className="flex flex-col gap-4">
            <p className="font-normal text-[#746860] uppercase" style={{ fontSize: 13, letterSpacing: '0.42px' }}>
              NAVIGACIJA
            </p>
            <div className="flex flex-col gap-0.5">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="py-1 font-normal text-[#141110] text-base hover:text-[#8b1e3f] transition-colors"
                  style={{ lineHeight: 1.5 }}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <p className="font-normal text-[#746860] uppercase" style={{ fontSize: 13, letterSpacing: '0.42px' }}>
              KONTAKT
            </p>
            <div className="flex flex-col gap-0.5">
              <p className="py-1 font-normal text-[#141110] text-base" style={{ lineHeight: 1.5 }}>
                misbah.bosna@gmail.com
              </p>
              <p className="py-1 font-normal text-[#141110] text-base" style={{ lineHeight: 1.5 }}>
                Sarajevo, Bosna i Hercegovina
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Legal bar */}
      <div className="bg-[#f5f2ef]">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20 py-3 flex items-center justify-between">
          <a
            href="https://strossa.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-normal text-[#746860] uppercase hover:text-[#141110] transition-colors"
            style={{ fontSize: 13, letterSpacing: '0.42px' }}
          >
            © STROSSA, 2026
          </a>
          <p className="font-normal text-[#746860] uppercase" style={{ fontSize: 13, letterSpacing: '0.42px' }}>
            © 2026 Misbah EDU. Sva prava zadržana.
          </p>
        </div>
      </div>
    </footer>
  )
}
