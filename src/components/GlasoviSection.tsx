import Link from 'next/link'
import { TEAM, type TeamMember } from '@/lib/team'

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
  return (
    <div>
      <p className="font-semibold text-sm mb-6" style={{ color: '#8b1e3f' }}>
        Autori edukativnog sadržaja
      </p>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {TEAM.map(m => (
          <MemberCard key={m.name} m={m} />
        ))}
      </div>
    </div>
  )
}
