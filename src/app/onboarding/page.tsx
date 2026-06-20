'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useKassaStore } from '@/store/useKassaStore'
import { formatNumber } from '@/lib/formatCurrency'

type Slide = 0 | 1 | 2

const SLIDES = [
  {
    eyebrow: 'Kassa — savdo trackeri',
    headline: 'Har kungi savdoni bir joyda',
    body: 'Telefon orqali kuniga 1 daqiqa. Oy oxirida foyda tayyor.',
    preview: true,
  },
  {
    eyebrow: 'Qanday ishlaydi',
    headline: 'Kiritasiz — hisob-kitob avtomatik',
    body: 'Savdo yoki xarajatni kiritasiz. Kunlik, haftalik, oylik tahlil — dastur o\'zi qiladi.',
    preview: false,
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const updateSettings = useKassaStore(s => s.updateSettings)
  const seedDemo = useKassaStore(s => s.seedDemo)

  const [slide, setSlide] = useState<Slide>(0)
  const [businessName, setBusinessName] = useState('')
  const [location, setLocation] = useState('')
  const [currency, setCurrency] = useState<'UZS' | 'USD'>('UZS')
  const [error, setError] = useState('')

  function next() {
    if (slide < 2) setSlide((slide + 1) as Slide)
  }

  function handleFinish() {
    const name = businessName.trim()
    if (!name) {
      setError('Biznes nomini kiriting')
      return
    }
    updateSettings({
      businessName: name,
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
            <span className="text-blue font-black text-lg leading-none">K</span>
          </div>
          <span className="font-black text-xl">Kassa</span>
        </div>

        {/* Slide 0 — Intro */}
        {slide === 0 && (
          <div>
            {/* Preview card */}
            <div className="bg-surface rounded-2xl border border-border p-6 mb-8">
              <p className="text-xs uppercase tracking-wide text-mute font-bold mb-3">
                Bugungi sof foyda
              </p>
              <p className="text-5xl font-black tabular-nums text-ink">
                {formatNumber(2_930_000)}
              </p>
              <p className="text-sm text-mute mt-2">so'm</p>
              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-border">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-blue" />
                    <p className="text-xs text-mute font-medium">Savdo</p>
                  </div>
                  <p className="text-base font-bold tabular-nums">{formatNumber(4_070_000)}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-ink" />
                    <p className="text-xs text-mute font-medium">Xarajat</p>
                  </div>
                  <p className="text-base font-bold tabular-nums">{formatNumber(1_140_000)}</p>
                </div>
              </div>
            </div>

            <p className="text-xs uppercase tracking-wide text-mute font-bold mb-2">
              {SLIDES[0].eyebrow}
            </p>
            <h1 className="text-3xl font-black tracking-tight mb-3">
              {SLIDES[0].headline}
            </h1>
            <p className="text-mute font-medium mb-10">
              {SLIDES[0].body}
            </p>

            <button
              onClick={next}
              className="w-full bg-ink text-white rounded-xl py-4 font-bold text-base"
            >
              Davom etish
            </button>
          </div>
        )}

        {/* Slide 1 — How it works */}
        {slide === 1 && (
          <div>
            {/* Steps illustration */}
            <div className="space-y-3 mb-8">
              {[
                { num: '1', text: 'Savdo yoki xarajat kiritasiz' },
                { num: '2', text: 'Kunlik foyda avtomatik hisoblanadi' },
                { num: '3', text: 'Oylik hisobot tayyor, CSV eksport' },
              ].map(step => (
                <div key={step.num} className="flex items-center gap-4 bg-surface border border-border rounded-xl px-5 py-4">
                  <span className="w-8 h-8 rounded-full bg-blue text-white font-black text-sm flex items-center justify-center flex-shrink-0">
                    {step.num}
                  </span>
                  <p className="text-sm font-medium">{step.text}</p>
                </div>
              ))}
            </div>

            <p className="text-xs uppercase tracking-wide text-mute font-bold mb-2">
              {SLIDES[1].eyebrow}
            </p>
            <h1 className="text-3xl font-black tracking-tight mb-3">
              {SLIDES[1].headline}
            </h1>
            <p className="text-mute font-medium mb-10">
              {SLIDES[1].body}
            </p>

            <button
              onClick={next}
              className="w-full bg-ink text-white rounded-xl py-4 font-bold text-base"
            >
              Sozlashni boshlash
            </button>
          </div>
        )}

        {/* Slide 2 — Setup form */}
        {slide === 2 && (
          <div>
            <p className="text-xs uppercase tracking-wide text-mute font-bold mb-2">
              Sozlash
            </p>
            <h1 className="text-3xl font-black tracking-tight mb-2">
              Biznesingiz haqida
            </h1>
            <p className="text-mute font-medium mb-8">
              Keyinchalik sozlamalardan o'zgartirish mumkin.
            </p>

            <div className="space-y-5">
              {/* Business name */}
              <div>
                <label className="text-xs uppercase tracking-wide text-mute font-bold block mb-2">
                  Biznes nomi <span className="text-ink">*</span>
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={e => { setBusinessName(e.target.value); setError('') }}
                  placeholder="Masalan: Baraka Market"
                  className={`w-full bg-surface border rounded-xl px-4 py-3.5 text-sm font-medium outline-none transition-colors ${
                    error ? 'border-ink' : 'border-border focus:border-blue'
                  }`}
                  autoFocus
                />
                {error && <p className="text-xs text-ink font-bold mt-1.5">{error}</p>}
              </div>

              {/* Location */}
              <div>
                <label className="text-xs uppercase tracking-wide text-mute font-bold block mb-2">
                  Manzil (ixtiyoriy)
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="Masalan: Yunusobod"
                  className="w-full bg-surface border border-border rounded-xl px-4 py-3.5 text-sm font-medium outline-none focus:border-blue transition-colors"
                />
              </div>

              {/* Currency */}
              <div>
                <label className="text-xs uppercase tracking-wide text-mute font-bold block mb-2">
                  Valyuta
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-subtle rounded-xl">
                  <button
                    onClick={() => setCurrency('UZS')}
                    className={`py-3 rounded-lg text-sm font-bold transition-colors ${
                      currency === 'UZS' ? 'bg-surface shadow-sm text-ink' : 'text-mute'
                    }`}
                  >
                    so'm
                  </button>
                  <button
                    onClick={() => setCurrency('USD')}
                    className={`py-3 rounded-lg text-sm font-bold transition-colors ${
                      currency === 'USD' ? 'bg-surface shadow-sm text-ink' : 'text-mute'
                    }`}
                  >
                    USD
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full bg-ink text-white rounded-xl py-4 font-bold text-base mt-8"
            >
              Boshlash
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
