'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useKassaStore } from '@/store/useKassaStore'
import { useLang } from '@/hooks/useLang'
import { formatNumber } from '@/lib/formatCurrency'

type Slide = 0 | 1 | 2

export default function OnboardingPage() {
  const router = useRouter()
  const { tr, lang } = useLang()
  const updateSettings = useKassaStore(s => s.updateSettings)
  const seedDemo = useKassaStore(s => s.seedDemo)

  const [slide, setSlide] = useState<Slide>(0)
  const [businessName, setBusinessName] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [location, setLocation] = useState('')
  const [currency, setCurrency] = useState<'UZS' | 'USD'>('UZS')
  const [error, setError] = useState('')

  const o = tr.onboarding

  function next() {
    if (slide < 2) setSlide((slide + 1) as Slide)
  }

  function handleFinish() {
    const name = businessName.trim()
    if (!name) {
      setError(o.slide2.nameRequired)
      return
    }
    updateSettings({
      businessName: name,
      ownerName: ownerName.trim() || (lang === 'uz' ? 'Ega' : 'Владелец'),
      location: location.trim() || 'Toshkent',
      currency,
      onboardingCompleted: true,
    })
    seedDemo()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-base flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-12">
          <div className="w-9 h-9 rounded-lg bg-ink flex items-center justify-center">
            <span className="text-green-bright font-semibold text-lg leading-none">K</span>
          </div>
          <span className="font-semibold text-xl">{tr.appName}</span>
        </div>

        {/* Slide 0 — Intro */}
        {slide === 0 && (
          <div>
            <div className="bg-surface rounded-2xl border border-border p-6 mb-8">
              <p className="text-xs uppercase tracking-wide text-mute font-semibold mb-3">{tr.home.todayProfit}</p>
              <p className="text-5xl font-semibold tabular-nums text-ink">{formatNumber(2_930_000)}</p>
              <p className="text-sm text-mute mt-2">so'm</p>
              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-border">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-green" />
                    <p className="text-xs text-mute font-medium">{tr.home.sales}</p>
                  </div>
                  <p className="text-base font-semibold tabular-nums">{formatNumber(4_070_000)}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-ink" />
                    <p className="text-xs text-mute font-medium">{tr.home.expense}</p>
                  </div>
                  <p className="text-base font-semibold tabular-nums">{formatNumber(1_140_000)}</p>
                </div>
              </div>
            </div>

            <p className="text-xs uppercase tracking-wide text-mute font-semibold mb-2">{o.slide0.eyebrow}</p>
            <h1 className="text-3xl font-semibold tracking-tight mb-3">{o.slide0.headline}</h1>
            <p className="text-mute font-medium mb-10">{o.slide0.body}</p>

            <button onClick={next} className="w-full bg-green text-white rounded-xl py-4 font-semibold text-base">
              {o.slide0.cta}
            </button>
          </div>
        )}

        {/* Slide 1 — How it works */}
        {slide === 1 && (
          <div>
            <div className="space-y-3 mb-8">
              {o.slide1.steps.map((text, i) => (
                <div key={i} className="flex items-center gap-4 bg-surface border border-border rounded-xl px-5 py-4">
                  <span className="w-8 h-8 rounded-full bg-green text-white font-semibold text-sm flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-sm font-medium">{text}</p>
                </div>
              ))}
            </div>

            <p className="text-xs uppercase tracking-wide text-mute font-semibold mb-2">{o.slide1.eyebrow}</p>
            <h1 className="text-3xl font-semibold tracking-tight mb-3">{o.slide1.headline}</h1>
            <p className="text-mute font-medium mb-10">{o.slide1.body}</p>

            <button onClick={next} className="w-full bg-green text-white rounded-xl py-4 font-semibold text-base">
              {o.slide1.cta}
            </button>
          </div>
        )}

        {/* Slide 2 — Setup form */}
        {slide === 2 && (
          <div>
            <p className="text-xs uppercase tracking-wide text-mute font-semibold mb-2">{o.slide2.eyebrow}</p>
            <h1 className="text-3xl font-semibold tracking-tight mb-2">{o.slide2.headline}</h1>
            <p className="text-mute font-medium mb-8">{o.slide2.body}</p>

            <div className="space-y-5">
              <div>
                <label className="text-xs uppercase tracking-wide text-mute font-semibold block mb-2">
                  {tr.settings.name} <span className="text-green">*</span>
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={e => { setBusinessName(e.target.value); setError('') }}
                  placeholder={o.slide2.namePlaceholder}
                  className={`w-full bg-surface border rounded-xl px-4 py-3.5 text-sm font-medium outline-none transition-colors ${
                    error ? 'border-ink' : 'border-border focus:border-green'
                  }`}
                  autoFocus
                />
                {error && <p className="text-xs text-ink font-semibold mt-1.5">{error}</p>}
              </div>

              <div>
                <label className="text-xs uppercase tracking-wide text-mute font-semibold block mb-2">
                  {lang === 'uz' ? 'Ega ismi' : 'Имя владельца'} <span className="text-mute font-medium normal-case tracking-normal">{tr.newTx.noteOptional}</span>
                </label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={e => setOwnerName(e.target.value)}
                  placeholder={lang === 'uz' ? 'Aziz Karimov' : 'Азиз Каримов'}
                  className="w-full bg-surface border border-border rounded-xl px-4 py-3.5 text-sm font-medium outline-none focus:border-green transition-colors"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-wide text-mute font-semibold block mb-2">
                  {tr.settings.location} <span className="text-mute font-medium normal-case tracking-normal">{tr.newTx.noteOptional}</span>
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder={o.slide2.locationPlaceholder}
                  className="w-full bg-surface border border-border rounded-xl px-4 py-3.5 text-sm font-medium outline-none focus:border-green transition-colors"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-wide text-mute font-semibold block mb-2">{tr.settings.currency}</label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-subtle rounded-xl">
                  <button
                    onClick={() => setCurrency('UZS')}
                    className={`py-3 rounded-lg text-sm font-semibold transition-colors ${
                      currency === 'UZS' ? 'bg-surface shadow-sm text-ink' : 'text-mute'
                    }`}
                  >
                    so'm
                  </button>
                  <button
                    onClick={() => setCurrency('USD')}
                    className={`py-3 rounded-lg text-sm font-semibold transition-colors ${
                      currency === 'USD' ? 'bg-surface shadow-sm text-ink' : 'text-mute'
                    }`}
                  >
                    USD
                  </button>
                </div>
              </div>
            </div>

            <button onClick={handleFinish} className="w-full bg-green text-white rounded-xl py-4 font-semibold text-base mt-8">
              {o.slide2.cta}
            </button>
          </div>
        )}

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className={`rounded-full transition-all ${
                i === slide ? 'w-6 h-2 bg-ink' : 'w-2 h-2 bg-border'
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  )
}
