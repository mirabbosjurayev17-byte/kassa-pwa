'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { useKassaStore } from '@/store/useKassaStore'
import { formatNumber, formatCompact } from '@/lib/formatCurrency'
import { getProfit, sumByType } from '@/lib/dateUtils'
import { exportToCsv } from '@/lib/exportCsv'
import { showToast } from '@/lib/toast'
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { ChevronDown } from 'lucide-react'

// Oy boshini qaytaradi: monthOffset 0 = joriy oy, 1 = o'tgan oy, ...
function getMonthRange(monthOffset: number): { start: Date; end: Date; label: string } {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1)
  const end   = new Date(now.getFullYear(), now.getMonth() - monthOffset + 1, 0, 23, 59, 59, 999)
  const label = start.toLocaleDateString('uz-UZ', { month: 'long', year: 'numeric' })
  return { start, end, label }
}

// Oyning necha kuni borligini aniqlaydi
function getDaysInMonth(start: Date): number {
  return new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate()
}

export default function ReportsPage() {
  const [mounted, setMounted] = useState(false)
  const transactions    = useKassaStore(s => s.transactions)
  const saleCategories  = useKassaStore(s => s.saleCategories)
  const expenseCategories = useKassaStore(s => s.expenseCategories)
  const allCategories   = useMemo(() => [...saleCategories, ...expenseCategories], [saleCategories, expenseCategories])

  const [monthOffset, setMonthOffset] = useState(0)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => setMounted(true), [])

  // Dropdown'ni tashqariga bosganda yopish
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const monthOptions = [0, 1, 2].map(i => ({ offset: i, ...getMonthRange(i) }))
  const { start, end, label: monthLabel } = getMonthRange(monthOffset)

  // Tanlangan oy tranzaksiyalari
  const monthly = useMemo(
    () => transactions.filter(t => {
      const d = new Date(t.date)
      return d >= start && d <= end
    }),
    [transactions, start, end]
  )

  // O'tgan oy (taqqoslash uchun)
  const { start: prevStart, end: prevEnd } = getMonthRange(monthOffset + 1)
  const prevMonthly = useMemo(
    () => transactions.filter(t => {
      const d = new Date(t.date)
      return d >= prevStart && d <= prevEnd
    }),
    [transactions, prevStart, prevEnd]
  )

  const monthlyProfit   = getProfit(monthly)
  const monthlySales    = sumByType(monthly, 'sale')
  const monthlyExpenses = sumByType(monthly, 'expense')
  const prevProfit      = getProfit(prevMonthly)
  const profitChange    = prevProfit > 0
    ? Math.round((monthlyProfit - prevProfit) / prevProfit * 100 * 10) / 10
    : 0

  // Kunlik foyda — line chart uchun
  const daysCount = getDaysInMonth(start)
  const dailyData = useMemo(
    () => Array.from({ length: daysCount }, (_, i) => {
      const day     = new Date(start.getFullYear(), start.getMonth(), i + 1)
      const dayNext = new Date(start.getFullYear(), start.getMonth(), i + 2)
      const dayTx   = monthly.filter(t => {
        const d = new Date(t.date)
        return d >= day && d < dayNext
      })
      return { kun: i + 1, foyda: getProfit(dayTx) }
    }),
    [monthly, start, daysCount]
  )

  // Top kategoriyalar
  const topSale = useMemo(
    () => saleCategories
      .map(cat => ({
        label: cat.label,
        sum: monthly.filter(t => t.type === 'sale' && t.category === cat.id).reduce((s, t) => s + t.amount, 0),
      }))
      .filter(c => c.sum > 0)
      .sort((a, b) => b.sum - a.sum)
      .slice(0, 5)
      .map(c => ({ ...c, pct: monthlySales > 0 ? (c.sum / monthlySales) * 100 : 0 })),
    [monthly, saleCategories, monthlySales]
  )

  const topExpense = useMemo(
    () => expenseCategories
      .map(cat => ({
        label: cat.label,
        sum: monthly.filter(t => t.type === 'expense' && t.category === cat.id).reduce((s, t) => s + t.amount, 0),
      }))
      .filter(c => c.sum > 0)
      .sort((a, b) => b.sum - a.sum)
      .slice(0, 5)
      .map(c => ({ ...c, pct: monthlyExpenses > 0 ? (c.sum / monthlyExpenses) * 100 : 0 })),
    [monthly, expenseCategories, monthlyExpenses]
  )

  // Eng yaxshi kun
  const bestDay = useMemo(
    () => dailyData.reduce(
      (max, d) => d.foyda > max.foyda ? d : max,
      dailyData[0] ?? { kun: 1, foyda: 0 }
    ),
    [dailyData]
  )

  function handleExport() {
    if (monthly.length === 0) {
      showToast('Bu oyda yozuv yo\'q', 'error')
      return
    }
    exportToCsv(
      monthly,
      allCategories,
      `kassa-${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}.csv`
    )
    showToast(`✓ ${monthly.length} ta yozuv eksport qilindi`)
  }

  if (!mounted) return null

  return (
    <main className="px-5 lg:px-10 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Hisobot</h1>
          <p className="text-sm text-mute mt-1">So'nggi 30 kun tahlili</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Oy dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen(o => !o)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-surface text-sm font-bold hover:bg-subtle transition-colors"
            >
              {monthLabel}
              <ChevronDown size={15} strokeWidth={2.5} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 bg-surface border border-border rounded-xl overflow-hidden shadow-lg shadow-ink/5 z-20 min-w-max">
                {monthOptions.map(opt => (
                  <button
                    key={opt.offset}
                    onClick={() => { setMonthOffset(opt.offset); setDropdownOpen(false) }}
                    className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-subtle transition-colors ${
                      monthOffset === opt.offset ? 'font-bold text-ink' : 'text-mute'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* CSV */}
          <button
            onClick={handleExport}
            className="px-4 py-2.5 rounded-xl border border-border bg-surface text-sm font-bold hover:bg-subtle transition-colors"
          >
            CSV eksport
          </button>
        </div>
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

        {/* Oylik stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mt-6 pt-6 border-t border-border">
          <div>
            <p className="text-xs text-mute font-medium mb-1">Savdo</p>
            <p className="text-lg font-bold tabular-nums">{formatNumber(monthlySales)}</p>
          </div>
          <div>
            <p className="text-xs text-mute font-medium mb-1">Xarajat</p>
            <p className="text-lg font-bold tabular-nums">{formatNumber(monthlyExpenses)}</p>
          </div>
          <div>
            <p className="text-xs text-mute font-medium mb-1">Tranzaksiyalar</p>
            <p className="text-lg font-bold tabular-nums">{monthly.length} ta</p>
          </div>
        </div>
      </div>

      {/* Line chart */}
      <div className="bg-surface rounded-2xl border border-border p-6 mb-6">
        <h2 className="text-lg font-bold mb-1">Foyda dinamikasi</h2>
        <p className="text-xs text-mute mb-6">Har kunlik sof foyda — {monthLabel}</p>
        <div className="h-56 lg:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis
                dataKey="kun"
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={v => formatCompact(Number(v))}
                width={52}
              />
              <Tooltip
                formatter={(v) => [formatNumber(Number(v)) + " so'm", 'Foyda']}
                labelFormatter={l => `${l}-kun`}
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid #E2E8F0',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              />
              <Line
                type="monotone"
                dataKey="foyda"
                stroke="#1883FF"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: '#1883FF' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top kategoriyalar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Savdo */}
        <div className="bg-surface rounded-2xl border border-border p-6">
          <h2 className="text-base font-bold mb-1">Top savdo kategoriyalari</h2>
          <p className="text-xs text-mute mb-5">{monthLabel}</p>
          {topSale.length === 0 ? (
            <p className="text-sm text-mute">Bu oyda savdo yo'q</p>
          ) : (
            <div className="space-y-4">
              {topSale.map(c => (
                <div key={c.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm font-bold">{c.label}</p>
                    <p className="text-sm font-bold tabular-nums">{Math.round(c.pct)}%</p>
                  </div>
                  <div className="h-1.5 bg-subtle rounded-full overflow-hidden">
                    <div className="h-full bg-blue rounded-full transition-all" style={{ width: `${c.pct}%` }} />
                  </div>
                  <p className="text-xs text-mute mt-1 tabular-nums">{formatNumber(c.sum)} so'm</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Xarajat */}
        <div className="bg-surface rounded-2xl border border-border p-6">
          <h2 className="text-base font-bold mb-1">Top xarajat kategoriyalari</h2>
          <p className="text-xs text-mute mb-5">{monthLabel}</p>
          {topExpense.length === 0 ? (
            <p className="text-sm text-mute">Bu oyda xarajat yo'q</p>
          ) : (
            <div className="space-y-4">
              {topExpense.map(c => (
                <div key={c.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm font-bold">{c.label}</p>
                    <p className="text-sm font-bold tabular-nums">{Math.round(c.pct)}%</p>
                  </div>
                  <div className="h-1.5 bg-subtle rounded-full overflow-hidden">
                    <div className="h-full bg-ink rounded-full transition-all" style={{ width: `${c.pct}%` }} />
                  </div>
                  <p className="text-xs text-mute mt-1 tabular-nums">{formatNumber(c.sum)} so'm</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Eng yaxshi kun */}
      {bestDay.foyda > 0 && (
        <div className="bg-surface rounded-2xl border border-border p-6">
          <p className="text-xs uppercase tracking-wide text-mute font-bold mb-3">Eng yaxshi kun</p>
          <p className="text-base font-bold">
            {new Date(start.getFullYear(), start.getMonth(), bestDay.kun).toLocaleDateString('uz-UZ', {
              weekday: 'long', day: 'numeric', month: 'long',
            })}
          </p>
          <p className="text-3xl font-black tabular-nums mt-2">
            +{formatNumber(bestDay.foyda)}{' '}
            <span className="text-base text-mute font-bold">so'm</span>
          </p>
        </div>
      )}
    </main>
  )
}
