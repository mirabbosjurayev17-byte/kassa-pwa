'use client'

import { useState, useMemo, useEffect } from 'react'
import { Trash2 } from 'lucide-react'
import { useKassaStore } from '@/store/useKassaStore'
import { useLang } from '@/hooks/useLang'
import { formatNumber } from '@/lib/formatCurrency'
import { sumByType, daysAgo, getProfit } from '@/lib/dateUtils'
import { TransactionItem } from '@/components/home/TransactionItem'
import { showToast } from '@/lib/toast'

type FilterRange = 'today' | 'week' | 'month'

export default function TransactionsPage() {
  const [mounted, setMounted] = useState(false)
  const { tr, lang } = useLang()
  const transactions = useKassaStore(s => s.transactions)
  const saleCategories = useKassaStore(s => s.saleCategories)
  const expenseCategories = useKassaStore(s => s.expenseCategories)
  const deleteTransaction = useKassaStore(s => s.deleteTransaction)
  const allCategories = useMemo(
    () => [...saleCategories, ...expenseCategories],
    [saleCategories, expenseCategories]
  )

  const [range, setRange] = useState<FilterRange>('week')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => setMounted(true), [])

  const locale = lang === 'ru' ? 'ru-RU' : 'uz-UZ'
  const rangeLabels: Record<FilterRange, string> = {
    today: tr.transactions.today,
    week: tr.transactions.week,
    month: tr.transactions.month,
  }

  const filtered = useMemo(() => {
    const cutoff =
      range === 'today' ? daysAgo(0) :
      range === 'week'  ? daysAgo(7) :
                          daysAgo(30)
    return transactions.filter(t => new Date(t.date) >= cutoff)
  }, [transactions, range])

  const sales    = sumByType(filtered, 'sale')
  const expenses = sumByType(filtered, 'expense')
  const profit   = getProfit(filtered)

  const groups = useMemo(() => {
    const map: Record<string, typeof transactions> = {}
    for (const tx of filtered) {
      const key = new Date(tx.date).toDateString()
      if (!map[key]) map[key] = []
      map[key].push(tx)
    }
    return Object.entries(map).sort(([a], [b]) => b.localeCompare(a))
  }, [filtered])

  function handleDelete(id: string) {
    setDeletingId(id)
    setTimeout(() => {
      deleteTransaction(id)
      setDeletingId(null)
      showToast(tr.transactions.deleted)
    }, 200)
  }

  if (!mounted) return null

  return (
    <main className="px-5 lg:px-10 py-8">
      <h1 className="text-3xl font-black tracking-tight mb-6">{tr.transactions.title}</h1>

      {/* Filter */}
      <div className="inline-flex items-center gap-1 p-1 bg-subtle rounded-xl mb-6">
        {(['today', 'week', 'month'] as FilterRange[]).map(r => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${
              range === r ? 'bg-surface shadow-sm text-ink' : 'text-mute'
            }`}
          >
            {rangeLabels[r]}
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-surface rounded-2xl border border-border p-6 mb-8 max-w-2xl">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-2 h-2 rounded-full bg-green" />
              <p className="text-xs text-mute font-bold uppercase tracking-wide">{tr.home.sales}</p>
            </div>
            <p className="text-xl lg:text-2xl font-black tabular-nums">{formatNumber(sales)}</p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-2 h-2 rounded-full bg-ink" />
              <p className="text-xs text-mute font-bold uppercase tracking-wide">{tr.home.expense}</p>
            </div>
            <p className="text-xl lg:text-2xl font-black tabular-nums">{formatNumber(expenses)}</p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-2 h-2 rounded-full bg-green-dark" />
              <p className="text-xs text-mute font-bold uppercase tracking-wide">{tr.transactions.profit}</p>
            </div>
            <p className="text-xl lg:text-2xl font-black tabular-nums text-green-dark">
              {formatNumber(profit)}
            </p>
          </div>
        </div>
      </div>

      {/* Groups */}
      {groups.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-mute font-medium">{tr.transactions.noEntries}</p>
        </div>
      ) : (
        <div className="space-y-6 max-w-3xl">
          {groups.map(([day, txs]) => {
            const dayLabel = new Date(day).toLocaleDateString(locale, {
              weekday: 'long', day: 'numeric', month: 'long',
            })
            const dayProfit = getProfit(txs)

            return (
              <div key={day}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs uppercase tracking-wide text-mute font-bold">{dayLabel}</p>
                  <p className={`text-xs font-bold tabular-nums ${
                    dayProfit >= 0 ? 'text-green-dark' : 'text-mute'
                  }`}>
                    {dayProfit >= 0 ? '+' : ''}{formatNumber(dayProfit)}
                  </p>
                </div>

                <div className="bg-surface rounded-2xl border border-border overflow-hidden">
                  {txs.map((tx, i) => (
                    <div
                      key={tx.id}
                      className={`flex items-center gap-3 px-4 py-4 transition-opacity ${
                        i < txs.length - 1 ? 'border-b border-border' : ''
                      } ${deletingId === tx.id ? 'opacity-30' : ''}`}
                    >
                      <div className="flex-1 min-w-0">
                        <TransactionItem transaction={tx} allCategories={allCategories} variant="desktop" />
                      </div>
                      <button
                        onClick={() => handleDelete(tx.id)}
                        className="w-8 h-8 rounded-lg hover:bg-subtle flex items-center justify-center flex-shrink-0 transition-colors group"
                        aria-label={tr.settings.delete}
                      >
                        <Trash2 size={15} strokeWidth={2} className="text-border group-hover:text-mute transition-colors" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}
