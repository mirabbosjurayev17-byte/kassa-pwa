'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Delete, Check } from 'lucide-react'
import { useKassaStore } from '@/store/useKassaStore'
import { useLang } from '@/hooks/useLang'
import { formatNumber } from '@/lib/formatCurrency'
import { showToast } from '@/lib/toast'

const QUICK = [10_000, 50_000, 100_000, 500_000, 1_000_000]
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '000', '0', 'back'] as const
const MAX = 9_999_999_999

export default function NewTransactionPage() {
  const router = useRouter()
  const { tr, lang } = useLang()
  const saleCategories = useKassaStore(s => s.saleCategories)
  const expenseCategories = useKassaStore(s => s.expenseCategories)
  const addTransaction = useKassaStore(s => s.addTransaction)

  const [type, setType] = useState<'sale' | 'expense'>('sale')
  const [amount, setAmount] = useState(0)
  const [category, setCategory] = useState(saleCategories[0]?.id ?? '')
  const [note, setNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [saved, setSaved] = useState(false)

  const categories = type === 'sale' ? saleCategories : expenseCategories
  const isSale = type === 'sale'

  function handleTypeChange(next: 'sale' | 'expense') {
    setType(next)
    setCategory(next === 'sale' ? saleCategories[0]?.id ?? '' : expenseCategories[0]?.id ?? '')
  }

  const press = useCallback((k: string) => {
    setAmount(a => {
      if (k === 'back') return Math.floor(a / 10)
      if (k === '000') return a === 0 ? 0 : Math.min(a * 1000, MAX)
      const next = a * 10 + Number(k)
      return next > MAX ? a : next
    })
  }, [])

  const handleSubmit = useCallback(async () => {
    if (amount <= 0) { showToast(tr.newTx.enterAmount, 'error'); return }
    if (!category) { showToast(tr.newTx.selectCategory, 'error'); return }
    setIsSubmitting(true)
    addTransaction({ type, amount, category, note: note.trim() || undefined, date: new Date().toISOString() })
    setSaved(true)
    showToast(type === 'sale' ? tr.newTx.saved_sale : tr.newTx.saved_expense)
    await new Promise(r => setTimeout(r, 650))
    router.push('/')
  }, [amount, category, type, note, addTransaction, router, tr])

  // Physical keyboard support (desktop)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return
      if (e.key >= '0' && e.key <= '9') press(e.key)
      else if (e.key === 'Backspace') press('back')
      else if (e.key === 'Enter') handleSubmit()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [press, handleSubmit])

  const canSave = amount > 0 && !!category && !isSubmitting

  return (
    <main className="px-5 lg:px-10 py-6 lg:py-8 max-w-lg lg:max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/" className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center hover:bg-subtle transition-colors">
          <ArrowLeft size={18} strokeWidth={2} />
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">{tr.newTx.title}</h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        {/* LEFT: type + amount + keypad */}
        <div className="space-y-5">
          {/* Type toggle */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-subtle rounded-2xl">
            <button
              onClick={() => handleTypeChange('sale')}
              className={`py-3 rounded-xl text-sm font-medium transition-all ${
                isSale ? 'bg-green text-white shadow-card' : 'text-mute hover:text-ink'
              }`}
            >
              {tr.newTx.sale}
            </button>
            <button
              onClick={() => handleTypeChange('expense')}
              className={`py-3 rounded-xl text-sm font-medium transition-all ${
                !isSale ? 'bg-ink text-white shadow-card' : 'text-mute hover:text-ink'
              }`}
            >
              {tr.newTx.expense}
            </button>
          </div>

          {/* Amount display */}
          <div className="card p-6 text-center">
            <p className="text-xs uppercase tracking-wide text-mute mb-3">{tr.newTx.amount}</p>
            <div className="flex items-baseline justify-center gap-2">
              <span className={`text-5xl font-semibold tabular-nums tracking-tight ${
                amount > 0 ? (isSale ? 'text-green' : 'text-ink') : 'text-border'
              }`}>
                {formatNumber(amount)}
              </span>
              <span className="text-lg text-mute">so'm</span>
            </div>

            {/* Quick add */}
            <div className="flex items-center gap-2 mt-5 overflow-x-auto no-scrollbar justify-start lg:justify-center">
              {QUICK.map(v => (
                <button
                  key={v}
                  onClick={() => setAmount(a => Math.min(a + v, MAX))}
                  className="px-3 py-1.5 text-xs font-medium bg-subtle hover:bg-border rounded-full flex-shrink-0 transition-colors tabular-nums"
                >
                  +{formatNumber(v)}
                </button>
              ))}
              {amount > 0 && (
                <button
                  onClick={() => setAmount(0)}
                  className="px-3 py-1.5 text-xs font-medium text-negative hover:bg-red-50 rounded-full flex-shrink-0 transition-colors"
                >
                  {tr.newTx.clear}
                </button>
              )}
            </div>
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-2.5">
            {KEYS.map(k => (
              <button
                key={k}
                onClick={() => press(k)}
                className="h-14 rounded-2xl bg-surface border border-border text-xl font-medium hover:bg-subtle active:scale-95 transition-all flex items-center justify-center tabular-nums"
                aria-label={k === 'back' ? 'backspace' : k}
              >
                {k === 'back' ? <Delete size={20} strokeWidth={1.8} className="text-mute" /> : k}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: category + note + save */}
        <div className="space-y-5">
          <div>
            <p className="text-xs uppercase tracking-wide text-mute font-medium mb-3">{tr.newTx.category}</p>
            <div className="flex flex-wrap gap-2">
              {categories.map(c => {
                const selected = category === c.id
                return (
                  <button
                    key={c.id}
                    onClick={() => setCategory(c.id)}
                    className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                      selected
                        ? isSale ? 'bg-green text-white' : 'bg-ink text-white'
                        : 'bg-surface border border-border text-ink hover:bg-subtle'
                    }`}
                  >
                    {c.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-mute font-medium mb-3">
              {tr.newTx.note} <span className="text-mute font-normal normal-case tracking-normal">{tr.newTx.noteOptional}</span>
            </p>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder={tr.newTx.notePlaceholder}
              rows={3}
              className="w-full bg-surface border border-border rounded-2xl p-4 text-sm outline-none focus:border-green transition-colors resize-none"
            />
          </div>

          {/* Save (sticky on mobile) */}
          <div className="sticky bottom-24 lg:static">
            <button
              onClick={handleSubmit}
              disabled={!canSave}
              className={`w-full rounded-2xl py-4 font-medium text-base transition-all flex items-center justify-center gap-2 ${
                canSave
                  ? 'bg-green text-white shadow-card hover:bg-green-dark active:scale-[0.99]'
                  : 'bg-border text-mute cursor-not-allowed'
              }`}
            >
              {saved
                ? <><Check size={18} strokeWidth={2.5} /> {lang === 'uz' ? 'Saqlandi' : 'Сохранено'}</>
                : isSubmitting ? tr.newTx.saving : tr.newTx.save}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
