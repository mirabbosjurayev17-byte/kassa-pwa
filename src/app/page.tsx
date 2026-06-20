'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Bell, BarChart3, ListOrdered, Settings, ArrowUp, ArrowDown, FileDown } from 'lucide-react'
import { useKassaStore } from '@/store/useKassaStore'
import { useLang } from '@/hooks/useLang'
import { formatNumber, formatCompact } from '@/lib/formatCurrency'
import { filterByDay, sumByType, getProfit } from '@/lib/dateUtils'
import { WeeklyChart } from '@/components/home/WeeklyChart'
import { TransactionItem } from '@/components/home/TransactionItem'
import { KpiCard } from '@/components/home/KpiCard'
import { LangSwitch } from '@/components/layout/LangSwitch'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const { tr } = useLang()

  const transactions = useKassaStore(s => s.transactions)
  const settings = useKassaStore(s => s.settings)
  const saleCategories = useKassaStore(s => s.saleCategories)
  const expenseCategories = useKassaStore(s => s.expenseCategories)
  const seedDemo = useKassaStore(s => s.seedDemo)

  useEffect(() => {
    setMounted(true)
    seedDemo()
  }, [seedDemo])

  const allCategories = [...saleCategories, ...expenseCategories]

  const today = new Date()
  const todayTx = filterByDay(transactions, today)
  const todaySales = sumByType(todayTx, 'sale')
  const todayExpenses = sumByType(todayTx, 'expense')
  const todayProfit = getProfit(todayTx)

  const todaySalesTx = todayTx.filter(t => t.type === 'sale')
  const expenseCount = todayTx.filter(t => t.type === 'expense').length
  const avgTicket = todaySalesTx.length > 0 ? todaySales / todaySalesTx.length : 0
  const margin = todaySales > 0
    ? Math.round((todaySales - todayExpenses) / todaySales * 100 * 10) / 10
    : 0

  const recentTx = (todayTx.length > 0 ? todayTx : transactions).slice(0, 5)

  const quickActions = [
    { icon: Plus, label: tr.newTx.sale, href: '/transactions/new' },
    { icon: BarChart3, label: tr.nav.reports, href: '/reports' },
    { icon: ListOrdered, label: tr.nav.transactions, href: '/transactions' },
    { icon: Settings, label: tr.nav.settings, href: '/settings' },
  ]

  if (!mounted) return null

  return (
    <>
      {/* ───────── MOBILE ───────── */}
      <main className="lg:hidden">
        {/* Hero — gradient */}
        <div className="bg-hero-gradient min-h-[52vh] px-5 pt-6 pb-16 relative">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-white/60 text-xs font-medium">{tr.home.greeting}</p>
              <p className="text-white font-bold text-base">{settings.businessName}</p>
            </div>
            <div className="flex items-center gap-2">
              <LangSwitch variant="light" />
              <button className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center" aria-label="Bildirishnomalar">
                <Bell size={18} className="text-white" />
              </button>
            </div>
          </div>

          <div className="text-center mb-6">
            <p className="text-white/70 text-xs uppercase tracking-widest font-bold mb-3">{tr.home.todayProfit}</p>
            <p className="text-white text-6xl font-black tabular-nums tracking-tight leading-none">{formatNumber(todayProfit)}</p>
            <p className="text-white/60 text-sm mt-2">so'm</p>
          </div>

          <div className="flex justify-center gap-6">
            {quickActions.map(item => (
              <Link key={item.href} href={item.href} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                  <item.icon size={20} className="text-white" />
                </div>
                <span className="text-white/70 text-xs font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Floating cards */}
        <div className="px-5 -mt-8 relative z-10">
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-card-income rounded-2xl p-4 text-white">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                  <ArrowUp size={14} className="text-white" />
                </div>
                <p className="text-xs font-medium text-white/80">{tr.home.sales}</p>
              </div>
              <p className="text-xl font-black tabular-nums">{formatCompact(todaySales)}</p>
              <p className="text-xs text-white/60 mt-1">{todaySalesTx.length} {tr.home.operations}</p>
            </div>

            <div className="bg-card-outcome rounded-2xl p-4 text-white">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                  <ArrowDown size={14} className="text-white" />
                </div>
                <p className="text-xs font-medium text-white/80">{tr.home.expense}</p>
              </div>
              <p className="text-xl font-black tabular-nums">{formatCompact(todayExpenses)}</p>
              <p className="text-xs text-white/60 mt-1">{expenseCount} {tr.home.entries}</p>
            </div>
          </div>

          {/* Chart card */}
          <div className="bg-surface rounded-2xl border border-border p-5 mb-6 shadow-lg shadow-blue-dark/5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold">{tr.home.thisWeek}</h2>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue" />
                  <span className="text-xs text-mute">{tr.home.sales}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal" />
                  <span className="text-xs text-mute">{tr.home.expense}</span>
                </div>
              </div>
            </div>
            <WeeklyChart />
          </div>

          {/* Recent transactions */}
          <div className="bg-surface rounded-2xl border border-border p-5 shadow-lg shadow-blue-dark/5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold">{tr.home.todayEntries}</h2>
              <Link href="/transactions" className="text-xs text-blue font-bold">{tr.home.all}</Link>
            </div>
            <div className="space-y-3">
              {recentTx.length === 0 ? (
                <p className="text-sm text-mute text-center py-4">{tr.home.noEntriesToday}</p>
              ) : (
                recentTx.map(tx => (
                  <TransactionItem key={tx.id} transaction={tx} allCategories={allCategories} variant="mobile" />
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ───────── DESKTOP ───────── */}
      <main className="hidden lg:block">
        {/* Hero banner */}
        <div className="bg-hero-gradient px-10 py-10">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-white/60 text-sm mb-1">{tr.home.greeting}, Akmal</p>
              <p className="text-white/90 text-sm mb-3">{settings.businessName} · {settings.location}</p>
              <p className="text-xs text-white/50 uppercase tracking-widest font-bold mb-2">{tr.home.todayProfit}</p>
              <p className="text-white text-6xl font-black tabular-nums tracking-tight">
                {formatNumber(todayProfit)}
                <span className="text-2xl text-white/50 font-bold ml-2">so'm</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <LangSwitch variant="light" />
              <button className="px-4 py-2.5 rounded-xl border border-white/20 bg-white/10 text-white text-sm font-bold hover:bg-white/20 transition-colors flex items-center gap-2">
                <FileDown size={16} />
                {tr.reports.export}
              </button>
              <Link
                href="/transactions/new"
                className="px-5 py-2.5 rounded-xl bg-teal text-ink text-sm font-black flex items-center gap-2 hover:bg-teal-light transition-colors"
              >
                <Plus size={16} strokeWidth={3} />
                {tr.home.addNew}
              </Link>
            </div>
          </div>
        </div>

        {/* Floating KPI cards */}
        <div className="px-10 -mt-6 relative z-10 mb-8">
          <div className="grid grid-cols-4 gap-4">
            <KpiCard label={tr.home.todaySales} value={formatNumber(todaySales)} hint={`${todaySalesTx.length} ${tr.home.operations}`} dotColor="blue" />
            <KpiCard label={tr.home.todayExpense} value={formatNumber(todayExpenses)} hint={`${expenseCount} ${tr.home.entries}`} dotColor="teal" />
            <KpiCard label={tr.home.avgTicket} value={formatNumber(avgTicket)} hint={tr.home.todaySales} />
            <KpiCard label={tr.home.margin} value={<>{margin}<span className="text-lg text-mute">%</span></>} hint={tr.home.margin} />
          </div>
        </div>

        {/* Chart + transactions */}
        <div className="px-10 pb-10">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 bg-surface rounded-2xl border border-border p-6 shadow-lg shadow-blue-dark/5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">{tr.home.thisWeek}</h2>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue" />
                    <span className="text-xs text-mute">{tr.home.sales}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal" />
                    <span className="text-xs text-mute">{tr.home.expense}</span>
                  </div>
                </div>
              </div>
              <WeeklyChart />
            </div>

            <div className="bg-surface rounded-2xl border border-border p-6 shadow-lg shadow-blue-dark/5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">{tr.home.todayEntries}</h2>
                <Link href="/transactions" className="text-xs text-blue font-bold">{tr.home.all}</Link>
              </div>
              <div className="space-y-3">
                {recentTx.length === 0 ? (
                  <p className="text-sm text-mute text-center py-4">{tr.home.noEntriesToday}</p>
                ) : (
                  recentTx.map(tx => (
                    <TransactionItem key={tx.id} transaction={tx} allCategories={allCategories} variant="desktop" />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
