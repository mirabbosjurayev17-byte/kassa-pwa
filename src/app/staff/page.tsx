'use client'

import { useLang } from '@/hooks/useLang'

export default function StaffPage() {
  const { tr } = useLang()
  const staff = [
    { name: 'Akmal Komilov', role: 'Egasi', avatar: 'AK' },
    { name: 'Sardor Rahimov', role: 'Sotuvchi', avatar: 'SR' },
    { name: 'Nodira Yusupova', role: 'Buxgalter', avatar: 'NY' },
  ]

  return (
    <main className="px-5 lg:px-10 py-8 max-w-2xl">
      <h1 className="text-3xl font-black tracking-tight mb-8">{tr.nav.staff}</h1>
      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        {staff.map((s, i) => (
          <div key={s.name} className={`px-5 py-4 flex items-center gap-4 ${i < staff.length - 1 ? 'border-b border-border' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-subtle flex items-center justify-center">
              <span className="text-xs font-bold text-ink">{s.avatar}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold">{s.name}</p>
              <p className="text-xs text-mute">{s.role}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
