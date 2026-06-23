'use client'

import { useMemo } from 'react'
import { useKassaStore } from '@/store/useKassaStore'
import { useLang } from '@/hooks/useLang'
import { daysAgo } from '@/lib/dateUtils'
import { formatNumber } from '@/lib/formatCurrency'

const BAR_COLORS = ['#00DF81', '#2CC295', '#17876D', '#03624C', '#06302B', '#AACBC4']

export function PaymentSplit() {
  const { lang } = useLang()
  const transactions = useKassaStore(s => s.transactions)
  const saleCategories = useKassaStore(s => s.saleCategories)

  const data = useMemo(() => {
    const monthAgo = daysAgo(30)
    const sales = transactions.filter(t => new Date(t.date) >= monthAgo && t.type === 'sale')
    const total = sales.reduce((s, t) => s + t.amount, 0)
    return saleCategories
      .map(cat => ({
        label: cat.label,
        sum: sales.filter(t => t.category === cat.id).reduce((s, t) => s + t.amount, 0),
      }))
      .filter(c => c.sum > 0)
      .sort((a, b) => b.sum - a.sum)
      .map(c => ({ ...c, pct: total > 0 ? Math.round((c.sum / total) * 100) : 0 }))
  }, [transactions, saleCategories])

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-sm text-mute">
        {lang === 'uz' ? 'Maʼlumot yoʻq' : 'Нет данных'}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {data.map((c, i) => (
        <div key={c.label}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-medium">{c.label}</span>
            <span className="text-sm font-semibold tabular-nums">{c.pct}%</span>
          </div>
          <div className="h-2 bg-subtle rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${c.pct}%`, backgroundColor: BAR_COLORS[i % BAR_COLORS.length] }}
            />
          </div>
          <p className="text-xs text-mute mt-1 tabular-nums">{formatNumber(c.sum)} so'm</p>
        </div>
      ))}
    </div>
  )
}
