'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { Plus, Minus, BarChart3, Download, Bell, Search, ListOrdered, Settings, Lightbulb } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { useKassaStore } from '@/store/useKassaStore'
import { useLang } from '@/hooks/useLang'
import { formatNumber, formatCompact } from '@/lib/formatCurrency'
import { filterByDay, sumByType, getProfit, daysAgo } from '@/lib/dateUtils'
import { exportToCsv } from '@/lib/exportCsv'
import { showToast } from '@/lib/toast'
import { WeeklyChart } from '@/components/home/WeeklyChart'
import { TransactionItem } from '@/components/home/TransactionItem'
import { LangSwitch } from '@/components/layout/LangSwitch'

const DONUT_COLORS = ['#0F1A0F', '#2DB550', '#5DC877', '#A8D5B5', '#DCE5DC']

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

  const today = new Date()
  const todayTx = filterByDay(transactions, today)
  const todaySales = sumByType(todayTx, 'sale')
  const todayExpenses = sumByType(todayTx, 'expense')
  const todayProfit = getProfit(todayTx)

  const yesterdayTx = filterByDay(transactions, daysAgo(1))
  const yesterdayProfit = getProfit(yesterdayTx)
  const delta = todayProfit - yesterdayProfit
  const deltaPercent = yesterdayProfit > 0
    ? Math.round((delta / yesterdayProfit) * 100 * 10) / 10
    : 0

  const todaySalesTx = todayTx.filter(t => t.type === 'sale')
  const expenseCount = todayTx.filter(t => t.type === 'expense').length
  const margin = todaySales > 0
    ? Math.round((todaySales - todayExpenses) / todaySales * 100 * 10) / 10
    : 0

  const recentTx = (todayTx.length > 0 ? todayTx : transactions).slice(0, 5)

  // Donut: oylik xarajat kategoriya bo'yicha
  const expenseChartData = useMemo(() => {
    const monthlyExp = transactions.filter(t => new Date(t.date) >= daysAgo(30) && t.type === 'expense')
    const total = monthlyExp.reduce((s, t) => s + t.amount, 0)
    return expenseCategories
      .map(cat => ({
        name: cat.label,
        value: monthlyExp.filter(t => t.category === cat.id).reduce((s, t) => s + t.amount, 0),
        pct: 0,
      }))
      .filter(c => c.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
      .map(c => ({ ...c, pct: total > 0 ? Math.round(c.value / total * 100) : 0 }))
  }, [transactions, expenseCategories])

  function handleExport() {
    if (transactions.length === 0) {
      showToast(tr.settings.noEntries, 'error')
      return
    }
    exportToCsv(transactions, allCategories)
    showToast(`✓ ${transactions.length} ${tr.settings.updated.exported}`)
  }

  const kpis = [
    { label: tr.home.todaySales, value: formatNumber(todaySales), delta: '+7.1%', positive: true, icon: '📈' },
    { label: tr.home.todayExpense, value: formatNumber(todayExpenses), delta: '+3.6%', positive: false, icon: '📉' },
    { label: tr.home.margin, value: margin + '%', delta: '+8.3%', positive: true, icon: '💹' },
  ]

  type QuickAction = { icon: typeof Plus; label: string; href?: string; onClick?: () => void }
  const desktopActions: QuickAction[] = [
    { icon: Plus, label: lang === 'uz' ? 'Savdo' : 'Продажа', href: '/transactions/new' },
    { icon: Minus, label: lang === 'uz' ? 'Xarajat' : 'Расход', href: '/transactions/new' },
    { icon: BarChart3, label: lang === 'uz' ? 'Hisobot' : 'Отчёт', href: '/reports' },
    { icon: Download, label: lang === 'uz' ? 'Eksport' : 'Экспорт', onClick: handleExport },
  ]
  const mobileActions: QuickAction[] = [
    { icon: Plus, label: lang === 'uz' ? 'Savdo' : 'Продажа', href: '/transactions/new' },
    { icon: BarChart3, label: lang === 'uz' ? 'Hisobot' : 'Отчёт', href: '/reports' },
    { icon: ListOrdered, label: lang === 'uz' ? 'Tarix' : 'История', href: '/transactions' },
    { icon: Settings, label: lang === 'uz' ? 'Sozlama' : 'Настройки', href: '/settings' },
  ]

  if (!mounted) return null

  return (
    <>
      {/* ───────── DESKTOP ───────── */}
      <main className="hidden lg:block px-8 py-7">
        {/* Welcome header */}
        <div className="flex items-start justify-between mb-7">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-dark flex items-center justify-center">
              <span className="text-green font-bold">AK</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold">
                {tr.home.greeting}, {settings.businessName.split(' ')[0]} 👋
              </h1>
              <p className="text-sm text-mute mt-0.5">
                {lang === 'uz' ? "Bugungi moliyaviy ko'rinish" : 'Ваш финансовый обзор на сегодня'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LangSwitch />
            <button className="w-9 h-9 rounded-xl bg-surface border border-border flex items-center justify-center hover:bg-subtle transition-colors" aria-label="Search">
              <Search size={16} className="text-mute" />
            </button>
            <button className="w-9 h-9 rounded-xl bg-surface border border-border flex items-center justify-center hover:bg-subtle transition-colors" aria-label="Notifications">
              <Bell size={16} className="text-mute" />
            </button>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-12 gap-5">
          {/* Hero — dark card */}
          <div className="col-span-5 card-dark p-6 flex flex-col justify-between min-h-[160px]">
            <div className="flex items-center justify-between">
              <p className="text-white/50 text-xs font-medium uppercase tracking-wider">{tr.home.todayProfit}</p>
              <span className="text-white/30">👁</span>
            </div>
            <div>
              <p className="text-white text-5xl font-light tabular-nums tracking-tight mt-4">
                {formatNumber(todayProfit)}
                <span className="text-2xl text-white/40 font-light ml-1">so'm</span>
              </p>
              {yesterdayProfit > 0 && (
                <div className="flex items-center gap-2 mt-4">
                  <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                    delta >= 0 ? 'bg-green/20 text-green' : 'bg-negative/20 text-negative'
                  }`}>
                    {delta >= 0 ? '↗' : '↘'} {Math.abs(deltaPercent)}%
                  </span>
                  <span className="text-white/30 text-xs">{tr.home.yesterday}</span>
                </div>
              )}
            </div>
          </div>

          {/* 3 KPI cards */}
          <div className="col-span-7 grid grid-cols-3 gap-5">
            {kpis.map(item => (
              <div key={item.label} className="card p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-mute font-medium">{item.label}</p>
                  <span>{item.icon}</span>
                </div>
                <div>
                  <p className="text-2xl font-semibold tabular-nums mt-3">{item.value}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs font-semibold ${item.positive ? 'text-positive' : 'text-negative'}`}>
                      {item.positive ? '↗' : '↘'} {item.delta}
                    </span>
                    <span className="text-xs text-mute">{lang === 'uz' ? 'kechagiga' : 'ко вчера'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Spending Overview — donut */}
          <div className="col-span-5 card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold">{lang === 'uz' ? 'Xarajat taqsimoti' : 'Распределение расходов'}</h2>
              <span className="text-xs text-mute bg-subtle px-3 py-1 rounded-full">{lang === 'uz' ? 'Bu oy' : 'Этот месяц'}</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-40 h-40 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={expenseChartData} cx="50%" cy="50%" innerRadius={44} outerRadius={70} paddingAngle={3} dataKey="value">
                      {expenseChartData.map((entry, index) => (
                        <Cell key={index} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => formatNumber(Number(v)) + " so'm"} contentStyle={{ borderRadius: 12, border: '1px solid #DCE5DC', fontSize: 13 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2.5">
                {expenseChartData.map((item, i) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: DONUT_COLORS[i] }} />
                      <span className="text-sm text-mute">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">{formatCompact(item.value)}</span>
                      <span className="text-xs text-mute w-8 text-right">{item.pct}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Insight */}
          <div className="col-span-4 card-dark p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb size={16} className="text-green" />
              <p className="text-sm font-semibold text-white">{lang === 'uz' ? 'AI Tahlil' : 'AI Анализ'}</p>
            </div>
            <p className="text-white/70 text-sm leading-relaxed flex-1">
              {lang === 'uz'
                ? `${settings.businessName} bu hafta mahsulot xarajatida 32% o'sish ko'rsatdi. Tavsiya: etkazib beruvchilarni ko'rib chiqing.`
                : `${settings.businessName} показал рост расходов на товары на 32% на этой неделе. Рекомендация: пересмотрите поставщиков.`}
            </p>
            <button className="mt-5 w-full py-2.5 rounded-lg bg-green text-white text-sm font-semibold hover:bg-green-dark transition-colors">
              {lang === 'uz' ? "Batafsil ko'rish" : 'Подробнее'}
            </button>
          </div>

          {/* Quick Actions */}
          <div className="col-span-3 card p-6">
            <h2 className="font-semibold mb-4">{lang === 'uz' ? 'Tezkor amallar' : 'Быстрые действия'}</h2>
            <div className="grid grid-cols-2 gap-3">
              {desktopActions.map(action => {
                const Icon = action.icon
                const inner = (
                  <>
                    <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center shadow-sm">
                      <Icon size={18} strokeWidth={1.5} className="text-ink" />
                    </div>
                    <span className="text-xs font-medium text-center leading-tight">{action.label}</span>
                  </>
                )
                const cls = 'flex flex-col items-center gap-2 p-3 rounded-xl bg-subtle hover:bg-border transition-colors'
                return action.onClick
                  ? <button key={action.label} onClick={action.onClick} className={cls}>{inner}</button>
                  : <Link key={action.label} href={action.href ?? '#'} className={cls}>{inner}</Link>
              })}
            </div>
          </div>

          {/* Chart */}
          <div className="col-span-8 card p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-semibold">{lang === 'uz' ? "Savdo ko'rinishi" : 'Обзор продаж'}</h2>
                <p className="text-xs text-mute mt-0.5">{lang === 'uz' ? "So'nggi 7 kun" : 'Последние 7 дней'}</p>
              </div>
              <span className="text-xs bg-subtle border border-border px-3 py-1.5 rounded-full font-medium">
                {tr.home.thisWeek} ↓
              </span>
            </div>
            <WeeklyChart />
          </div>

          {/* Recent transactions */}
          <div className="col-span-4 card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold">{tr.home.todayEntries}</h2>
              <Link href="/transactions" className="text-xs text-green font-semibold">{tr.home.all}</Link>
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
      </main>

      {/* ───────── MOBILE ───────── */}
      <main className="lg:hidden">
        {/* Top */}
        <div className="px-5 pt-6 pb-4">
          <div className="flex items-center justify-between mb-1">
            <div>
              <p className="text-xs text-mute">{tr.home.greeting}</p>
              <p className="font-semibold">{settings.businessName}</p>
            </div>
            <div className="flex items-center gap-2">
              <LangSwitch />
              <button className="w-9 h-9 rounded-xl bg-surface border border-border flex items-center justify-center" aria-label="Notifications">
                <Bell size={16} className="text-mute" />
              </button>
            </div>
          </div>
        </div>

        {/* Dark hero card */}
        <div className="mx-5 card-dark p-6 mb-4">
          <p className="text-white/50 text-xs uppercase tracking-wider mb-3">{tr.home.todayProfit}</p>
          <p className="text-white text-4xl font-light tabular-nums">{formatNumber(todayProfit)}</p>
          <p className="text-white/40 text-sm mt-1">so'm</p>
          {yesterdayProfit > 0 && (
            <span className={`inline-flex items-center gap-1 mt-3 text-xs font-semibold px-2.5 py-1 rounded-full ${
              delta >= 0 ? 'bg-green/20 text-green' : 'bg-negative/20 text-negative'
            }`}>
              {delta >= 0 ? '↗' : '↘'} {Math.abs(deltaPercent)}% {tr.home.yesterday}
            </span>
          )}
        </div>

        {/* 2 mini cards */}
        <div className="px-5 grid grid-cols-2 gap-3 mb-5">
          <div className="card p-4">
            <p className="text-xs text-mute mb-2">{tr.home.todaySales}</p>
            <p className="text-lg font-semibold tabular-nums">{formatCompact(todaySales)}</p>
            <p className="text-xs text-positive mt-1">↗ {todaySalesTx.length} {tr.home.operations}</p>
          </div>
          <div className="card p-4">
            <p className="text-xs text-mute mb-2">{tr.home.todayExpense}</p>
            <p className="text-lg font-semibold tabular-nums">{formatCompact(todayExpenses)}</p>
            <p className="text-xs text-negative mt-1">↘ {expenseCount} {tr.home.entries}</p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="px-5 mb-5">
          <div className="card p-4">
            <p className="text-xs font-medium text-mute mb-3">{lang === 'uz' ? 'Tezkor amallar' : 'Быстрые действия'}</p>
            <div className="grid grid-cols-4 gap-3">
              {mobileActions.map(a => {
                const Icon = a.icon
                return (
                  <Link key={a.href} href={a.href ?? '#'} className="flex flex-col items-center gap-1.5">
                    <div className="w-12 h-12 rounded-xl bg-subtle border border-border flex items-center justify-center">
                      <Icon size={18} strokeWidth={1.5} className="text-ink" />
                    </div>
                    <span className="text-xs text-mute text-center leading-tight">{a.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="px-5 mb-5">
          <div className="card p-5">
            <h2 className="font-semibold mb-4">{tr.home.thisWeek}</h2>
            <WeeklyChart />
          </div>
        </div>

        {/* Transactions */}
        <div className="px-5 mb-6">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">{tr.home.todayEntries}</h2>
              <Link href="/transactions" className="text-xs text-green font-semibold">{tr.home.all}</Link>
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
    </>
  )
}
