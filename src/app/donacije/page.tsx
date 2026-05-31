import { Heart, Building2, CreditCard, Copy } from 'lucide-react'

export const metadata = {
  title: 'Donacije — Misbah EDU',
  description: 'Podržite rad Misbah EDU projekta',
}

export const dynamic = 'force-dynamic'

// ── Configure your donation details here ────────────────────────────────────
const DONATION_CONFIG = {
  iban: 'BA39 XXXX XXXX XXXX XXXX XX',   // ← unesite IBAN
  banka: 'Naziv banke d.d.',               // ← unesite naziv banke
  naziv: 'Strossa d.o.o.',                 // ← naziv primaoca
  svrha: 'Donacija — Misbah EDU',
  paypalLink: '',                           // ← npr. https://paypal.me/MisbahEDU
}
// ────────────────────────────────────────────────────────────────────────────

export default function DonacijePage() {
  const hasPaypal = Boolean(DONATION_CONFIG.paypalLink)
  const hasBankDetails = !DONATION_CONFIG.iban.includes('XXXX')

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      {/* Header */}
      <div className="text-center mb-14">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: '#FAF7F2', border: '1px solid #E8E1DB' }}>
          <Heart size={28} style={{ color: '#8B1E3F' }} />
        </div>
        <p className="font-mono text-[11px] text-brand-light uppercase tracking-widest mb-3">Sadaka</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-warm-900 tracking-tight mb-4">
          Podržite Misbah EDU
        </h1>
        <p className="text-warm-500 leading-relaxed max-w-lg mx-auto">
          Svaka donacija pomaže nam u produkciji islamskog sadržaja — predavanja, Kur'an snimaka i podcasta
          koji besplatno dolaze do zajednice.
        </p>
      </div>

      {/* Why donate */}
      <div className="rounded-2xl p-6 mb-8" style={{ background: '#FAF7F2', border: '1px solid #E8E1DB' }}>
        <h2 className="font-bold text-warm-900 mb-4">Zašto donirati?</h2>
        <ul className="space-y-3 text-sm text-warm-600">
          {[
            'Produkcija i snimanje islamskih predavanja',
            'Održavanje Misbah EDU platforme',
            'Razvoj novih sadržaja — Kur\'an, podcast, blog',
            'Educiranje muslimanske zajednice u BiH i dijaspori',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold text-white"
                style={{ background: '#8B1E3F' }}>
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* PayPal */}
      {hasPaypal && (
        <div className="rounded-2xl p-6 mb-6" style={{ background: '#FAF7F2', border: '1px solid #E8E1DB' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-[#003087] flex items-center justify-center flex-shrink-0">
              <CreditCard size={16} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-warm-900">PayPal donacija</h2>
              <p className="text-xs text-warm-500">Brza i sigurna online donacija</p>
            </div>
          </div>
          <a href={DONATION_CONFIG.paypalLink} target="_blank" rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3 rounded-xl transition-opacity hover:opacity-90"
            style={{ background: '#0070BA' }}>
            Doniraj putem PayPal-a
          </a>
        </div>
      )}

      {/* Bank transfer */}
      <div className="rounded-2xl p-6 mb-6" style={{ background: '#FAF7F2', border: '1px solid #E8E1DB' }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: '#8B1E3F' }}>
            <Building2 size={16} className="text-white" />
          </div>
          <div>
            <h2 className="font-bold text-warm-900">Uplata na račun</h2>
            <p className="text-xs text-warm-500">Direktna bankovna transakcija</p>
          </div>
        </div>

        {hasBankDetails ? (
          <div className="space-y-3">
            {[
              { label: 'Naziv primaoca', value: DONATION_CONFIG.naziv },
              { label: 'IBAN',           value: DONATION_CONFIG.iban },
              { label: 'Banka',          value: DONATION_CONFIG.banka },
              { label: 'Svrha uplate',   value: DONATION_CONFIG.svrha },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between gap-3 py-2.5 px-4 rounded-xl"
                style={{ background: 'white', border: '1px solid #E8E1DB' }}>
                <div className="min-w-0">
                  <p className="font-mono text-[10px] text-warm-400 uppercase tracking-wider">{row.label}</p>
                  <p className="font-semibold text-warm-800 text-sm mt-0.5 break-all">{row.value}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-warm-400">
            <p className="font-mono text-xs">Podaci o računu uskoro...</p>
          </div>
        )}
      </div>

      {/* Jazakallahu */}
      <div className="text-center py-8">
        <p className="text-2xl mb-2" style={{ color: '#C8A96B', fontFamily: 'serif' }}>جَزَاكَ اللّٰهُ خَيْرًا</p>
        <p className="font-mono text-xs text-warm-400 tracking-wider">Džazakallahu hajren — Allah vam nagradio dobrim</p>
      </div>
    </div>
  )
}
