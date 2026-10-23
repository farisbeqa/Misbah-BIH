import { NextResponse } from 'next/server'
import { BIOS } from '@/lib/bios'
import { TEAM, UREDNICI, DRUSTVENE_MREZE, AUTORI } from '@/lib/team'

export const dynamic = 'force-dynamic'

// Team cards, Impressum groups and biographies for the mobile app
export async function GET() {
  return NextResponse.json({
    team: TEAM,
    impressum: { urednici: UREDNICI, drustveneMreze: DRUSTVENE_MREZE, autori: AUTORI },
    bios: BIOS,
  })
}
