import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { invokeTranslator } from '@/lib/translation-admin'

// "Prevedi sve što nedostaje": the translator worker goes through all content
// now instead of waiting for its daily run
export async function POST() {
  const session = await requireAuth()
  if (!session) return NextResponse.json({ error: 'Nije autorizovano' }, { status: 401 })
  try {
    await invokeTranslator({ sweep: true })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[translations] sweep invoke failed', err)
    return NextResponse.json({ error: 'Prevodilac trenutno nije dostupan' }, { status: 502 })
  }
}
