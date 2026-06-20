'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { useKassaStore } from '@/store/useKassaStore'
import { formatNumber } from '@/lib/formatCurrency'
import Link from 'next/link'

export function SearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')
  const transactions = useKassaStore(s => s.transactions)
  const saleCategories = useKassaStore(s => s.saleCategories)
  const expenseCategories = useKassaStore(s => s.expenseCategories)
  const allCategories = [...saleCategories, ...expenseCategories]
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const results = query.trim().length < 1 ? [] : transactions
    .filter(tx => {
      const cat = allCategories.find(c => c.id === tx.category)?.label ?? ''
      const note = tx.note ?? ''
      const amount = formatNumber(tx.amount)
      return (
        cat.toLowerCase().includes(query.toLowerCase()) ||
        note.toLowerCase().includes(query.toLowerCase()) ||
        amount.includes(query)
      )
    })
    .slice(0, 8)

  return (
    <div
      className="fixed inset-0 bg-ink/20 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-xl border border-border shadow-xl w-full max-w-lg overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
          <Search size={18} className="text-mute flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Kategoriya, izoh yoki summa..."
            className="flex-1 text-sm outline-none bg-transparent"
          />
          <button onClick={onClose}>
            <X size={16} className="text-mute hover:text-ink transition-colors" />
          </button>
        </div>

        {/* Results */}
        {results.length > 0 ? (
          <div className="divide-y divide-border max-h-80 overflow-y-auto">
            {results.map(tx => {
              const cat = allCategories.find(c => c.id === tx.category)?.label ?? tx.category
              const date = new Date(tx.date)
              const isSale = tx.type === 'sale'
              return (
                <Link
                  key={tx.id}
                  href="/transactions"
                  onClick={onClose}
                  className="flex items-center justify-between px-4 py-3 hover:bg-subtle transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium">{cat}</p>
                    <p className="text-xs text-mute mt-0.5">
                      {date.toLocaleDateString('uz-UZ')} · {date.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <p className={`text-sm font-semibold tabular-nums ${isSale ? 'text-positive' : 'text-negative'}`}>
                    {isSale ? '+' : '−'}{formatNumber(tx.amount)}
                  </p>
                </Link>
              )
            })}
          </div>
        ) : query.trim().length > 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-mute">Natija topilmadi</p>
          </div>
        ) : (
          <div className="px-4 py-6">
            <p className="text-xs text-mute font-medium uppercase tracking-wide mb-3">So&apos;nggi yozuvlar</p>
            {transactions.slice(0, 4).map(tx => {
              const cat = allCategories.find(c => c.id === tx.category)?.label ?? tx.category
              const isSale = tx.type === 'sale'
              return (
                <div key={tx.id} className="flex items-center justify-between py-2">
                  <p className="text-sm text-mute">{cat}</p>
                  <p className={`text-sm font-medium tabular-nums ${isSale ? 'text-positive' : 'text-negative'}`}>
                    {isSale ? '+' : '−'}{formatNumber(tx.amount)}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
