'use client'

import { useEffect, useState } from 'react'
import { useKassaStore } from '@/store/useKassaStore'
import { formatNumber } from '@/lib/formatCurrency'
import { sumByType, daysAgo } from '@/lib/dateUtils'
import { TransactionItem } from '@/components/home/TransactionItem'

type FilterRange = 'today' | 'week' | 'month'

export default function TransactionsPage() {
  const [mounted, setMounted] = useState(false)
  const transactions = useKassaStore(s => s.transactions)
  const saleCategories = useKassaStore(s => s.saleCategories)
  const expenseCategories = useKassaStore(s => s.expenseCategories)
  const allCategories = [...saleCategories, ...expenseCategories]

  const [range, setRange] = useState<FilterRange>('week')

  useEffect(() => setMounted(true), [])

  const cutoff = range === 'today' ? daysAgo(0) : range === 'week' ? daysAgo(7) : daysAgo(30)
  const filtered = transactions.filter(t => new Date(t.date) >= cutoff)

  const sales = sumByType(filtered, 'sale')
  const expenses = sumByType(filtered, 'expense')
  const profit = sales - expenses

  // Group by day
  const groups = filtered.reduce((acc, tx) => {
    const day = new Date(tx.date).toDateString()
    if (!acc[day]) acc[day] = []
    acc[day].push(tx)
    return acc
  }, {} as Record<string, typeof transactions>)

  if (!mounted) return null

  return (
    <main className="px-5 lg:px-10 py-8">
      <h1 className="text-3xl font-black tracking-tight mb-6">Yozuvlar</h1>

      {/* Filter */}
      <div className="inline-flex items-center gap-1 p-1 bg-subtle rounded-xl mb-6">
        {(['today', 'week', 'month'] as const).map(r => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${
              range === r ? 'bg-surface shadow-sm' : 'text-mute'
            }`}
          >
            {r === 'today' ? 'Bugun' : r === 'week' ? 'Hafta' : 'Oy'}
          </button>
        ))}
      </div>

      {/* Summary card */}
      <div className="bg-surface rounded-2xl border border-border p-6 mb-6 max-w-2xl">
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-mute font-bold uppercase tracking-wide">Savdo</p>
            <p className="text-2xl font-black tabular-nums mt-2">{formatNumber(sales)}</p>
          </div>
          <div>
            <p className="text-xs text-mute font-bold uppercase tracking-wide">Xarajat</p>
            <p className="text-2xl font-black tabular-nums mt-2">{formatNumber(expenses)}</p>
          </div>
          <div>
            <p className="text-xs text-mute font-bold uppercase tracking-wide">Foyda</p>
            <p className="text-2xl font-black tabular-nums mt-2 text-blue-dark">{formatNumber(profit)}</p>
          </div>
        </div>
      </div>

      {/* Day groups */}
      <div className="space-y-6 max-w-3xl">
        {Object.entries(groups)
          .sort(([a], [b]) => b.localeCompare(a))
          .map(([day, txs]) => {
            const dayDate = new Date(day)
            const dayLabel = dayDate.toLocaleDateString('uz-UZ', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })
            return (
              <div key={day}>
                <p className="text-xs uppercase tracking-wide text-mute font-bold mb-3">
                  {dayLabel}
                </p>
                <div className="bg-surface rounded-2xl border border-border p-4 space-y-3">
                  {txs.map(tx => (
                    <TransactionItem
                      key={tx.id}
                      transaction={tx}
                      allCategories={allCategories}
                      variant="desktop"
                    />
                  ))}
                </div>
              </div>
            )
          })}
      </div>
    </main>
  )
}
