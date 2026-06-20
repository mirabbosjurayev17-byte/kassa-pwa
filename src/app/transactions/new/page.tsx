'use client'

import { useState } from 'react'
import { useKassaStore } from '@/store/useKassaStore'
import { formatNumber } from '@/lib/formatCurrency'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewTransactionPage() {
  const saleCategories = useKassaStore(s => s.saleCategories)
  const expenseCategories = useKassaStore(s => s.expenseCategories)

  const [type, setType] = useState<'sale' | 'expense'>('sale')
  const [amount, setAmount] = useState<number>(0)
  const [category, setCategory] = useState<string>(saleCategories[0]?.id ?? '')
  const [note, setNote] = useState('')

  const categories = type === 'sale' ? saleCategories : expenseCategories

  return (
    <main className="px-5 lg:px-10 py-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/" className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-3xl font-black tracking-tight">Yangi yozuv</h1>
      </div>

      <div className="space-y-6">
        {/* Type toggle */}
        <div>
          <p className="text-xs uppercase tracking-wide text-mute font-bold mb-2">Turi</p>
          <div className="grid grid-cols-2 gap-2 p-1 bg-subtle rounded-xl">
            <button
              onClick={() => { setType('sale'); setCategory(saleCategories[0]?.id ?? '') }}
              className={`py-3 rounded-lg text-sm font-bold transition-colors ${
                type === 'sale' ? 'bg-blue text-white' : 'text-mute'
              }`}
            >
              Savdo
            </button>
            <button
              onClick={() => { setType('expense'); setCategory(expenseCategories[0]?.id ?? '') }}
              className={`py-3 rounded-lg text-sm font-bold transition-colors ${
                type === 'expense' ? 'bg-ink text-white' : 'text-mute'
              }`}
            >
              Xarajat
            </button>
          </div>
        </div>

        {/* Amount */}
        <div>
          <p className="text-xs uppercase tracking-wide text-mute font-bold mb-2">Summa</p>
          <div className="bg-surface rounded-2xl border border-border p-6">
            <input
              type="number"
              value={amount || ''}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="0"
              className="w-full text-4xl font-black tabular-nums text-ink bg-transparent outline-none placeholder:text-border"
            />
            <p className="text-sm text-mute mt-1">so'm</p>
          </div>
          <div className="flex items-center gap-2 mt-3 overflow-x-auto">
            {[10_000, 50_000, 100_000, 500_000, 1_000_000].map(v => (
              <button
                key={v}
                onClick={() => setAmount(amount + v)}
                className="px-3 py-1.5 text-xs font-bold bg-surface border border-border rounded-lg flex-shrink-0 hover:bg-subtle transition-colors"
              >
                +{formatNumber(v)}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div>
          <p className="text-xs uppercase tracking-wide text-mute font-bold mb-2">Kategoriya</p>
          <div className="flex flex-wrap gap-2">
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                  category === c.id
                    ? 'bg-ink text-white'
                    : 'bg-surface border border-border text-ink hover:bg-subtle'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div>
          <p className="text-xs uppercase tracking-wide text-mute font-bold mb-2">Izoh (ixtiyoriy)</p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Masalan: Ahmadjonov o'rtoqdan"
            rows={3}
            className="w-full bg-surface border border-border rounded-xl p-4 text-sm outline-none focus:border-blue resize-none"
          />
        </div>

        {/* Submit */}
        <button
          disabled={amount === 0}
          className="w-full bg-ink text-white rounded-xl py-4 font-bold text-base disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Saqlash
        </button>
      </div>
    </main>
  )
}
