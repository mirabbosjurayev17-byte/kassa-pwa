'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Plus, Minus, BarChart3, Download, Bell, Search, Eye, EyeOff,
  TrendingUp, TrendingDown, ArrowUpRight, ArrowRight,
} from 'lucide-react'
import { useKassaStore } from '@/store/useKassaStore'
import { useLang } from '@/hooks/useLang'
import { formatNumber, formatCompact } from '@/lib/formatCurrency'
import { filterByDay, sumByType, getProfit, daysAgo } from '@/lib/dateUtils'
import { exportToCsv } from '@/lib/exportCsv'
import { showToast } from '@/lib/toast'
import { SalesTrendChart } from '@/components/home/SalesTrendChart'
import { ExpenseDonut } from '@/components/home/ExpenseDonut'
import { PaymentSplit } from '@/components/home/PaymentSplit'
import { TransactionItem } from '@/components/home/TransactionItem'
import { LangSwitch } from '@/components/layout/LangSwitch'
import { SearchModal } from '@/components/SearchModal'
import { NotifPanel } from '@/components/NotifPanel'
import { ScreenSkeleton } from '@/components/system/Skeleton'

function pct(cur: number, prev: number): number {
  if (prev <= 0) return 0
  return Math.round(((cur - prev) / prev) * 1000) / 10
}

