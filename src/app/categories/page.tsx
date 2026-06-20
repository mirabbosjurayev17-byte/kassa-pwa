'use client'

import { useKassaStore } from '@/store/useKassaStore'

export default function CategoriesPage() {
  const saleCategories = useKassaStore(s => s.saleCategories)
  const expenseCategories = useKassaStore(s => s.expenseCategories)

  return (
    <main className="px-5 lg:px-10 py-8 max-w-2xl">
      <h1 className="text-3xl font-black tracking-tight mb-8">Kategoriyalar</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-mute font-bold mb-3">Savdo</p>
          <div className="bg-surface border border-border rounded-2xl overflow-hidden">
            {saleCategories.map((c, i) => (
              <div key={c.id} className={`px-5 py-4 flex items-center gap-3 ${i < saleCategories.length - 1 ? 'border-b border-border' : ''}`}>
                <span className="w-2 h-2 rounded-full bg-blue" />
                <span className="text-sm font-medium">{c.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-mute font-bold mb-3">Xarajat</p>
          <div className="bg-surface border border-border rounded-2xl overflow-hidden">
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
