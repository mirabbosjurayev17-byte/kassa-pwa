'use client'

import { useKassaStore } from '@/store/useKassaStore'
import { formatNumber } from '@/lib/formatCurrency'
import { filterByDay, sumByType, getProfit, daysAgo } from '@/lib/dateUtils'
import { useLang } from '@/hooks/useLang'

export function KpiHeroCard() {
  const { tr } = useLang()
  const transactions = useKassaStore(s => s.transactions)

  const today = new Date()
  const yesterday = daysAgo(1)

  const todayTx = filterByDay(transactions, today)
  const yesterdayTx = filterByDay(transactions, yesterday)

  const todayProfit = getProfit(todayTx)
  const yesterdayProfit = getProfit(yesterdayTx)

  const todaySales = sumByType(todayTx, 'sale')
  const todayExpenses = sumByType(todayTx, 'expense')

  const delta = todayProfit - yesterdayProfit
  const deltaPercent = yesterdayProfit > 0
    ? Math.round((delta / yesterdayProfit) * 100 * 10) / 10
    : 0
  const isUp = delta >= 0

  return (
    <div className="bg-surface rounded-2xl border border-border p-6 lg:p-8">
      {/* Eyebrow + delta */}
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wide text-mute font-bold">
          {tr.home.todayProfit}
        </p>
        {yesterdayProfit > 0 && (
          // Neytral pill — yo'nalish faqat ↑/↓ orqali. Ko'k = "savdo", "yuqori" emas.
          <span className="text-xs font-bold flex items-center gap-1 px-2 py-1 rounded-full bg-subtle text-ink">
            {isUp ? '↑' : '↓'} {Math.abs(deltaPercent)}%
          </span>
        )}
      </div>

      {/* SIGNATURE RAQAM — fluid clamp (320px..mobil), desktop'da clamp (hero full-width) */}
      <p className="text-[clamp(2.25rem,9vw,3rem)] lg:text-[clamp(3rem,4.2vw,4.5rem)] font-black tabular-nums text-ink tracking-tight leading-none mt-4">
        {formatNumber(todayProfit)}
      </p>
      <p className="text-sm text-mute font-medium mt-2">
        so'm{' '}
        {yesterdayProfit > 0 && (
          <span>· {tr.home.yesterday} {isUp ? '+' : '−'}{formatNumber(Math.abs(delta))}</span>
        )}
      </p>

      {/* Quick stats — mobil'da hero ichida; desktop'da KpiCard'lar ko'rsatadi (lg:hidden) */}
      <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-border lg:hidden">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-blue" />
            <p className="text-xs text-mute font-medium">{tr.home.sales}</p>
          </div>
          <p className="text-lg font-bold tabular-nums">
            {formatNumber(todaySales)}
          </p>
        </div>
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-ink" />
            <p className="text-xs text-mute font-medium">{tr.home.expense}</p>
          </div>
          <p className="text-lg font-bold tabular-nums">
            {formatNumber(todayExpenses)}
          </p>
        </div>
      </div>
    </div>
  )
}
