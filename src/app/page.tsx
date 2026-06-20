'use client'

import { useEffect, useState } from 'react'
import { useKassaStore } from '@/store/useKassaStore'
import { formatNumber } from '@/lib/formatCurrency'

export default function Home() {
  // Hydration guard: zustand persist localStorage'dan sync rehydrate qiladi.
  // Server bo'sh state render qiladi, shuning uchun birinchi client render ham
  // bo'sh bo'lishi shart (mounted=false -> null), aks holda refresh'dan keyin
  // hydration mismatch xatosi chiqadi. Step 4'da skeleton bilan almashtiramiz.
  const [mounted, setMounted] = useState(false)
  const { transactions, settings, seedDemo } = useKassaStore()

  useEffect(() => {
    setMounted(true)
    seedDemo()
  }, [seedDemo])

  if (!mounted) return null

  // Bugungi tranzaksiyalar
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayTx = transactions.filter(t => new Date(t.date) >= today)

  const todaySales = todayTx.filter(t => t.type === 'sale').reduce((s, t) => s + t.amount, 0)
  const todayExpenses = todayTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const todayProfit = todaySales - todayExpenses

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <p className="text-xs uppercase tracking-wide text-mute font-bold mb-2">
          {settings.businessName} · Bugungi sof foyda
        </p>
        <p className="text-6xl font-black tabular-nums text-ink">
          {formatNumber(todayProfit)}
        </p>
        <p className="text-sm text-mute mt-2">so'm</p>

        <div className="mt-8 pt-6 border-t border-border grid grid-cols-2 gap-4 text-left">
          <div>
            <p className="text-xs text-mute font-medium">Savdo</p>
            <p className="text-lg font-bold tabular-nums">{formatNumber(todaySales)}</p>
          </div>
          <div>
            <p className="text-xs text-mute font-medium">Xarajat</p>
            <p className="text-lg font-bold tabular-nums">{formatNumber(todayExpenses)}</p>
          </div>
        </div>

        <p className="text-xs text-mute mt-8">
          Jami yozuvlar: {transactions.length} · Bugun: {todayTx.length}
        </p>
      </div>
    </main>
  )
}
