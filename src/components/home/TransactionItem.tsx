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
  const time = new Date(transaction.date).toLocaleTimeString('uz-UZ', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const categoryLabel = getCategoryLabel(transaction.category, allCategories)

  return (
    <div className="flex items-center gap-3">
      <div className={`w-9 h-9 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
        isSale ? 'bg-blue-pale' : 'bg-subtle'
      }`}>
        {isSale ? (
          <ArrowUp size={16} strokeWidth={2.5} className="text-blue-dark" />
        ) : (
          <ArrowDown size={16} strokeWidth={2.5} className="text-ink" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm truncate">{categoryLabel}</p>
        <p className="text-xs text-mute">
          {time}
          {transaction.note && ` · ${transaction.note}`}
        </p>
      </div>
      <p className="font-bold tabular-nums text-sm">
        {isSale ? '+' : '−'}{variant === 'mobile' ? formatNumber(transaction.amount) : formatCompact(Math.abs(transaction.amount), false)}
      </p>
    </div>
  )
}
