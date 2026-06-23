'use client'

import { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { useKassaStore } from '@/store/useKassaStore'
import { useLang } from '@/hooks/useLang'
import { daysAgo } from '@/lib/dateUtils'
import { formatCompact, formatNumber } from '@/lib/formatCurrency'

const COLORS = ['#021B1A', '#03624C', '#17876D', '#2CC295', '#AACBC4']

export function ExpenseDonut() {
  const { lang } = useLang()
  const transactions = useKassaStore(s => s.transactions)
  const expenseCategories = useKassaStore(s => s.expenseCategories)

  const { data, total } = useMemo(() => {
    const monthAgo = daysAgo(30)
    const monthlyExp = transactions.filter(t => new Date(t.date) >= monthAgo && t.type === 'expense')
    const total = monthlyExp.reduce((s, t) => s + t.amount, 0)
    const data = expenseCategories
      .map(cat => ({
        name: cat.label,
        value: monthlyExp.filter(t => t.category === cat.id).reduce((s, t) => s + t.amount, 0),
      }))
      .filter(c => c.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
      .map(c => ({ ...c, pct: total > 0 ? Math.round((c.value / total) * 100) : 0 }))
    return { data, total }
  }, [transactions, expenseCategories])

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-sm text-mute">
        {lang === 'uz' ? 'Xarajat maʼlumoti yoʻq' : 'Нет данных о расходах'}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-36 h-36 flex-shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data} cx="50%" cy="50%" innerRadius={48} outerRadius={68}
              paddingAngle={3} dataKey="value" stroke="none"
            >
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] uppercase tracking-wide text-mute">{lang === 'uz' ? 'Jami' : 'Всего'}</span>
          <span className="text-base font-semibold tabular-nums">{formatCompact(total)}</span>
        </div>
      </div>

      <div className="flex-1 space-y-2.5 min-w-0">
        {data.map((item, i) => (
          <div key={item.name} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i] }} />
              <span className="text-sm text-mute truncate">{item.name}</span>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="text-sm font-medium tabular-nums">{formatNumber(item.value)}</span>
              <span className="text-xs text-mute w-8 text-right tabular-nums">{item.pct}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
