'use client'

import { useKassaStore } from '@/store/useKassaStore'
import { useLang } from '@/hooks/useLang'

export default function CategoriesPage() {
  const { tr } = useLang()
  const saleCategories = useKassaStore(s => s.saleCategories)
  const expenseCategories = useKassaStore(s => s.expenseCategories)

  return (
    <main className="px-5 lg:px-10 py-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold tracking-tight mb-8">{tr.nav.categories}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-mute font-semibold mb-3">{tr.home.sales}</p>
          <div className="card overflow-hidden">
            {saleCategories.map((c, i) => (
              <div key={c.id} className={`px-5 py-4 flex items-center gap-3 ${i < saleCategories.length - 1 ? 'border-b border-border' : ''}`}>
                <span className="w-2 h-2 rounded-full bg-green" />
                <span className="text-sm font-medium">{c.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-mute font-semibold mb-3">{tr.home.expense}</p>
          <div className="card overflow-hidden">
            {expenseCategories.map((c, i) => (
              <div key={c.id} className={`px-5 py-4 flex items-center gap-3 ${i < expenseCategories.length - 1 ? 'border-b border-border' : ''}`}>
                <span className="w-2 h-2 rounded-full bg-ink" />
                <span className="text-sm font-medium">{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
