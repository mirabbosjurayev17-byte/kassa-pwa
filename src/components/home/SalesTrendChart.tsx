'use client'

import { useMemo } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { useKassaStore } from '@/store/useKassaStore'
import { useLang } from '@/hooks/useLang'
import { filterByDay, sumByType, daysAgo, isSameDay } from '@/lib/dateUtils'
import { formatNumber, formatCompact } from '@/lib/formatCurrency'

export function SalesTrendChart({ height = 200 }: { height?: number }) {
  const { tr, lang } = useLang()
  const transactions = useKassaStore(s => s.transactions)

  const data = useMemo(() => {
    const today = new Date()
    return Array.from({ length: 7 }, (_, i) => {
      const day = daysAgo(6 - i)
      const tx = filterByDay(transactions, day)
      return {
        label: isSameDay(day, today) ? tr.home.today : tr.home.dayLabels[day.getDay()],
        savdo: sumByType(tx, 'sale'),
        date: day.toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'uz-UZ', { day: 'numeric', month: 'short' }),
      }
    })
  }, [transactions, tr, lang])

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 6, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00DF81" stopOpacity={0.28} />
              <stop offset="100%" stopColor="#00DF81" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#DBE7E1" vertical={false} />
          <XAxis dataKey="label" stroke="#5E726B" fontSize={11} tickLine={false} axisLine={false} dy={6} />
          <YAxis
            stroke="#5E726B" fontSize={11} tickLine={false} axisLine={false} width={40}
            tickFormatter={v => formatCompact(Number(v))}
          />
          <Tooltip
            cursor={{ stroke: '#03624C', strokeWidth: 1, strokeDasharray: '4 4' }}
            formatter={(v) => [formatNumber(Number(v)) + " so'm", tr.home.sales]}
            labelFormatter={(_, p) => p?.[0]?.payload?.date ?? ''}
            contentStyle={{ borderRadius: 14, border: '1px solid #DBE7E1', fontSize: 12, fontWeight: 500, padding: '8px 12px', boxShadow: '0 8px 24px -8px rgba(2,27,26,0.18)' }}
          />
          <Area
            type="monotone" dataKey="savdo" stroke="#03624C" strokeWidth={2.5}
            fill="url(#salesFill)"
            dot={{ r: 3, fill: '#FFFFFF', stroke: '#03624C', strokeWidth: 2 }}
            activeDot={{ r: 5, fill: '#00DF81', stroke: '#FFFFFF', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
