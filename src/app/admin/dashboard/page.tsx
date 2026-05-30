import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Plus, Play, BookOpen, ExternalLink, Youtube, Instagram, Facebook, Calendar, Pencil, Users, ShieldCheck } from 'lucide-react'
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

export default async function AdminDashboard() {
  const session = await requireAuth()
  if (!session) redirect('/admin')

  const [videos, posts, videoCount, postCount, userCount] = await Promise.all([
    prisma.video.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.video.count(),
    prisma.blogPost.count(),
    prisma.user.count(),
  ])

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Nav */}
      <nav className="bg-zinc-950 text-white px-4 sm:px-6 py-4 sticky top-0 z-30 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center text-white font-black text-sm">م</div>
            <span className="font-black text-sm">Misbah BIH</span>
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
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Predavanja', value: videoCount, icon: <Play size={16} className="text-red-500" />, bg: 'bg-red-50', href: null },
            { label: 'Blog postovi', value: postCount, icon: <BookOpen size={16} className="text-amber-500" />, bg: 'bg-amber-50', href: null },
            { label: 'Korisnici', value: userCount, icon: <Users size={16} className="text-brand" />, bg: 'bg-brand-dim', href: '/admin/users' },
          ].map(s => (
            s.href ? (
              <Link key={s.label} href={s.href} className="bg-white rounded-2xl p-4 sm:p-5 border border-zinc-100 shadow-card hover:border-brand/30 transition-colors block">
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

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <Link href="/admin/videos/new"
            className="flex items-center gap-3 bg-brand hover:bg-brand-light text-white p-5 rounded-2xl transition-colors shadow-sm group">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><Plus size={20} /></div>
            <div>
              <p className="font-bold">Dodaj predavanje</p>
              <p className="text-green-200 text-xs mt-0.5">YouTube · Instagram · TikTok · Facebook</p>
            </div>
          </Link>
          <Link href="/admin/blog/new"
            className="flex items-center gap-3 bg-amber-400 hover:bg-amber-300 text-zinc-900 p-5 rounded-2xl transition-colors shadow-sm group">
            <div className="w-10 h-10 bg-black/10 rounded-xl flex items-center justify-center"><Plus size={20} /></div>
            <div>
              <p className="font-bold">Dodaj blog post</p>
              <p className="text-amber-800 text-xs mt-0.5">Tekst sa slikom</p>
            </div>
          </Link>
        </div>

        {/* Videos */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-zinc-900">Predavanja <span className="text-zinc-400 font-normal text-sm">({videoCount})</span></h2>
            <Link href="/admin/videos/new" className="text-xs text-brand hover:underline flex items-center gap-1"><Plus size={12} /> Dodaj</Link>
          </div>
          {videos.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-zinc-200">
              <Play size={32} className="text-zinc-200 mx-auto mb-2" />
              <p className="text-zinc-400 text-sm">Nema predavanja. Dodaj prvo.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-zinc-100 shadow-card overflow-hidden">
              {videos.map((v, i) => (
                <div key={v.id} className={`flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 transition-colors ${i > 0 ? 'border-t border-zinc-100' : ''}`}>
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
            </div>
          )}
        </section>

        {/* Blog posts */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-zinc-900">Blog postovi <span className="text-zinc-400 font-normal text-sm">({postCount})</span></h2>
            <Link href="/admin/blog/new" className="text-xs text-brand hover:underline flex items-center gap-1"><Plus size={12} /> Dodaj</Link>
          </div>
          {posts.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-zinc-200">
              <BookOpen size={32} className="text-zinc-200 mx-auto mb-2" />
              <p className="text-zinc-400 text-sm">Nema blog postova. Dodaj prvi.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-zinc-100 shadow-card overflow-hidden">
              {posts.map((p, i) => (
                <div key={p.id} className={`flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 transition-colors ${i > 0 ? 'border-t border-zinc-100' : ''}`}>
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
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
