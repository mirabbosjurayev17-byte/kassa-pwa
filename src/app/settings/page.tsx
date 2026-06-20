'use client'

import { useEffect, useState } from 'react'
import { useKassaStore } from '@/store/useKassaStore'
import { ChevronRight } from 'lucide-react'

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false)
  const settings = useKassaStore(s => s.settings)
  const transactions = useKassaStore(s => s.transactions)

  useEffect(() => setMounted(true), [])

  const sections = [
    {
      title: 'Biznes',
      items: [
        { label: 'Nom', value: settings.businessName },
        { label: 'Manzil', value: settings.location },
        { label: 'Valyuta', value: settings.currency === 'UZS' ? 'so\'m' : 'USD' },
      ],
    },
    {
      title: 'Kategoriyalar',
      items: [
        { label: 'Savdo kategoriyalari', value: '7 ta' },
        { label: 'Xarajat kategoriyalari', value: '8 ta' },
      ],
    },
    {
      title: 'Ma\'lumotlar',
      items: [
        { label: 'Jami yozuvlar', value: `${transactions.length} ta` },
        { label: 'Excel\'ga eksport', value: '', isAction: true },
        { label: 'Barchasini o\'chirish', value: '', isAction: true, danger: true },
      ],
    },
  ]

  if (!mounted) return null

  return (
    <main className="px-5 lg:px-10 py-8 max-w-2xl">
      <h1 className="text-3xl font-black tracking-tight mb-8">Sozlamalar</h1>

      <div className="space-y-8">
        {sections.map(section => (
          <div key={section.title}>
            <p className="text-xs uppercase tracking-wide text-mute font-bold mb-3">
              {section.title}
            </p>
            <div className="bg-surface border border-border rounded-2xl overflow-hidden">
              {section.items.map((item, i) => (
                <button
                  key={item.label}
                  className={`w-full flex items-center justify-between px-5 py-4 text-left hover:bg-subtle transition-colors ${
                    i < section.items.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  <span className={`text-sm font-medium ${item.danger ? 'text-ink' : ''}`}>
                    {item.label}
                  </span>
                  <div className="flex items-center gap-2">
                    {item.value && <span className="text-sm text-mute">{item.value}</span>}
                    <ChevronRight size={16} className="text-mute" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="text-center pt-6">
          <p className="text-xs text-mute">Kassa v1.0</p>
          <p className="text-xs text-mute mt-1">Kodd Studio mahsuloti</p>
        </div>
      </div>
    </main>
  )
}
