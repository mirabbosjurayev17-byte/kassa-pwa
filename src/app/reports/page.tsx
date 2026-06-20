'use client'

import { useEffect, useState } from 'react'
import { useKassaStore } from '@/store/useKassaStore'
import { formatNumber, formatCompact } from '@/lib/formatCurrency'
import { sumByType, getProfit, daysAgo } from '@/lib/dateUtils'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function ReportsPage() {
  const [mounted, setMounted] = useState(false)
  const transactions = useKassaStore(s => s.transactions)
  const saleCategories = useKassaStore(s => s.saleCategories)
  const expenseCategories = useKassaStore(s => s.expenseCategories)

  useEffect(() => setMounted(true), [])

  // Last 30 days
  const monthly = transactions.filter(t => new Date(t.date) >= daysAgo(30))
  const monthlyProfit = getProfit(monthly)
  const monthlySales = sumByType(monthly, 'sale')
  const monthlyExpenses = sumByType(monthly, 'expense')

  // Previous 30 days for comparison
  const prev = transactions.filter(t => {
    const d = new Date(t.date)
    return d >= daysAgo(60) && d < daysAgo(30)
  })
  const prevProfit = getProfit(prev)
  const profitChange = prevProfit > 0
    ? Math.round((monthlyProfit - prevProfit) / prevProfit * 100 * 10) / 10
    : 0

  // Daily profit data for line chart
  const dailyData = Array.from({ length: 30 }, (_, i) => {
    const day = daysAgo(29 - i)
    const dayTx = transactions.filter(t => {
      const td = new Date(t.date)
      return td.toDateString() === day.toDateString()
    })
    return {
      day: day.getDate(),
      foyda: getProfit(dayTx),
    }
  })

  // Top sale categories
  const saleByCategory = saleCategories.map(cat => {
    const sum = monthly
      .filter(t => t.type === 'sale' && t.category === cat.id)
      .reduce((s, t) => s + t.amount, 0)
    return { label: cat.label, sum, pct: monthlySales > 0 ? sum / monthlySales * 100 : 0 }
  }).filter(c => c.sum > 0).sort((a, b) => b.sum - a.sum).slice(0, 5)

  // Top expense categories
  const expByCategory = expenseCategories.map(cat => {
    const sum = monthly
      .filter(t => t.type === 'expense' && t.category === cat.id)
      .reduce((s, t) => s + t.amount, 0)
    return { label: cat.label, sum, pct: monthlyExpenses > 0 ? sum / monthlyExpenses * 100 : 0 }
  }).filter(c => c.sum > 0).sort((a, b) => b.sum - a.sum).slice(0, 5)

  // Best day
  const dayProfits = Array.from({ length: 30 }, (_, i) => {
    const day = daysAgo(29 - i)
    const dayTx = transactions.filter(t => {
      const td = new Date(t.date)
      return td.toDateString() === day.toDateString()
    })
    return { day, profit: getProfit(dayTx) }
  })
  const bestDay = dayProfits.reduce((max, d) => d.profit > max.profit ? d : max, dayProfits[0])

  if (!mounted) return null

  return (
    <main className="px-5 lg:px-10 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Hisobot</h1>
          <p className="text-sm text-mute mt-1">Iyun 2026 · so'nggi 30 kun</p>
        </div>
        <button className="px-4 py-2.5 rounded-xl border border-border bg-surface text-sm font-bold hover:bg-subtle transition-colors">
          Excel'ga eksport
        </button>
      </div>

      {/* Hero profit */}
      <div className="bg-surface rounded-2xl border border-border p-6 lg:p-8 mb-6">
        <p className="text-xs uppercase tracking-wide text-mute font-bold">Oylik sof foyda</p>
        <div className="flex items-baseline gap-4 mt-3">
          <p className="text-5xl lg:text-6xl font-black tabular-nums tracking-tight">
            {formatNumber(monthlyProfit)}
          </p>
          <p className="text-lg text-mute font-bold">so'm</p>
        </div>
        {prevProfit > 0 && (
          <p className="text-sm text-mute mt-3">
            o'tgan oydan {profitChange > 0 ? '+' : ''}{profitChange}%
          </p>
        )}
      </div>

      {/* Line chart */}
      <div className="bg-surface rounded-2xl border border-border p-6 mb-6">
        <h2 className="text-lg font-bold mb-1">Foyda dinamikasi</h2>
        <p className="text-xs text-mute mb-6">Har kunlik sof foyda</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="day" stroke="#64748B" fontSize={12} />
              <YAxis stroke="#64748B" fontSize={12} tickFormatter={(v) => formatCompact(v)} />
              <Tooltip
                formatter={(v) => [formatNumber(Number(v)) + ' so\'m', 'Foyda']}
                labelFormatter={(l) => `${l}-kun`}
                contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0' }}
              />
              <Line type="monotone" dataKey="foyda" stroke="#0077CC" strokeWidth={3} dot={{ fill: '#0077CC', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top categories — 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-surface rounded-2xl border border-border p-6">
          <h2 className="text-lg font-bold mb-1">Top savdo kategoriyalari</h2>
          <p className="text-xs text-mute mb-5">So'nggi 30 kun</p>
          <div className="space-y-4">
            {saleByCategory.map((c) => (
              <div key={c.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm font-bold">{c.label}</p>
                  <p className="text-sm font-bold tabular-nums">{Math.round(c.pct)}%</p>
                </div>
                <div className="h-2 bg-subtle rounded-full overflow-hidden">
                  <div className="h-full bg-blue rounded-full" style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface rounded-2xl border border-border p-6">
          <h2 className="text-lg font-bold mb-1">Top xarajat kategoriyalari</h2>
          <p className="text-xs text-mute mb-5">So'nggi 30 kun</p>
          <div className="space-y-4">
            {expByCategory.map((c) => (
              <div key={c.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm font-bold">{c.label}</p>
                  <p className="text-sm font-bold tabular-nums">{Math.round(c.pct)}%</p>
                </div>
                <div className="h-2 bg-subtle rounded-full overflow-hidden">
                  <div className="h-full bg-ink rounded-full" style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Best day */}
      <div className="bg-surface rounded-2xl border border-border p-6">
        <p className="text-xs uppercase tracking-wide text-mute font-bold">Eng yaxshi kun</p>
        <p className="text-2xl font-black mt-2">
          {bestDay.day.toLocaleDateString('uz-UZ', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
        <p className="text-3xl font-black tabular-nums text-blue-dark mt-2">
          +{formatNumber(bestDay.profit)} <span className="text-base text-mute font-bold">so'm</span>
        </p>
      </div>
    </main>
  )
}