function Delta({ value, bright = false }: { value: number; bright?: boolean }) {
  const up = value >= 0
  const Icon = up ? TrendingUp : TrendingDown
  const color = up
    ? bright ? 'text-green-bright' : 'text-positive'
    : 'text-negative'
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${color}`}>
      <Icon size={13} strokeWidth={2.2} />
      {Math.abs(value)}%
    </span>
  )
}

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [hideBalance, setHideBalance] = useState(false)
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

  const ownerInitials = settings.ownerName
    .split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()

  const today = new Date()
  const dateLabel = today.toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'uz-UZ', {
    day: 'numeric', month: 'long',
  })

  const todayTx = filterByDay(transactions, today)
  const todaySales = sumByType(todayTx, 'sale')
  const todayExpenses = sumByType(todayTx, 'expense')
  const todayProfit = getProfit(todayTx)

  const ydayTx = filterByDay(transactions, daysAgo(1))
  const ydaySales = sumByType(ydayTx, 'sale')
  const ydayExpenses = sumByType(ydayTx, 'expense')
  const ydayProfit = getProfit(ydayTx)

  const profitDelta = pct(todayProfit, ydayProfit)
  const salesDelta = pct(todaySales, ydaySales)
  const expenseDelta = pct(todayExpenses, ydayExpenses)

  const margin = todaySales > 0 ? Math.round(((todaySales - todayExpenses) / todaySales) * 1000) / 10 : 0
  const ydayMargin = ydaySales > 0 ? ((ydaySales - ydayExpenses) / ydaySales) * 100 : 0
  const marginDelta = ydayMargin > 0 ? Math.round((margin - ydayMargin) * 10) / 10 : 0

  const salesCount = todayTx.filter(t => t.type === 'sale').length
  const expenseCount = todayTx.filter(t => t.type === 'expense').length

  const recentTx = (todayTx.length > 0 ? todayTx : transactions).slice(0, 5)

  const aiInsight = useMemo(() => {
    const thisWeek = transactions.filter(t => new Date(t.date) >= daysAgo(7) && t.type === 'expense')
    const prevWeek = transactions.filter(t => {
      const d = new Date(t.date)
      return d >= daysAgo(14) && d < daysAgo(7) && t.type === 'expense'
    })
    const byCat = (txs: typeof transactions, id: string) =>
      txs.filter(t => t.category === id).reduce((s, t) => s + t.amount, 0)
    let worst = { label: '', growth: 0 }
    for (const cat of expenseCategories) {
      const cur = byCat(thisWeek, cat.id)
      const prev = byCat(prevWeek, cat.id)
      if (prev > 0) {
        const g = Math.round(((cur - prev) / prev) * 100)
        if (g > worst.growth) worst = { label: cat.label, growth: g }
      }
    }
    return worst.growth > 15 ? worst : null
  }, [transactions, expenseCategories])

  function handleExport() {
    if (transactions.length === 0) {
      showToast(tr.settings.noEntries, 'error')
      return
    }
    exportToCsv(transactions, allCategories)
    showToast(`${transactions.length} ${tr.settings.updated.exported}`)
  }

  type QuickAction = { icon: typeof Plus; label: string; href?: string; onClick?: () => void; accent?: boolean }
  const actions: QuickAction[] = [
    { icon: Plus, label: lang === 'uz' ? 'Savdo' : 'Продажа', href: '/transactions/new', accent: true },
    { icon: Minus, label: lang === 'uz' ? 'Xarajat' : 'Расход', href: '/transactions/new' },
    { icon: BarChart3, label: lang === 'uz' ? 'Hisobot' : 'Отчёт', href: '/reports' },
    { icon: Download, label: lang === 'uz' ? 'Eksport' : 'Экспорт', onClick: handleExport },
  ]

  const kpis = [
    { label: tr.home.todaySales, value: todaySales, delta: salesDelta, sub: `${salesCount} ${tr.home.operations}` },
    { label: tr.home.todayExpense, value: todayExpenses, delta: expenseDelta, sub: `${expenseCount} ${tr.home.entries}`, invert: true },
    { label: tr.home.margin, value: margin, delta: marginDelta, isPercent: true },
  ]

  if (!mounted) return <ScreenSkeleton />

  const greeting = (
    <div className="flex items-center gap-3">
      <div className="w-11 h-11 rounded-full bg-dark flex items-center justify-center flex-shrink-0">
        <span className="text-green-bright text-sm font-semibold">{ownerInitials}</span>
      </div>
      <div className="min-w-0">
        <p className="text-sm text-mute">{tr.home.greeting},</p>
        <p className="font-semibold truncate">{settings.ownerName}</p>
      </div>
    </div>
  )

  const headerActions = (
    <div className="flex items-center gap-2">
      <LangSwitch />
      <button
        onClick={() => setSearchOpen(true)}
        className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center hover:bg-subtle transition-colors"
        aria-label="Search"
      >
        <Search size={17} className="text-ink" />
      </button>
      <div className="relative">
        <button
          onClick={() => setNotifOpen(o => !o)}
          className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center hover:bg-subtle transition-colors relative"
          aria-label="Notifications"
        >
          <Bell size={17} className="text-ink" />
          <span className="absolute top-2 right-2.5 w-1.5 h-1.5 rounded-full bg-green-bright" />
        </button>
        {notifOpen && <NotifPanel onClose={() => setNotifOpen(false)} />}
      </div>
    </div>
  )

  // ── Hero "card" ──
  const heroCard = (
    <div className="relative card-dark rounded-3xl p-6 overflow-hidden">
      <div className="absolute inset-0 card-dark-sheen pointer-events-none" />
      <div className="relative">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white font-medium">{settings.businessName}</p>
            <p className="text-white/65 text-xs mt-0.5">{settings.location} · {dateLabel}</p>
          </div>
          <svg width="26" height="26" viewBox="0 0 512 512" fill="none" className="opacity-90">
            <g stroke="#00DF81" strokeWidth="50" strokeLinecap="round" strokeLinejoin="round">
              <path d="M190 150 V362" /><path d="M190 258 L332 150" /><path d="M190 258 L336 362" />
            </g>
          </svg>
        </div>

        <div className="mt-7">
          <div className="flex items-center gap-2">
            <p className="text-white/70 text-xs uppercase tracking-wider">{tr.home.todayProfit}</p>
            <button onClick={() => setHideBalance(h => !h)} className="text-white/40 hover:text-white/70 transition-colors" aria-label="toggle">
              {hideBalance ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          <p className="text-white text-4xl lg:text-[2.75rem] font-semibold tabular-nums tracking-tight mt-2 leading-none">
            {hideBalance ? '• • • • • •' : formatNumber(todayProfit)}
            {!hideBalance && <span className="text-xl text-white/55 font-normal ml-2">so'm</span>}
          </p>
          {ydayProfit > 0 && (
            <div className="flex items-center gap-2 mt-4">
              <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                profitDelta >= 0 ? 'bg-green-bright/15 text-green-bright' : 'bg-negative/20 text-negative'
              }`}>
                {profitDelta >= 0 ? <ArrowUpRight size={13} /> : <TrendingDown size={13} />}
                {Math.abs(profitDelta)}%
              </span>
              <span className="text-white/55 text-xs">{tr.home.yesterday}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const quickActions = (
    <div className="grid grid-cols-4 gap-2.5">
      {actions.map(a => {
        const Icon = a.icon
        const inner = (
          <>
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
              a.accent ? 'bg-green-bright' : 'bg-subtle'
            }`}>
              <Icon size={19} strokeWidth={2} className={a.accent ? 'text-ink' : 'text-ink'} />
            </div>
            <span className="text-xs font-medium text-center leading-tight">{a.label}</span>
          </>
        )
        const cls = 'flex flex-col items-center gap-2 p-3 rounded-2xl bg-surface border border-border hover:bg-subtle transition-colors'
        return a.onClick
          ? <button key={a.label} onClick={a.onClick} className={cls}>{inner}</button>
          : <Link key={a.label} href={a.href ?? '#'} className={cls}>{inner}</Link>
      })}
    </div>
  )

  const kpiCards = (
    <div className="grid grid-cols-3 gap-2.5 lg:gap-4">
      {kpis.map(k => (
        <div key={k.label} className="card p-4 lg:p-5">
          <p className="text-xs text-mute truncate">{k.label}</p>
          <p className="text-lg lg:text-2xl font-semibold tabular-nums mt-2 leading-none">
            {k.isPercent ? `${k.value}%` : formatCompact(k.value)}
          </p>
          <div className="mt-2">
            {k.delta !== 0
              ? <Delta value={k.invert ? -k.delta : k.delta} />
              : <span className="text-xs text-mute">{k.sub ?? '—'}</span>}
          </div>
        </div>
      ))}
    </div>
  )

  const recentList = (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">{tr.home.todayEntries}</h2>
        <Link href="/transactions" className="text-xs text-green font-medium inline-flex items-center gap-1 hover:gap-1.5 transition-all">
          {tr.home.all} <ArrowRight size={13} />
        </Link>
      </div>
      {recentTx.length === 0 ? (
        <p className="text-sm text-mute text-center py-6">{tr.home.noEntriesToday}</p>
      ) : (
        <div className="space-y-1">
          {recentTx.map(tx => (
            <div key={tx.id} className="py-2.5 border-b border-border last:border-0">
              <TransactionItem transaction={tx} allCategories={allCategories} variant="mobile" />
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const aiCard = (
    <div className="relative card-dark rounded-3xl p-5 overflow-hidden">
      <div className="absolute inset-0 card-dark-sheen pointer-events-none" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-full bg-green-bright flex items-center justify-center">
            <TrendingUp size={14} className="text-ink" strokeWidth={2.4} />
          </div>
          <p className="text-sm font-medium text-white">{lang === 'uz' ? 'AI tahlil' : 'AI анализ'}</p>
        </div>
        <p className="text-white/70 text-sm leading-relaxed">
          {aiInsight
            ? (lang === 'uz'
                ? `"${aiInsight.label}" xarajati shu hafta ${aiInsight.growth}% oshdi. Taʼminotchi yoki narxlarni qayta koʻrib chiqing.`
                : `Расходы «${aiInsight.label}» выросли на ${aiInsight.growth}% за неделю. Проверьте поставщика или цены.`)
            : (lang === 'uz'
                ? 'Xarajatlaringiz barqaror. Ortib borayotgan kategoriya aniqlanmadi.'
                : 'Ваши расходы стабильны. Резкого роста по категориям нет.')}
        </p>
        <Link href="/reports" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-green-bright">
          {lang === 'uz' ? 'Batafsil' : 'Подробнее'} <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )

  return (
    <>
      {/* ───────── MOBILE ───────── */}
      <main className="lg:hidden px-5 pt-6 space-y-5 max-w-xl mx-auto">
        <div className="flex items-center justify-between">{greeting}{headerActions}</div>
        {heroCard}
        {quickActions}
        {kpiCards}

        <div className="card p-5">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-semibold">{lang === 'uz' ? 'Savdo dinamikasi' : 'Динамика продаж'}</h2>
            <span className="text-xs text-mute bg-subtle px-2.5 py-1 rounded-full">{lang === 'uz' ? '7 kun' : '7 дней'}</span>
          </div>
          <SalesTrendChart height={180} />
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">{lang === 'uz' ? 'Xarajat taqsimoti' : 'Распределение расходов'}</h2>
            <span className="text-xs text-mute bg-subtle px-2.5 py-1 rounded-full">{lang === 'uz' ? 'Bu oy' : 'Этот месяц'}</span>
          </div>
          <ExpenseDonut />
        </div>

        <div className="card p-5">
          <h2 className="font-semibold mb-4">{lang === 'uz' ? "To'lov usullari" : 'Способы оплаты'}</h2>
          <PaymentSplit />
        </div>

        {aiCard}
        {recentList}
      </main>

      {/* ───────── DESKTOP ───────── */}
      <main className="hidden lg:block px-10 py-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-7">{greeting}{headerActions}</div>

        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-5 flex flex-col gap-5">
            {heroCard}
            {quickActions}
          </div>
          <div className="col-span-7 flex flex-col gap-5">
            {kpiCards}
            {aiCard}
          </div>

          <div className="col-span-8 card p-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="font-semibold">{lang === 'uz' ? 'Savdo dinamikasi' : 'Динамика продаж'}</h2>
                <p className="text-xs text-mute mt-0.5">{lang === 'uz' ? "So'nggi 7 kun" : 'Последние 7 дней'}</p>
              </div>
              <span className="text-xs text-mute bg-subtle px-3 py-1.5 rounded-full">{lang === 'uz' ? '7 kun' : '7 дней'}</span>
            </div>
            <SalesTrendChart height={260} />
          </div>

          <div className="col-span-4 card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold">{lang === 'uz' ? 'Xarajat taqsimoti' : 'Расходы'}</h2>
              <span className="text-xs text-mute bg-subtle px-3 py-1 rounded-full">{lang === 'uz' ? 'Bu oy' : 'Месяц'}</span>
            </div>
            <ExpenseDonut />
          </div>

          <div className="col-span-4 card p-6">
            <h2 className="font-semibold mb-5">{lang === 'uz' ? "To'lov usullari" : 'Способы оплаты'}</h2>
            <PaymentSplit />
          </div>

          <div className="col-span-8 card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">{tr.home.todayEntries}</h2>
              <Link href="/transactions" className="text-xs text-green font-medium inline-flex items-center gap-1 hover:gap-1.5 transition-all">
                {tr.home.all} <ArrowRight size={13} />
              </Link>
            </div>
            {recentTx.length === 0 ? (
              <p className="text-sm text-mute text-center py-8">{tr.home.noEntriesToday}</p>
            ) : (
              <div className="space-y-1">
                {recentTx.map(tx => (
                  <div key={tx.id} className="py-3 border-b border-border last:border-0">
                    <TransactionItem transaction={tx} allCategories={allCategories} variant="desktop" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </>
  )
}
