'use client'

import { useKassaStore } from '@/store/useKassaStore'
import { filterByDay, sumByType, daysAgo, isSameDay } from '@/lib/dateUtils'
import { useLang } from '@/hooks/useLang'

export function WeeklyChart() {
  const { tr } = useLang()
  const transactions = useKassaStore(s => s.transactions)
  const today = new Date()

  // So'nggi 7 kun (eski → yangi)
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

  // Kunlik JAMI bo'yicha normallashtirish — savdo+xarajat barlari hech qachon
  // 100%dan oshmaydi (konteynerdan chiqmaydi).
  const maxValue = Math.max(...data.map(d => d.sales + d.expenses), 1)

  return (
    <div className="bg-surface rounded-2xl border border-border p-5 lg:p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base lg:text-lg font-bold">{tr.home.sales} / {tr.home.expense}</h2>
          <p className="text-xs text-mute mt-1">{tr.home.thisWeek}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="flex items-end justify-between gap-2 lg:gap-3 h-32 lg:h-48">
        {data.map((d, i) => {
          const salesPct = (d.sales / maxValue) * 100
          const expPct = (d.expenses / maxValue) * 100

          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex flex-col items-center gap-1 h-full justify-end overflow-hidden">
                <div
                  className={`w-full rounded-md transition-all ${
                    d.isToday ? 'bg-blue' : 'bg-blue-dark/30'
                  }`}
                  style={{ height: `${Math.max(salesPct, 2)}%` }}
                  aria-label={`${tr.home.sales}: ${d.sales}`}
                />
                {d.expenses > 0 && (
                  <div
                    className={`w-full rounded-md ${
                      d.isToday ? 'bg-ink/70' : 'bg-ink/20'
                    }`}
                    style={{ height: `${Math.max(expPct, 2)}%` }}
                    aria-label={`${tr.home.expense}: ${d.expenses}`}
                  />
                )}
              </div>
              <p className={`text-xs ${
                d.isToday ? 'font-bold text-ink' : 'text-mute font-medium'
              }`}>
                {d.isToday ? tr.home.today : tr.home.dayLabels[d.day.getDay()]}
              </p>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 lg:gap-6 mt-5 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-blue" />
          <span className="text-xs text-mute font-medium">{tr.home.sales}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-ink/70" />
          <span className="text-xs text-mute font-medium">{tr.home.expense}</span>
        </div>
      </div>
    </div>
  )
}
