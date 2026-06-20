'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useKassaStore } from '@/store/useKassaStore'
import { useLang } from '@/hooks/useLang'
import { formatNumber } from '@/lib/formatCurrency'
import { showToast } from '@/lib/toast'

export default function NewTransactionPage() {
  const router = useRouter()
  const { tr } = useLang()
  const saleCategories = useKassaStore(s => s.saleCategories)
  const expenseCategories = useKassaStore(s => s.expenseCategories)
  const addTransaction = useKassaStore(s => s.addTransaction)

  const [type, setType] = useState<'sale' | 'expense'>('sale')
  const [amount, setAmount] = useState<number>(0)
  const [category, setCategory] = useState<string>(saleCategories[0]?.id ?? '')
  const [note, setNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories = type === 'sale' ? saleCategories : expenseCategories

  function handleTypeChange(newType: 'sale' | 'expense') {
    setType(newType)
    setCategory(newType === 'sale' ? saleCategories[0]?.id ?? '' : expenseCategories[0]?.id ?? '')
  }

  function handleAmountInput(raw: string) {
    const num = parseInt(raw.replace(/\D/g, ''), 10)
    setAmount(isNaN(num) ? 0 : num)
  }

  function addQuickAmount(v: number) {
    setAmount(prev => prev + v)
  }

  async function handleSubmit() {
    if (amount <= 0) {
      showToast(tr.newTx.enterAmount, 'error')
      return
    }
    if (!category) {
      showToast(tr.newTx.selectCategory, 'error')
      return
    }

    setIsSubmitting(true)

    addTransaction({
      type,
      amount,
      category,
      note: note.trim() || undefined,
      date: new Date().toISOString(),
    })

    showToast(type === 'sale' ? tr.newTx.saved_sale : tr.newTx.saved_expense)

    await new Promise(r => setTimeout(r, 300))
    router.push('/')
  }

  return (
    <main className="px-5 lg:px-10 py-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/"
          className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center hover:bg-subtle transition-colors"
        >
          <ArrowLeft size={18} strokeWidth={2} />
        </Link>
        <h1 className="text-3xl font-black tracking-tight">{tr.newTx.title}</h1>
      </div>

      <div className="space-y-6">
        {/* Type toggle */}
        <div>
          <p className="text-xs uppercase tracking-wide text-mute font-bold mb-2">{tr.newTx.type}</p>
          <div className="grid grid-cols-2 gap-2 p-1 bg-subtle rounded-xl">
            <button
              onClick={() => handleTypeChange('sale')}
              className={`py-3 rounded-lg text-sm font-bold transition-colors ${
                type === 'sale' ? 'bg-green text-white' : 'text-mute'
              }`}
            >
              {tr.newTx.sale}
            </button>
            <button
              onClick={() => handleTypeChange('expense')}
              className={`py-3 rounded-lg text-sm font-bold transition-colors ${
                type === 'expense' ? 'bg-ink text-white' : 'text-mute'
              }`}
            >
              {tr.newTx.expense}
            </button>
          </div>
        </div>

        {/* Amount */}
        <div>
          <p className="text-xs uppercase tracking-wide text-mute font-bold mb-2">{tr.newTx.amount}</p>
          <div className="bg-surface rounded-2xl border border-border p-6">
            <input
              type="number"
              inputMode="numeric"
              value={amount || ''}
              onChange={e => handleAmountInput(e.target.value)}
              placeholder="0"
              className="w-full text-4xl font-black tabular-nums text-ink bg-transparent outline-none placeholder:text-border"
            />
            <p className="text-sm text-mute mt-2">
              {amount > 0 ? formatNumber(amount) + " so'm" : "so'm"}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
            {[10_000, 50_000, 100_000, 500_000, 1_000_000].map(v => (
              <button
                key={v}
                onClick={() => addQuickAmount(v)}
                className="px-3 py-1.5 text-xs font-bold bg-surface border border-border rounded-lg flex-shrink-0 hover:bg-subtle transition-colors"
              >
                +{formatNumber(v)}
              </button>
            ))}
            {amount > 0 && (
              <button
                onClick={() => setAmount(0)}
                className="px-3 py-1.5 text-xs font-bold bg-surface border border-border rounded-lg flex-shrink-0 text-mute hover:bg-subtle transition-colors"
              >
                {tr.newTx.clear}
              </button>
            )}
          </div>
        </div>

        {/* Category */}
        <div>
          <p className="text-xs uppercase tracking-wide text-mute font-bold mb-2">{tr.newTx.category}</p>
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
          <p className="text-xs uppercase tracking-wide text-mute font-bold mb-2">
            {tr.newTx.note} <span className="text-mute font-medium normal-case tracking-normal">{tr.newTx.noteOptional}</span>
          </p>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder={tr.newTx.notePlaceholder}
            rows={3}
            className="w-full bg-surface border border-border rounded-xl p-4 text-sm outline-none focus:border-green transition-colors resize-none"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={amount <= 0 || isSubmitting}
          className="w-full bg-green text-white rounded-xl py-4 font-bold text-base disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
        >
          {isSubmitting ? tr.newTx.saving : tr.newTx.save}
        </button>
      </div>
    </main>
  )
}
