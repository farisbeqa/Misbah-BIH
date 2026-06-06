'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, ChevronLeft } from 'lucide-react'

interface TeamMember {
  image: string
  tag: string
  name: string
  bio: string
  slug?: string
}

const UREDNICI: TeamMember[] = [
  { image: '/tim/hamdo-solo.jpg',          tag: "Kur'anske nauke i kiraeti", name: 'Hamdo Solo',          bio: "Kur'an, kiraeti i duhovni razvoj.",                      slug: 'hamdo-solo' },
  { image: '/tim/mubina-suljic-solo.jpg',  tag: 'Fikh i savremena pitanja', name: 'Mubina Suljić Solo',  bio: 'Ibadet, šerijatsko pravo i savremena pitanja muslimana.', slug: 'mubina-suljic-solo' },
  { image: '/tim/hamza-bajraktarevic.jpg', tag: 'Sira i islamska etika',    name: 'Hamza Bajraktarević', bio: 'Sira Poslanika ﷺ, islamska etika i životne lekcije.',    slug: 'hamza-bajraktarevic' },
]

const AUTORI: TeamMember[] = [
  { image: '/tim/esma-klisura.jpg',       tag: 'Odgoj i obrazovanje',      name: 'Esma Klisura',       bio: 'Odgoj, obrazovanje i savremeni izazovi mladih.',                       slug: 'esma-klisura' },
  { image: '/tim/muhamed-selimovic.jpg',  tag: "Kur'anske nauke i hifz",   name: 'Muhamed Selimović',  bio: 'Hafiz, pobjednik državnog takmičenja u hifzu. Aktivan u Misbahu od 2022.', slug: 'muhamed-selimovic' },
]

const GROUPS = [
  { key: 'urednici', label: 'Urednici',                    members: UREDNICI },
  { key: 'autori',   label: 'Autori edukativnog sadržaja', members: AUTORI   },
]

function MemberCard({ m }: { m: TeamMember }) {
  const inner = (
    <>
      <div className="relative w-full overflow-hidden shrink-0" style={{ height: 340 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt={m.name} src={m.image}
          className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="bg-[#f5f2ef] flex flex-col gap-3 p-4 flex-1">
        <p className="font-medium text-[#8b1e3f] text-xs uppercase tracking-wide">{m.tag}</p>
        <p className="font-medium text-[#241f1d] group-hover:text-[#8b1e3f] transition-colors"
          style={{ fontSize: 20, lineHeight: 1.12, letterSpacing: '-0.6px' }}>
          {m.name}
        </p>
        <p className="font-normal text-[#5a4f49] text-base leading-normal">{m.bio}</p>
      </div>
    </>
  )

  return m.slug
    ? (
      <Link href={`/o-nama/tim/${m.slug}`} className="group flex flex-col overflow-hidden">
        {inner}
      </Link>
    )
    : (
      <div className="group flex flex-col overflow-hidden">
        {inner}
      </div>
    )
}

export default function GlasoviSection() {
  const [groupIdx, setGroupIdx] = useState(0)
  const group = GROUPS[groupIdx]
  const hasPrev = groupIdx > 0
  const hasNext = groupIdx < GROUPS.length - 1

  return (
    <div>
      {/* Group navigation */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setGroupIdx(i => i - 1)}
          disabled={!hasPrev}
          className="p-1.5 rounded-lg transition-colors disabled:opacity-20"
          style={{ color: '#8b1e3f' }}
          aria-label="Prethodna grupa"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="font-semibold text-sm" style={{ color: '#8b1e3f' }}>
          {group.label}
        </span>
        <button
          onClick={() => setGroupIdx(i => i + 1)}
          disabled={!hasNext}
          className="p-1.5 rounded-lg transition-colors disabled:opacity-20"
          style={{ color: '#8b1e3f' }}
          aria-label="Sljedeća grupa"
        >
          <ChevronRight size={18} />
        </button>
        {/* Dot indicators */}
        <div className="flex items-center gap-1.5 ml-auto">
          {GROUPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setGroupIdx(i)}
              className="w-2 h-2 rounded-full transition-colors"
              style={{ background: i === groupIdx ? '#8b1e3f' : '#d6c9bf' }}
              aria-label={GROUPS[i].label}
            />
          ))}
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {group.members.map(m => (
          <MemberCard key={m.name} m={m} />
        ))}
      </div>
    </div>
  )
}
