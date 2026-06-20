'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Bell, FileDown } from 'lucide-react'
import { useKassaStore } from '@/store/useKassaStore'
import { useLang } from '@/hooks/useLang'
import { formatNumber, formatCompact } from '@/lib/formatCurrency'
import { filterByDay, sumByType, daysAgo, getProfit } from '@/lib/dateUtils'
import { KpiHeroCard } from '@/components/home/KpiHeroCard'
import { KpiCard } from '@/components/home/KpiCard'
import { WeeklyChart } from '@/components/home/WeeklyChart'
import { TransactionItem } from '@/components/home/TransactionItem'
import { LangSwitch } from '@/components/layout/LangSwitch'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const { tr, lang } = useLang()

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
  const locale = lang === 'ru' ? 'ru-RU' : 'uz-UZ'

  // Today calculations
  const today = new Date()
  const todayTx = filterByDay(transactions, today)
  const todaySales = sumByType(todayTx, 'sale')
  const todayExpenses = sumByType(todayTx, 'expense')

  // Monthly projection
  const last30Days = transactions.filter(t => new Date(t.date) >= daysAgo(30))
  const monthlyProjection = getProfit(last30Days)

  // Avg ticket
  const todaySalesTx = todayTx.filter(t => t.type === 'sale')
  const avgTicket = todaySalesTx.length > 0 ? todaySales / todaySalesTx.length : 0

  // Margin
  const margin = todaySales > 0
    ? Math.round((todaySales - todayExpenses) / todaySales * 100 * 10) / 10
    : 0

  const recentTx = (todayTx.length > 0 ? todayTx : transactions).slice(0, 5)

  const dateLabel = new Date().toLocaleDateString(locale, {
    day: 'numeric', month: 'long', year: 'numeric', weekday: 'long',
  })

  if (!mounted) return null

  return (
    <>
      {/* MOBILE */}
      <main className="lg:hidden px-5 pt-6">
        <header className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-mute font-medium">{tr.home.greeting}, Akmal</p>
            <p className="text-sm font-bold text-ink">
              {settings.businessName} · {settings.location}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <LangSwitch />
            <button
              className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center"
              aria-label="Bildirishnomalar"
            >
              <Bell size={18} strokeWidth={2} className="text-ink" />
            </button>
          </div>
        </header>

        <KpiHeroCard />

        <Link
          href="/transactions/new"
          className="mt-4 w-full bg-blue text-white rounded-xl py-4 font-bold text-base flex items-center justify-center gap-2"
        >
          <Plus size={20} strokeWidth={2.5} />
          {tr.home.addNew}
        </Link>

        <div className="mt-8 mb-2">
          <h2 className="text-lg font-bold mb-4">{tr.home.thisWeek}</h2>
          <WeeklyChart />
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">{tr.home.todayEntries}</h2>
            <Link href="/transactions" className="text-xs text-blue font-bold">
              {tr.home.all}
            </Link>
          </div>
          <div className="space-y-3 bg-surface rounded-2xl border border-border p-4">
            {recentTx.length === 0 ? (
              <p className="text-sm text-mute text-center py-4">{tr.home.noEntriesToday}</p>
            ) : (
              recentTx.map(tx => (
                <TransactionItem key={tx.id} transaction={tx} allCategories={allCategories} variant="mobile" />
              ))
            )}
          </div>
        </div>
      </main>

      {/* DESKTOP */}
      <main className="hidden lg:block px-10 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight">{tr.home.title}</h1>
            <p className="text-sm text-mute mt-1 capitalize">{dateLabel}</p>
          </div>
          <div className="flex items-center gap-3">
            <LangSwitch />
            <button className="px-4 py-2.5 rounded-xl border border-border bg-surface text-sm font-bold flex items-center gap-2 hover:bg-subtle transition-colors">
              <FileDown size={16} strokeWidth={2.5} />
              {tr.reports.title}
            </button>
            <Link
              href="/transactions/new"
              className="px-4 py-2.5 rounded-xl bg-blue text-white text-sm font-bold flex items-center gap-2"
            >
              <Plus size={16} strokeWidth={2.5} />
              {tr.newTx.title}
            </Link>
          </div>
        </div>

        {/* KPI region */}
        <div className="grid grid-cols-12 gap-4 mb-4">
          <div className="col-span-6 row-span-2 flex flex-col gap-4">
            <KpiHeroCard />
            <div className="bg-surface rounded-2xl border border-border p-6 flex-1">
              <p className="text-xs text-mute font-bold uppercase tracking-wide mb-2">
                {tr.home.monthlyForecast}
              </p>
              <p className="text-2xl font-bold tabular-nums">
                ~ {formatCompact(monthlyProjection)} <span className="text-sm text-mute font-bold">so'm</span>
              </p>
              <p className="text-xs text-mute mt-2">{tr.home.forecastBasis}</p>
            </div>
          </div>

          <div className="col-span-3">
            <KpiCard label={tr.home.todaySales} value={formatNumber(todaySales)} hint={`${todaySalesTx.length} ${tr.home.operations}`} dotColor="blue" />
          </div>
          <div className="col-span-3">
            <KpiCard label={tr.home.todayExpense} value={formatNumber(todayExpenses)} hint={`${todayTx.filter(t => t.type === 'expense').length} ${tr.home.entries}`} dotColor="ink" />
          </div>
          <div className="col-span-3">
            <KpiCard label={tr.home.avgTicket} value={formatNumber(avgTicket)} hint={tr.home.todaySales} />
          </div>
          <div className="col-span-3">
            <KpiCard label={tr.home.margin} value={<>{margin}<span className="text-lg text-mute">%</span></>} hint={tr.home.margin} />
          </div>
        </div>

        {/* Chart + transactions */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-8">
            <WeeklyChart />
          </div>

          <div className="col-span-4">
            <div className="bg-surface rounded-2xl border border-border p-6 h-full">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold">{tr.home.todayEntries}</h2>
                <Link href="/transactions" className="text-xs text-blue font-bold">
                  {tr.home.all}
                </Link>
              </div>
              <div className="space-y-4">
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
