'use client'

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'

export default function SweepButton() {
  const [state, setState] = useState<'idle' | 'busy' | 'ok' | 'error'>('idle')

  const run = async () => {
    setState('busy')
    const res = await fetch('/api/admin/translations/sweep', { method: 'POST' }).catch(() => null)
    setState(res?.ok ? 'ok' : 'error')
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button onClick={run} disabled={state === 'busy'}
        className="inline-flex items-center gap-2 text-white font-semibold px-4 py-2.5 rounded-xl text-sm hover:opacity-90 disabled:opacity-60"
        style={{ background: '#8B1E3F' }}>
        <RefreshCw size={15} className={state === 'busy' ? 'animate-spin' : ''} />
        Prevedi sve što nedostaje
      </button>
      {state === 'ok' && <p className="text-xs text-emerald-600">Pokrenuto. Osvježite stranicu za nekoliko minuta.</p>}
      {state === 'error' && <p className="text-xs text-red-600">Prevodilac trenutno nije dostupan.</p>}
    </div>
  )
}
