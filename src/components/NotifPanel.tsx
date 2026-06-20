'use client'

import { useEffect, useRef } from 'react'
import { Bell, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'
import { useKassaStore } from '@/store/useKassaStore'
import { formatNumber } from '@/lib/formatCurrency'
import { getProfit, sumByType, filterByDay, daysAgo } from '@/lib/dateUtils'
import { useLang } from '@/hooks/useLang'

type Notif = {
  icon: typeof Bell
  color: string
  bg: string
  title: string
  body: string
  time: string
}

export function NotifPanel({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const transactions = useKassaStore(s => s.transactions)
  const { lang } = useLang()

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  const today = filterByDay(transactions, new Date())
  const yesterday = filterByDay(transactions, daysAgo(1))
  const todayProfit = getProfit(today)
  const yesterdayProfit = getProfit(yesterday)
  const delta = yesterdayProfit > 0
    ? Math.round((todayProfit - yesterdayProfit) / yesterdayProfit * 100)
    : 0
  const todayExpenses = sumByType(today, 'expense')
  const todaySales = sumByType(today, 'sale')

  const rawNotifs: (Notif | null)[] = [
    {
      icon: delta >= 0 ? TrendingUp : TrendingDown,
      color: delta >= 0 ? 'text-positive' : 'text-negative',
      bg: delta >= 0 ? 'bg-green-pale' : 'bg-red-50',
      title: lang === 'uz'
        ? `Bugungi foyda: ${formatNumber(todayProfit)} so'm`
        : `Прибыль сегодня: ${formatNumber(todayProfit)} сум`,
      body: lang === 'uz'
        ? `Kechagiga nisbatan ${delta > 0 ? '+' : ''}${delta}%`
        : `По сравнению со вчера ${delta > 0 ? '+' : ''}${delta}%`,
      time: lang === 'uz' ? 'Hozir' : 'Сейчас',
    },
    todayExpenses > todaySales ? {
      icon: AlertCircle,
      color: 'text-negative',
      bg: 'bg-red-50',
      title: lang === 'uz' ? 'Xarajat savdodan oshib ketdi' : 'Расходы превысили продажи',
      body: lang === 'uz'
        ? `Xarajat: ${formatNumber(todayExpenses)} so'm`
        : `Расходы: ${formatNumber(todayExpenses)} сум`,
      time: lang === 'uz' ? 'Bugun' : 'Сегодня',
    } : null,
    {
      icon: Bell,
      color: 'text-mute',
      bg: 'bg-subtle',
      title: lang === 'uz' ? 'Kunlik hisobot tayyor' : 'Ежедневный отчёт готов',
      body: lang === 'uz'
        ? `${today.length} ta yozuv kiritildi`
        : `Добавлено ${today.length} записей`,
      time: lang === 'uz' ? 'Bugun' : 'Сегодня',
    },
  ]
  const notifs = rawNotifs.filter((n): n is Notif => n !== null)

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 bg-surface border border-border rounded-xl shadow-xl z-50 w-80 overflow-hidden"
    >
      <div className="px-4 py-3.5 border-b border-border flex items-center justify-between">
        <p className="font-semibold text-sm">
          {lang === 'uz' ? 'Bildirishnomalar' : 'Уведомления'}
        </p>
        <span className="text-xs text-mute">{notifs.length} ta</span>
      </div>
      <div className="divide-y divide-border">
        {notifs.map((n, i) => {
          const Icon = n.icon
          return (
            <div key={i} className="flex items-start gap-3 px-4 py-3.5 hover:bg-subtle transition-colors">
              <div className={`w-9 h-9 rounded-xl ${n.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                <Icon size={16} className={n.color} strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-snug">{n.title}</p>
                <p className="text-xs text-mute mt-0.5">{n.body}</p>
              </div>
              <p className="text-xs text-mute flex-shrink-0">{n.time}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
