'use client'

import { useLang } from '@/hooks/useLang'

export default function StaffPage() {
  const { tr, lang } = useLang()
  const staff = [
    { name: 'Aziz Karimov', role: 'owner' as const, avatar: 'AK' },
    { name: 'Dilnoza Yusupova', role: 'employee' as const, avatar: 'DY' },
    { name: 'Sardor Rahimov', role: 'employee' as const, avatar: 'SR' },
  ]
  const roleLabel = (r: 'owner' | 'employee') =>
    r === 'owner' ? (lang === 'uz' ? 'Ega' : 'Владелец') : (lang === 'uz' ? 'Sotuvchi' : 'Продавец')

  return (
    <main className="px-5 lg:px-10 py-8 max-w-2xl">
      <h1 className="text-3xl font-black tracking-tight mb-2">{tr.nav.staff}</h1>
      <p className="text-sm text-mute mb-8">
        {lang === 'uz'
          ? "Sotuvchilar faqat savdo kiritadi — foyda va marja ko'rinmaydi."
          : 'Продавцы только вводят продажи — прибыль и маржа им не видны.'}
      </p>
      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        {staff.map((s, i) => (
          <div key={s.name} className={`px-5 py-4 flex items-center gap-4 ${i < staff.length - 1 ? 'border-b border-border' : ''}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${s.role === 'owner' ? 'bg-dark' : 'bg-subtle'}`}>
              <span className={`text-xs font-bold ${s.role === 'owner' ? 'text-green-bright' : 'text-ink'}`}>{s.avatar}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold">{s.name}</p>
              <p className="text-xs text-mute">{roleLabel(s.role)}</p>
            </div>
            {s.role === 'owner' && (
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-green-pale text-green">
                {lang === 'uz' ? 'Egasi' : 'Главный'}
              </span>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}
