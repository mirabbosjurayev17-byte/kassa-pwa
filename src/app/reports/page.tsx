'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { useKassaStore } from '@/store/useKassaStore'
import { useLang } from '@/hooks/useLang'
import { formatNumber, formatCompact } from '@/lib/formatCurrency'
import { getProfit, sumByType } from '@/lib/dateUtils'
import { exportToCsv } from '@/lib/exportCsv'
import { showToast } from '@/lib/toast'
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { ChevronDown } from 'lucide-react'
import { ScreenSkeleton } from '@/components/system/Skeleton'

function getMonthRange(monthOffset: number, locale: string): { start: Date; end: Date; label: string } {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1)
  const end   = new Date(now.getFullYear(), now.getMonth() - monthOffset + 1, 0, 23, 59, 59, 999)
  const label = start.toLocaleDateString(locale, { month: 'long', year: 'numeric' })
  return { start, end, label }
}

function getDaysInMonth(start: Date): number {
  return new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate()
}

export default function ReportsPage() {
  const [mounted, setMounted] = useState(false)
  const { tr, lang } = useLang()
  const transactions = useKassaStore(s => s.transactions)
  const saleCategories = useKassaStore(s => s.saleCategories)
  const expenseCategories = useKassaStore(s => s.expenseCategories)
  const allCategories = useMemo(() => [...saleCategories, ...expenseCategories], [saleCategories, expenseCategories])

  const [monthOffset, setMonthOffset] = useState(0)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const locale = lang === 'ru' ? 'ru-RU' : 'uz-UZ'
  const monthOptions = [0, 1, 2].map(i => ({ offset: i, ...getMonthRange(i, locale) }))
  const { start, end, label: monthLabel } = getMonthRange(monthOffset, locale)

  const monthly = useMemo(
    () => transactions.filter(t => {
      const d = new Date(t.date)
      return d >= start && d <= end
    }),
    [transactions, start, end]
  )

  const { start: prevStart, end: prevEnd } = getMonthRange(monthOffset + 1, locale)
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

  const bestDay = useMemo(
    () => dailyData.reduce(
      (max, d) => d.foyda > max.foyda ? d : max,
      dailyData[0] ?? { kun: 1, foyda: 0 }
    ),
    [dailyData]
  )

  function handleExport() {
    if (monthly.length === 0) {
      showToast(tr.reports.noEntries, 'error')
      return
    }
    exportToCsv(
      monthly,
      allCategories,
      `kassa-${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}.csv`
    )
    showToast(`${monthly.length} ${tr.settings.updated.exported}`)
  }

  if (!mounted) return <ScreenSkeleton />

  return (
    <main className="px-5 lg:px-10 py-8 max-w-6xl mx-auto animate-fade-up">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{tr.reports.title}</h1>
          <p className="text-sm text-mute mt-1">{tr.reports.subtitle}</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen(o => !o)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-surface text-sm font-semibold hover:bg-subtle transition-colors capitalize"
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
                    className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-subtle transition-colors capitalize ${
                      monthOffset === opt.offset ? 'font-semibold text-ink' : 'text-mute'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={handleExport}
            className="px-4 py-2.5 rounded-xl border border-border bg-surface text-sm font-semibold hover:bg-subtle transition-colors"
          >
            {tr.reports.export}
          </button>
        </div>
      </div>

      {/* Hero profit */}
      <div className="card p-6 lg:p-8 mb-6">
        <p className="text-xs uppercase tracking-wide text-mute font-semibold">{tr.reports.monthlyProfit}</p>
        <div className="flex items-baseline gap-4 mt-3">
          <p className="text-5xl lg:text-6xl font-semibold tabular-nums tracking-tight">
            {formatNumber(monthlyProfit)}
          </p>
          <p className="text-lg text-mute font-semibold">so'm</p>
        </div>
        {prevProfit > 0 && (
          <p className="text-sm text-mute mt-3">
            {tr.reports.prevMonth} {profitChange > 0 ? '+' : ''}{profitChange}%
          </p>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mt-6 pt-6 border-t border-border">
          <div>
            <p className="text-xs text-mute font-medium mb-1">{tr.home.sales}</p>
            <p className="text-lg font-semibold tabular-nums">{formatNumber(monthlySales)}</p>
          </div>
          <div>
            <p className="text-xs text-mute font-medium mb-1">{tr.home.expense}</p>
            <p className="text-lg font-semibold tabular-nums">{formatNumber(monthlyExpenses)}</p>
          </div>
          <div>
            <p className="text-xs text-mute font-medium mb-1">{tr.reports.transactions}</p>
            <p className="text-lg font-semibold tabular-nums">{monthly.length}</p>
          </div>
        </div>
      </div>

      {/* Line chart */}
      <div className="card p-6 mb-6">
        <h2 className="text-lg font-semibold mb-1">{tr.reports.profitDynamics}</h2>
        <p className="text-xs text-mute mb-6 capitalize">{tr.reports.dailyProfit} — {monthLabel}</p>
        <div className="h-56 lg:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DBE7E1" vertical={false} />
              <XAxis dataKey="kun" stroke="#5E726B" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#5E726B" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => formatCompact(Number(v))} width={52} />
              <Tooltip
                formatter={(v) => [formatNumber(Number(v)) + " so'm", tr.transactions.profit]}
                labelFormatter={l => lang === 'ru' ? `${l} день` : `${l}-kun`}
                contentStyle={{ borderRadius: 12, border: '1px solid #DBE7E1', fontSize: 13, fontWeight: 600 }}
              />
              <Line type="monotone" dataKey="foyda" stroke="#03624C" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#00DF81' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top kategoriyalar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="card p-6">
          <h2 className="text-base font-semibold mb-1">{tr.reports.topSale}</h2>
          <p className="text-xs text-mute mb-5 capitalize">{monthLabel}</p>
          {topSale.length === 0 ? (
            <p className="text-sm text-mute">{tr.reports.noSales}</p>
          ) : (
            <div className="space-y-4">
              {topSale.map(c => (
                <div key={c.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm font-semibold">{c.label}</p>
                    <p className="text-sm font-semibold tabular-nums">{Math.round(c.pct)}%</p>
                  </div>
                  <div className="h-1.5 bg-subtle rounded-full overflow-hidden">
                    <div className="h-full bg-green rounded-full transition-all" style={{ width: `${c.pct}%` }} />
                  </div>
                  <p className="text-xs text-mute mt-1 tabular-nums">{formatNumber(c.sum)} so'm</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-6">
          <h2 className="text-base font-semibold mb-1">{tr.reports.topExpense}</h2>
          <p className="text-xs text-mute mb-5 capitalize">{monthLabel}</p>
          {topExpense.length === 0 ? (
            <p className="text-sm text-mute">{tr.reports.noExpenses}</p>
          ) : (
            <div className="space-y-4">
              {topExpense.map(c => (
                <div key={c.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm font-semibold">{c.label}</p>
                    <p className="text-sm font-semibold tabular-nums">{Math.round(c.pct)}%</p>
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
        <div className="card p-6">
          <p className="text-xs uppercase tracking-wide text-mute font-semibold">{tr.reports.bestDay}</p>
          <p className="text-base font-semibold mt-2 capitalize">
            {new Date(start.getFullYear(), start.getMonth(), bestDay.kun).toLocaleDateString(locale, {
              weekday: 'long', day: 'numeric', month: 'long',
            })}
          </p>
          <p className="text-3xl font-semibold tabular-nums text-green-dark mt-2">
            +{formatNumber(bestDay.foyda)} <span className="text-base text-mute font-semibold">so'm</span>
          </p>
        </div>
      )}
    </main>
  )
}
