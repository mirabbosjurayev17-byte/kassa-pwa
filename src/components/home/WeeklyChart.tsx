'use client'

import { useKassaStore } from '@/store/useKassaStore'
import { filterByDay, sumByType, daysAgo, isSameDay } from '@/lib/dateUtils'
import { useLang } from '@/hooks/useLang'

export function WeeklyChart() {
  const { tr } = useLang()
  const transactions = useKassaStore(s => s.transactions)
  const today = new Date()

  const days = Array.from({ length: 7 }, (_, i) => daysAgo(6 - i))
  const data = days.map(day => {
    const tx = filterByDay(transactions, day)
    return {
      day,
      sales: sumByType(tx, 'sale'),
      expenses: sumByType(tx, 'expense'),
      isToday: isSameDay(day, today),
    }
  })

  const maxValue = Math.max(...data.map(d => d.sales + d.expenses), 1)

  return (
    <div className="flex items-end justify-between gap-2 lg:gap-3 h-32 lg:h-44">
      {data.map((d, i) => {
        const salesPct = (d.sales / maxValue) * 100
        const expPct = (d.expenses / maxValue) * 100
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full flex flex-col items-center gap-1 h-full justify-end overflow-hidden">
              <div
                className={`w-full rounded-md transition-all ${d.isToday ? 'bg-blue' : 'bg-blue/30'}`}
                style={{ height: `${Math.max(salesPct, 2)}%` }}
                aria-label={`${tr.home.sales}: ${d.sales}`}
              />
              {d.expenses > 0 && (
                <div
                  className={`w-full rounded-md ${d.isToday ? 'bg-teal' : 'bg-teal/30'}`}
                  style={{ height: `${Math.max(expPct, 2)}%` }}
                  aria-label={`${tr.home.expense}: ${d.expenses}`}
                />
              )}
            </div>
            <p className={`text-xs ${d.isToday ? 'font-bold text-ink' : 'text-mute font-medium'}`}>
              {d.isToday ? tr.home.today : tr.home.dayLabels[d.day.getDay()]}
            </p>
          </div>
        )
      })}
    </div>
  )
}
