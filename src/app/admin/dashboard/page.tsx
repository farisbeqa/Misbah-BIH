import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  Plus, Play, BookOpen, ExternalLink, Youtube, Instagram, Facebook,
  Calendar, Pencil, Users, ShieldCheck, Music2, BookMarked, Mic,
} from 'lucide-react'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getPlatformLabel } from '@/lib/videoUtils'
import DeleteButton from './DeleteButton'
import LogoutButton from './LogoutButton'

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.25 8.25 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z" />
  </svg>
)

function PlatformIcon({ platform }: { platform: string }) {
  switch (platform) {
    case 'youtube':   return <Youtube size={15} className="text-red-500" />
    case 'instagram': return <Instagram size={15} className="text-pink-500" />
    case 'facebook':  return <Facebook size={15} className="text-blue-500" />
    case 'tiktok':    return <TikTokIcon />
    default:          return <Play size={15} />
  }
}

function fmt(d: Date) {
  return d.toLocaleDateString('bs-BA', { day: 'numeric', month: 'short', year: 'numeric' })
}

type Video = Awaited<ReturnType<typeof prisma.video.findMany>>[number]

function VideoSection({
  title, items, cat, accentColor, publicHref, icon,
}: {
  title: string
  items: Video[]
  cat: string
  accentColor: string
  publicHref: string
  icon: React.ReactNode
}) {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-zinc-900 flex items-center gap-2">
          <span className="flex-shrink-0">{icon}</span>
          {title}
          <span className="text-zinc-400 font-normal text-sm">({items.length})</span>
        </h2>
        <div className="flex items-center gap-3">
          <Link href={publicHref} target="_blank"
            className="text-xs text-zinc-400 hover:text-zinc-600 flex items-center gap-1">
            <ExternalLink size={11} /> Javna
          </Link>
          <Link href={`/admin/videos/new?category=${cat}`}
            className="text-xs hover:underline flex items-center gap-1 font-medium"
            style={{ color: accentColor }}>
            <Plus size={12} /> Dodaj
          </Link>
        </div>
      </div>
      {items.length === 0 ? (
        <div className="bg-white rounded-2xl p-6 text-center border border-dashed border-zinc-200">
          <p className="text-zinc-400 text-sm">
            Nema sadržaja.{' '}
            <Link href={`/admin/videos/new?category=${cat}`}
              className="hover:underline font-medium" style={{ color: accentColor }}>
              Dodaj prvi.
            </Link>
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-card overflow-hidden">
          {items.slice(0, 5).map((v, i) => (
            <div key={v.id}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 transition-colors ${i > 0 ? 'border-t border-zinc-100' : ''}`}>
              <PlatformIcon platform={v.platform} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-zinc-900 text-sm truncate">{v.title}</p>
                <div className="flex items-center gap-2 text-zinc-400 text-xs mt-0.5">
                  <span>{getPlatformLabel(v.platform)}</span>
                  <span>·</span>
                  <Calendar size={9} /><span>{fmt(v.createdAt)}</span>
                  {v.isShortForm && <span className="bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-500">Kratki</span>}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Link href={`/admin/videos/${v.id}/edit`} title="Uredi"
                  className="p-1.5 text-zinc-300 hover:text-brand transition-colors">
                  <Pencil size={13} />
                </Link>
                <Link href={`/videos/${v.id}`} target="_blank" title="Pregledaj"
                  className="p-1.5 text-zinc-300 hover:text-zinc-600 transition-colors">
                  <ExternalLink size={13} />
                </Link>
                <DeleteButton id={v.id} type="video" />
              </div>
            </div>
          ))}
          {items.length > 5 && (
            <div className="px-4 py-2.5 border-t border-zinc-100 text-center">
              <Link href={`/admin/videos/sve?cat=${cat}`}
                className="text-xs text-brand hover:underline font-medium">
                Vidi svih {items.length} stavki →
              </Link>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default async function AdminDashboard() {
  const session = await requireAuth()
  if (!session) redirect('/admin')

  const [videos, posts, activities, galleryImages, quotes, userCount] = await Promise.all([
    prisma.video.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.activity.findMany({ orderBy: { date: 'desc' } }),
    prisma.galleryImage.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.quote.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.user.count(),
  ])

  const byCat = (cat: string) => videos.filter(v => v.category === cat)
  const predavanja = byCat('predavanja')
  const kuran      = byCat('kuran')
  const ilahije    = byCat('ilahije')
  const zikrovi    = byCat('zikrovi')
  const podcasts   = byCat('podcast')

  const videoSections = [
    { cat: 'predavanja', label: 'Predavanja',      items: predavanja, color: '#8B1E3F', publicHref: '/videos',   icon: <Play size={14} className="text-red-500" /> },
    { cat: 'kuran',      label: "Kur'an / Učanje",  items: kuran,      color: '#059669', publicHref: '/kuran',    icon: <BookMarked size={14} className="text-emerald-600" /> },
    { cat: 'ilahije',    label: 'Ilahije i kaside', items: ilahije,    color: '#7C3AED', publicHref: '/ilahije',  icon: <Music2 size={14} className="text-purple-500" /> },
    { cat: 'zikrovi',    label: 'Zikrovi i dove',   items: zikrovi,    color: '#2563EB', publicHref: '/zikrovi',  icon: <BookOpen size={14} className="text-blue-500" /> },
    { cat: 'podcast',    label: 'Podcasts',          items: podcasts,   color: '#EA580C', publicHref: '/podcasts', icon: <Mic size={14} className="text-orange-500" /> },
  ]

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Nav */}
      <nav className="bg-zinc-950 text-white px-4 sm:px-6 py-4 sticky top-0 z-30 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center text-white font-black text-sm">م</div>
            <span className="font-black text-sm">Misbah EDU</span>
            <span className="text-zinc-500 text-xs font-medium px-2 py-0.5 bg-zinc-800 rounded-md">Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" target="_blank"
              className="hidden sm:flex items-center gap-1.5 text-zinc-400 hover:text-white text-xs transition-colors">
              <ExternalLink size={12} /> Portal
            </Link>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-zinc-900">Dobrodošao, {session.username}!</h1>
              {session.isSuperAdmin && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                  <ShieldCheck size={11} /> Super Admin
                </span>
              )}
            </div>
            <p className="text-zinc-500 text-sm mt-1">Upravljaj sadržajem portala</p>
          </div>
          {session.isSuperAdmin && (
            <Link href="/admin/admin-users"
              className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors">
              <ShieldCheck size={14} /> Upravljaj adminima
            </Link>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Video sadržaj', value: videos.length,     icon: <Play size={16} className="text-red-500" />,      bg: 'bg-red-50' },
            { label: 'Blog postovi',  value: posts.length,      icon: <BookOpen size={16} className="text-amber-500" />, bg: 'bg-amber-50' },
            { label: 'Aktivnosti',    value: activities.length, icon: <span className="text-base">🏔️</span>,            bg: 'bg-green-50' },
            { label: 'Korisnici',     value: userCount,         icon: <Users size={16} className="text-brand" />,       bg: 'bg-brand-dim', href: '/admin/users' },
          ].map(s => (
            s.href ? (
              <Link key={s.label} href={s.href}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-zinc-100 shadow-card hover:border-brand/30 transition-colors block">
                <div className={`w-8 h-8 ${s.bg} rounded-lg flex items-center justify-center mb-2`}>{s.icon}</div>
                <p className="text-2xl sm:text-3xl font-black text-zinc-900">{s.value}</p>
                <p className="text-zinc-400 text-xs mt-0.5">{s.label}</p>
              </Link>
            ) : (
              <div key={s.label} className="bg-white rounded-2xl p-4 sm:p-5 border border-zinc-100 shadow-card">
                <div className={`w-8 h-8 ${s.bg} rounded-lg flex items-center justify-center mb-2`}>{s.icon}</div>
                <p className="text-2xl sm:text-3xl font-black text-zinc-900">{s.value}</p>
                <p className="text-zinc-400 text-xs mt-0.5">{s.label}</p>
              </div>
            )
          ))}
        </div>

        {/* Quick actions - one button per section */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {videoSections.map(s => (
            <Link key={s.cat} href={`/admin/videos/new?category=${s.cat}`}
              className="flex items-center gap-3 text-white p-4 rounded-2xl transition-opacity hover:opacity-90 shadow-sm"
              style={{ background: s.color }}>
              <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Plus size={18} />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm leading-tight">{s.label}</p>
                <p className="text-white/60 text-xs mt-0.5">{s.items.length} objava</p>
              </div>
            </Link>
          ))}
          <Link href="/admin/blog/new"
            className="flex items-center gap-3 text-zinc-900 p-4 rounded-2xl transition-opacity hover:opacity-90 shadow-sm bg-amber-400">
            <div className="w-8 h-8 bg-black/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Plus size={18} />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm leading-tight">Blog</p>
              <p className="text-amber-800 text-xs mt-0.5">{posts.length} objava</p>
            </div>
          </Link>
          <Link href="/admin/activities/new"
            className="flex items-center gap-3 text-white p-4 rounded-2xl transition-opacity hover:opacity-90 shadow-sm"
            style={{ background: '#2d6a4f' }}>
            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Plus size={18} />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm leading-tight">Aktivnosti</p>
              <p className="text-white/60 text-xs mt-0.5">{activities.length} objava</p>
            </div>
          </Link>
          <Link href="/admin/gallery/new"
            className="flex items-center gap-3 text-white p-4 rounded-2xl transition-opacity hover:opacity-90 shadow-sm"
            style={{ background: '#0369a1' }}>
            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Plus size={18} />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm leading-tight">Galerija</p>
              <p className="text-white/60 text-xs mt-0.5">{galleryImages.length} slika</p>
            </div>
          </Link>
          <Link href="/admin/quotes/new"
            className="flex items-center gap-3 text-white p-4 rounded-2xl transition-opacity hover:opacity-90 shadow-sm"
            style={{ background: '#7C3AED' }}>
            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Plus size={18} />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm leading-tight">Misao dana</p>
              <p className="text-white/60 text-xs mt-0.5">{quotes.length} misli</p>
            </div>
          </Link>
        </div>

        {/* Video sections per category */}
        {videoSections.map(s => (
          <VideoSection key={s.cat}
            title={s.label}
            items={s.items}
            cat={s.cat}
            accentColor={s.color}
            publicHref={s.publicHref}
            icon={s.icon}
          />
        ))}

        {/* Blog posts */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-zinc-900 flex items-center gap-2">
              <BookOpen size={14} className="text-amber-400" />
              Blog postovi
              <span className="text-zinc-400 font-normal text-sm">({posts.length})</span>
            </h2>
            <div className="flex items-center gap-3">
              <Link href="/blog" target="_blank"
                className="text-xs text-zinc-400 hover:text-zinc-600 flex items-center gap-1">
                <ExternalLink size={11} /> Javna
              </Link>
              <Link href="/admin/blog/new"
                className="text-xs text-amber-500 hover:underline flex items-center gap-1 font-medium">
                <Plus size={12} /> Dodaj
              </Link>
            </div>
          </div>
          {posts.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-zinc-200">
              <BookOpen size={32} className="text-zinc-200 mx-auto mb-2" />
              <p className="text-zinc-400 text-sm">Nema blog postova. Dodaj prvi.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-zinc-100 shadow-card overflow-hidden">
              {posts.slice(0, 5).map((p, i) => (
                <div key={p.id}
                  className={`flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 transition-colors ${i > 0 ? 'border-t border-zinc-100' : ''}`}>
                  <BookOpen size={15} className="text-amber-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-zinc-900 text-sm truncate">{p.title}</p>
                    <div className="flex items-center gap-1.5 text-zinc-400 text-xs mt-0.5">
                      <Calendar size={9} /><span>{fmt(p.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Link href={`/admin/blog/${p.id}/edit`} title="Uredi"
                      className="p-1.5 text-zinc-300 hover:text-amber-500 transition-colors">
                      <Pencil size={13} />
                    </Link>
                    <Link href={`/blog/${p.id}`} target="_blank" title="Pregledaj"
                      className="p-1.5 text-zinc-300 hover:text-zinc-600 transition-colors">
                      <ExternalLink size={13} />
                    </Link>
                    <DeleteButton id={p.id} type="blog" />
                  </div>
                </div>
              ))}
              {posts.length > 5 && (
                <div className="px-4 py-2.5 border-t border-zinc-100 text-center">
                  <Link href="/admin/blog/svi" className="text-xs text-amber-500 hover:underline font-medium">
                    Vidi svih {posts.length} postova →
                  </Link>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Activities */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-zinc-900 flex items-center gap-2">
              <span>🏔️</span>
              Aktivnosti
              <span className="text-zinc-400 font-normal text-sm">({activities.length})</span>
            </h2>
            <div className="flex items-center gap-3">
              <Link href="/aktivnosti" target="_blank"
                className="text-xs text-zinc-400 hover:text-zinc-600 flex items-center gap-1">
                <ExternalLink size={11} /> Javna
              </Link>
              <Link href="/admin/activities/new"
                className="text-xs hover:underline flex items-center gap-1 font-medium"
                style={{ color: '#2d6a4f' }}>
                <Plus size={12} /> Dodaj
              </Link>
            </div>
          </div>
          {activities.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-zinc-200">
              <span className="text-3xl block mb-2">🏔️</span>
              <p className="text-zinc-400 text-sm">Nema aktivnosti. Dodaj prvu.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-zinc-100 shadow-card overflow-hidden">
              {activities.slice(0, 5).map((a, i) => (
                <div key={a.id}
                  className={`flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 transition-colors ${i > 0 ? 'border-t border-zinc-100' : ''}`}>
                  <span className="text-base flex-shrink-0">🏔️</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-zinc-900 text-sm truncate">{a.title}</p>
                    <div className="flex items-center gap-1.5 text-zinc-400 text-xs mt-0.5">
                      <Calendar size={9} /><span>{fmt(a.date)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Link href={`/admin/activities/${a.id}/edit`} title="Uredi"
                      className="p-1.5 text-zinc-300 hover:text-green-600 transition-colors">
                      <Pencil size={13} />
                    </Link>
                    <Link href={`/aktivnosti/${a.id}`} target="_blank" title="Pregledaj"
                      className="p-1.5 text-zinc-300 hover:text-zinc-600 transition-colors">
                      <ExternalLink size={13} />
                    </Link>
                    <DeleteButton id={a.id} type="activity" />
                  </div>
                </div>
              ))}
              {activities.length > 5 && (
                <div className="px-4 py-2.5 border-t border-zinc-100 text-center">
                  <Link href="/admin/activities/sve" className="text-xs hover:underline font-medium" style={{ color: '#2d6a4f' }}>
                    Vidi svih {activities.length} aktivnosti →
                  </Link>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Gallery */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-zinc-900 flex items-center gap-2">
              <span>🖼️</span>
              Galerija
              <span className="text-zinc-400 font-normal text-sm">({galleryImages.length})</span>
            </h2>
            <div className="flex items-center gap-3">
              <Link href="/galerija" target="_blank"
                className="text-xs text-zinc-400 hover:text-zinc-600 flex items-center gap-1">
                <ExternalLink size={11} /> Javna
              </Link>
              <Link href="/admin/gallery/new"
                className="text-xs hover:underline flex items-center gap-1 font-medium"
                style={{ color: '#0369a1' }}>
                <Plus size={12} /> Dodaj
              </Link>
            </div>
          </div>
          {galleryImages.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-zinc-200">
              <span className="text-3xl block mb-2">🖼️</span>
              <p className="text-zinc-400 text-sm">Nema slika u galeriji. Dodaj prvu.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-zinc-100 shadow-card overflow-hidden">
              {/* Image grid preview */}
              <div className="grid grid-cols-5 sm:grid-cols-8 gap-1.5 p-3">
                {galleryImages.slice(0, 16).map(img => (
                  <div key={img.id} className="group relative aspect-square rounded-lg overflow-hidden"
                    style={{ background: '#E8E1DB' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.imageUrl} alt={img.title || ''} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <DeleteButton id={img.id} type="gallery" />
                    </div>
                  </div>
                ))}
              </div>
              {galleryImages.length > 16 && (
                <div className="px-4 py-2.5 border-t border-zinc-100 text-center">
                  <span className="text-xs text-zinc-400">+ još {galleryImages.length - 16} slika</span>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Quotes - Misao dana */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-zinc-900 flex items-center gap-2">
              <span>💬</span>
              Misao dana
              <span className="text-zinc-400 font-normal text-sm">({quotes.length})</span>
            </h2>
            <Link href="/admin/quotes/new"
              className="text-xs hover:underline flex items-center gap-1 font-medium"
              style={{ color: '#7C3AED' }}>
              <Plus size={12} /> Dodaj
            </Link>
          </div>
          {quotes.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-zinc-200">
              <span className="text-3xl block mb-2">💬</span>
              <p className="text-zinc-400 text-sm">Nema misli. Dodaj prvu.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-zinc-100 shadow-card overflow-hidden">
              {quotes.slice(0, 5).map((q, i) => {
                const typeColors: Record<string, string> = { ajet: '#8B1E3F', hadis: '#2563EB', izreka: '#059669' }
                const typeLabels: Record<string, string> = { ajet: 'Ajet', hadis: 'Hadis', izreka: 'Izreka' }
                return (
                  <div key={q.id}
                    className={`flex items-start gap-3 px-4 py-3 hover:bg-zinc-50 transition-colors ${i > 0 ? 'border-t border-zinc-100' : ''}`}>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-full mt-0.5 flex-shrink-0"
                      style={{ background: `${typeColors[q.type] ?? '#7C3AED'}15`, color: typeColors[q.type] ?? '#7C3AED' }}>
                      {typeLabels[q.type] ?? q.type}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-zinc-900 text-sm line-clamp-2">{q.text}</p>
                      {q.source && <p className="text-zinc-400 text-xs mt-0.5">{q.source}</p>}
                    </div>
                    <DeleteButton id={q.id} type="quote" />
                  </div>
                )
              })}
              {quotes.length > 5 && (
                <div className="px-4 py-2.5 border-t border-zinc-100 text-center">
                  <span className="text-xs text-zinc-400">+ još {quotes.length - 5} misli</span>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
