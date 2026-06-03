import Link from 'next/link'
import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { ArrowLeft, Calendar, Pencil } from 'lucide-react'
import DeleteButton from '../../dashboard/DeleteButton'

function fmt(d: Date) {
  return d.toLocaleDateString('bs-BA', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function AdminGallerySvePage() {
  const session = await requireAuth()
  if (!session) redirect('/admin')

  const images = await prisma.galleryImage.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div className="min-h-screen bg-zinc-50">
      <nav className="bg-zinc-950 text-white px-4 sm:px-6 py-4 sticky top-0 z-30 border-b border-zinc-800">
        <div className="max-w-4xl mx-auto flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center text-white font-black text-sm">م</div>
          <span className="font-black text-sm">Misbah EDU</span>
          <span className="text-zinc-500 text-xs px-2 py-0.5 bg-zinc-800 rounded-md">Admin</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-800 mb-6 text-sm">
          <ArrowLeft size={15} /> Nazad na dashboard
        </Link>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-black text-zinc-900">
            Galerija <span className="text-zinc-400 font-normal text-base">({images.length})</span>
          </h1>
          <Link href="/admin/gallery/new"
            className="text-sm font-semibold px-4 py-2 rounded-xl text-white transition-opacity hover:opacity-90"
            style={{ background: '#0369a1' }}>
            + Dodaj sliku
          </Link>
        </div>

        {images.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-zinc-200">
            <p className="text-zinc-400">Nema slika u galeriji.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-zinc-100 shadow-card overflow-hidden">
            {images.map((img, i) => (
              <div key={img.id}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 transition-colors ${i > 0 ? 'border-t border-zinc-100' : ''}`}>
                <div className="w-14 h-10 rounded-lg overflow-hidden shrink-0 bg-zinc-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.imageUrl} alt={img.title || ''} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-zinc-900 text-sm truncate">{img.title || '(bez naslova)'}</p>
                  <div className="flex items-center gap-1.5 text-zinc-400 text-xs mt-0.5">
                    <Calendar size={9} /><span>{fmt(img.createdAt)}</span>
                    {img.description && <span className="truncate max-w-[200px]">· {img.description}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Link href={img.imageUrl} target="_blank"
                    className="p-1.5 text-zinc-300 hover:text-zinc-600 transition-colors">
                    <Pencil size={13} />
                  </Link>
                  <DeleteButton id={img.id} type="gallery" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
