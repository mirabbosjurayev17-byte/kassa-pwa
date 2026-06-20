import { ArrowDown, ArrowUp } from 'lucide-react'
import type { Transaction, Category } from '@/types'
import { formatCompact, formatNumber } from '@/lib/formatCurrency'
import { getCategoryLabel } from '@/lib/categories'

type Props = {
  transaction: Transaction
  allCategories: Category[]
  variant?: 'mobile' | 'desktop'
}

export function TransactionItem({ transaction, allCategories, variant = 'mobile' }: Props) {
  const isSale = transaction.type === 'sale'
  const d = new Date(transaction.date)
  const dateLabel = d.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' })
  const time = d.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })

  const categoryLabel = getCategoryLabel(transaction.category, allCategories)

  return (
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
        isSale ? 'bg-green-pale' : 'bg-red-50'
      }`}>
        {isSale ? (
          <ArrowUp size={16} strokeWidth={2} className="text-green-dark" />
        ) : (
          <ArrowDown size={16} strokeWidth={2} className="text-negative" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{categoryLabel}</p>
        <p className="text-xs text-mute">{dateLabel}, {time}</p>
      </div>
      <p className={`font-semibold tabular-nums text-sm ${isSale ? 'text-positive' : 'text-negative'}`}>
        {isSale ? '+' : '−'}{variant === 'mobile' ? formatNumber(transaction.amount) : formatCompact(Math.abs(transaction.amount), false)}
      </p>
    </div>
  )
}
