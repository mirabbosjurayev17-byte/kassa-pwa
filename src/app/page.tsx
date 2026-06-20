'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Bell, FileDown } from 'lucide-react'
import { useKassaStore } from '@/store/useKassaStore'
import { formatNumber, formatCompact } from '@/lib/formatCurrency'
import { filterByDay, sumByType, daysAgo, getProfit } from '@/lib/dateUtils'
import { KpiHeroCard } from '@/components/home/KpiHeroCard'
import { KpiCard } from '@/components/home/KpiCard'
import { WeeklyChart } from '@/components/home/WeeklyChart'
import { TransactionItem } from '@/components/home/TransactionItem'

export default function Home() {
  // Hydration guard: zustand persist localStorage'dan sync rehydrate qiladi.
  const [mounted, setMounted] = useState(false)

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

  // Today calculations
  const today = new Date()
  const todayTx = filterByDay(transactions, today)
  const todaySales = sumByType(todayTx, 'sale')
  const todayExpenses = sumByType(todayTx, 'expense')

  // Monthly projection (current month avg × days in month)
  const last30Days = transactions.filter(t => {
    const d = new Date(t.date)
    return d >= daysAgo(30)
  })
  const last30Profit = getProfit(last30Days)
  const avgDailyProfit = last30Profit / 30
  const monthlyProjection = avgDailyProfit * 30

  // Avg ticket
  const todaySalesTx = todayTx.filter(t => t.type === 'sale')
  const avgTicket = todaySalesTx.length > 0
    ? todaySales / todaySalesTx.length
    : 0

  // Margin
  const margin = todaySales > 0
    ? Math.round((todaySales - todayExpenses) / todaySales * 100 * 10) / 10
    : 0

  // Recent transactions (last 5 of today, or fallback to recent overall)
  const recentTx = (todayTx.length > 0 ? todayTx : transactions).slice(0, 5)

  // Date
  const dateLabel = new Date().toLocaleDateString('uz-UZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  })

  if (!mounted) return null

  return (
    <>
      {/* MOBILE */}
      <main className="lg:hidden px-5 pt-6">
        {/* Top bar */}
        <header className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-mute font-medium">Salom, Akmal</p>
            <p className="text-sm font-bold text-ink">
              {settings.businessName} · {settings.location}
            </p>
          </div>
          <button
            className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center"
            aria-label="Bildirishnomalar"
          >
            <Bell size={18} strokeWidth={2} className="text-ink" />
          </button>
        </header>

        {/* Hero */}
        <KpiHeroCard />

        {/* CTA */}
        <Link
          href="/transactions/new"
          className="mt-4 w-full bg-ink text-white rounded-xl py-4 font-bold text-base flex items-center justify-center gap-2"
        >
          <Plus size={20} strokeWidth={2.5} />
          Yangi yozuv qo'shish
        </Link>

        {/* Chart */}
        <div className="mt-8 mb-2">
          <h2 className="text-lg font-bold mb-4">Bu hafta</h2>
          <WeeklyChart />
        </div>

        {/* Recent transactions */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Bugungi yozuvlar</h2>
            <Link href="/transactions" className="text-xs text-blue font-bold">
              Hammasi
            </Link>
          </div>
          <div className="space-y-3 bg-surface rounded-2xl border border-border p-4">
            {recentTx.length === 0 ? (
              <p className="text-sm text-mute text-center py-4">
                Bugun hali yozuv yo'q
              </p>
            ) : (
              recentTx.map(tx => (
                <TransactionItem
                  key={tx.id}
                  transaction={tx}
                  allCategories={allCategories}
                  variant="mobile"
                />
              ))
            )}
          </div>
        </div>
      </main>

      {/* DESKTOP */}
      <main className="hidden lg:block px-10 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Bosh sahifa</h1>
            <p className="text-sm text-mute mt-1 capitalize">{dateLabel}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2.5 rounded-xl border border-border bg-surface text-sm font-bold flex items-center gap-2 hover:bg-subtle transition-colors">
              <FileDown size={16} strokeWidth={2.5} />
              Hisobot
            </button>
            <Link
              href="/transactions/new"
              className="px-4 py-2.5 rounded-xl bg-ink text-white text-sm font-bold flex items-center gap-2"
            >
              <Plus size={16} strokeWidth={2.5} />
              Yangi yozuv
            </Link>
          </div>
        </div>

        {/* KPI region — hero (chap yarim, 2 row) + 2x2 metrikalar (o'ng yarim) */}
        <div className="grid grid-cols-12 gap-4 mb-4">
          <div className="col-span-6 row-span-2 flex flex-col gap-4">
            <KpiHeroCard />
            <div className="bg-surface rounded-2xl border border-border p-6 flex-1">
              <p className="text-xs text-mute font-bold uppercase tracking-wide mb-2">
                Oylik prognoz
              </p>
              <p className="text-2xl font-bold tabular-nums">
                ~ {formatCompact(monthlyProjection)} <span className="text-sm text-mute font-bold">so'm</span>
              </p>
              <p className="text-xs text-mute mt-2">30 kunlik o'rtacha asosida</p>
            </div>
          </div>

          <div className="col-span-3">
            <KpiCard
              label="Bugungi savdo"
              value={formatNumber(todaySales)}
              hint={`${todaySalesTx.length} ta operatsiya`}
              dotColor="blue"
            />
          </div>
          <div className="col-span-3">
            <KpiCard
              label="Bugungi xarajat"
              value={formatNumber(todayExpenses)}
              hint={`${todayTx.filter(t => t.type === 'expense').length} ta yozuv`}
              dotColor="ink"
            />
          </div>
          <div className="col-span-3">
            <KpiCard
              label="O'rtacha chek"
              value={formatNumber(avgTicket)}
              hint="bugungi savdo"
            />
          </div>
          <div className="col-span-3">
            <KpiCard
              label="Marjin"
              value={<>{margin}<span className="text-lg text-mute">%</span></>}
              hint="bugungi marjin"
            />
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
                <h2 className="text-lg font-bold">Bugungi yozuvlar</h2>
                <Link href="/transactions" className="text-xs text-blue font-bold">
                  Hammasi
                </Link>
              </div>
              <div className="space-y-4">
                {recentTx.length === 0 ? (
                  <p className="text-sm text-mute text-center py-4">
                    Bugun hali yozuv yo'q
                  </p>
                ) : (
                  recentTx.map(tx => (
                    <TransactionItem
                      key={tx.id}
                      transaction={tx}
                      allCategories={allCategories}
                      variant="desktop"
                    />
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
