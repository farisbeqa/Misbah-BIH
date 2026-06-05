'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, ExternalLink, FileText, Pencil, Search } from 'lucide-react'
import DeleteButton from '../../dashboard/DeleteButton'

interface IlahijaText {
  id: number
  title: string
  author?: string | null
  createdAt: Date | string
}

function fmt(d: Date | string) {
  return new Date(d).toLocaleDateString('bs-BA', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function IlahijeListSearch({ tekstovi }: { tekstovi: IlahijaText[] }) {
  const [query, setQuery] = useState('')
  const filtered = query.trim()
    ? tekstovi.filter(t => t.title.toLowerCase().includes(query.toLowerCase()))
    : tekstovi

  return (
    <>
      <div className="relative mb-5">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
        <input value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Pretraži po naslovu..."
          className="w-full pl-9 pr-4 py-2 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand bg-white" />
      </div>
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-zinc-200">
          <p className="text-zinc-400">
            {query.trim() ? `Nema rezultata za "${query}"` : 'Nema tekstova ilahija.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-card overflow-hidden">
          {filtered.map((t, i) => (
            <div key={t.id}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 transition-colors ${i > 0 ? 'border-t border-zinc-100' : ''}`}>
              <FileText size={15} style={{ color: '#9D174D' }} className="flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-zinc-900 text-sm truncate">{t.title}</p>
                <div className="flex items-center gap-1.5 text-zinc-400 text-xs mt-0.5">
                  {t.author && <><span>{t.author}</span><span>·</span></>}
                  <Calendar size={9} /><span>{fmt(t.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Link href={`/admin/ilahije-tekstovi/${t.id}/edit`} title="Uredi"
                  className="p-1.5 transition-colors hover:opacity-80" style={{ color: '#9D174D' }}>
                  <Pencil size={13} />
                </Link>
                <Link href={`/ilahije/tekstovi/${t.id}`} target="_blank" title="Pregledaj"
                  className="p-1.5 text-zinc-300 hover:text-zinc-600 transition-colors">
                  <ExternalLink size={13} />
                </Link>
                <DeleteButton id={t.id} type="ilahija-tekst" />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
