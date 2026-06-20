'use client'

import { useState } from 'react'
import { useKassaStore } from '@/store/useKassaStore'
import { exportToCsv } from '@/lib/exportCsv'
import { showToast } from '@/lib/toast'
import { ChevronRight, X, Plus } from 'lucide-react'

// Inline edit modal
function EditModal({
  title,
  value,
  placeholder,
  onSave,
  onClose,
}: {
  title: string
  value: string
  placeholder: string
  onSave: (v: string) => void
  onClose: () => void
}) {
  const [val, setVal] = useState(value)

  function handleSave() {
    const trimmed = val.trim()
    if (!trimmed) return
    onSave(trimmed)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-ink/30 backdrop-blur-sm z-50 flex items-end lg:items-center justify-center p-4">
      <div className="bg-surface rounded-2xl border border-border w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <p className="font-bold">{title}</p>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-subtle flex items-center justify-center">
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>
        <input
          type="text"
          value={val}
          onChange={e => setVal(e.target.value)}
          placeholder={placeholder}
          autoFocus
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          className="w-full bg-base border border-border rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-blue transition-colors mb-4"
        />
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            className="py-3 rounded-xl border border-border text-sm font-bold hover:bg-subtle transition-colors"
          >
            Bekor
          </button>
          <button
            onClick={handleSave}
            disabled={!val.trim()}
            className="py-3 rounded-xl bg-ink text-white text-sm font-bold disabled:opacity-30"
          >
            Saqlash
          </button>
        </div>
      </div>
    </div>
  )
}

// Currency select modal
function CurrencyModal({
  current,
  onSave,
  onClose,
}: {
  current: 'UZS' | 'USD'
  onSave: (v: 'UZS' | 'USD') => void
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 bg-ink/30 backdrop-blur-sm z-50 flex items-end lg:items-center justify-center p-4">
      <div className="bg-surface rounded-2xl border border-border w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <p className="font-bold">Valyuta</p>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-subtle flex items-center justify-center">
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>
        <div className="space-y-2">
          {(['UZS', 'USD'] as const).map(c => (
            <button
              key={c}
              onClick={() => { onSave(c); onClose() }}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border transition-colors ${
                current === c ? 'border-ink bg-subtle font-bold' : 'border-border hover:bg-subtle font-medium'
              }`}
            >
              <span className="text-sm">{c === 'UZS' ? "so'm (UZS)" : 'Dollar (USD)'}</span>
              {current === c && <span className="w-2 h-2 rounded-full bg-ink" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Reset confirmation modal
function ResetModal({ onConfirm, onClose }: { onConfirm: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-ink/30 backdrop-blur-sm z-50 flex items-end lg:items-center justify-center p-4">
      <div className="bg-surface rounded-2xl border border-border w-full max-w-sm p-6">
        <p className="font-black text-lg mb-2">Barchasini o'chirish</p>
        <p className="text-sm text-mute mb-6">
          Barcha yozuvlar o'chib ketadi. Bu amalni qaytarib bo'lmaydi.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            className="py-3 rounded-xl border border-border text-sm font-bold hover:bg-subtle transition-colors"
          >
            Bekor
          </button>
          <button
            onClick={onConfirm}
            className="py-3 rounded-xl bg-ink text-white text-sm font-bold"
          >
            O'chirish
          </button>
        </div>
      </div>
    </div>
  )
}

// Category manager
function CategoryManager({
  type,
  onClose,
}: {
  type: 'sale' | 'expense'
  onClose: () => void
}) {
  const saleCategories = useKassaStore(s => s.saleCategories)
  const expenseCategories = useKassaStore(s => s.expenseCategories)
  const addCategory = useKassaStore(s => s.addCategory)
  const removeCategory = useKassaStore(s => s.removeCategory)

  const categories = type === 'sale' ? saleCategories : expenseCategories
  const [newLabel, setNewLabel] = useState('')

  function handleAdd() {
    const label = newLabel.trim()
    if (!label) return
    const id = label.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now()
    addCategory({ id, label, type })
    setNewLabel('')
    showToast('Kategoriya qo\'shildi')
  }

  function handleRemove(id: string) {
    removeCategory(id)
    showToast('Kategoriya o\'chirildi')
  }

  return (
    <div className="fixed inset-0 bg-ink/30 backdrop-blur-sm z-50 flex items-end lg:items-center justify-center p-4">
      <div className="bg-surface rounded-2xl border border-border w-full max-w-sm p-6 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between mb-5">
          <p className="font-bold">{type === 'sale' ? 'Savdo' : 'Xarajat'} kategoriyalari</p>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-subtle flex items-center justify-center">
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto space-y-2 mb-4">
          {categories.map(c => (
            <div key={c.id} className="flex items-center justify-between px-4 py-3 bg-base rounded-xl">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${type === 'sale' ? 'bg-blue' : 'bg-ink'}`} />
                <span className="text-sm font-medium">{c.label}</span>
              </div>
              <button
                onClick={() => handleRemove(c.id)}
                className="w-7 h-7 rounded-lg hover:bg-border flex items-center justify-center transition-colors"
              >
                <X size={13} strokeWidth={2.5} className="text-mute" />
              </button>
            </div>
          ))}
        </div>

        {/* Add new */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newLabel}
            onChange={e => setNewLabel(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="Yangi kategoriya"
            className="flex-1 bg-base border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue transition-colors"
          />
          <button
            onClick={handleAdd}
            disabled={!newLabel.trim()}
            className="w-10 h-10 rounded-xl bg-ink text-white flex items-center justify-center disabled:opacity-30"
          >
            <Plus size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────

type ModalType =
  | { kind: 'name' }
  | { kind: 'location' }
  | { kind: 'currency' }
  | { kind: 'categories'; catType: 'sale' | 'expense' }
  | { kind: 'reset' }
  | null

type SettingsItem = {
  label: string
  value: string
  onClick: (() => void) | null
  danger?: boolean
}

export default function SettingsPage() {
  const settings         = useKassaStore(s => s.settings)
  const transactions     = useKassaStore(s => s.transactions)
  const saleCategories   = useKassaStore(s => s.saleCategories)
  const expenseCategories= useKassaStore(s => s.expenseCategories)
  const updateSettings   = useKassaStore(s => s.updateSettings)
  const resetAll         = useKassaStore(s => s.resetAll)
  const allCategories    = [...saleCategories, ...expenseCategories]

  const [modal, setModal] = useState<ModalType>(null)

  function handleReset() {
    resetAll()
    setModal(null)
    showToast('Barcha ma\'lumotlar o\'chirildi')
  }

  function handleExport() {
    if (transactions.length === 0) {
      showToast('Yozuv yo\'q', 'error')
      return
    }
    exportToCsv(transactions, allCategories)
    showToast(`✓ ${transactions.length} ta yozuv eksport qilindi`)
  }

  const sections: { title: string; items: SettingsItem[] }[] = [
    {
      title: 'Biznes',
      items: [
        {
          label: 'Nom',
          value: settings.businessName,
          onClick: () => setModal({ kind: 'name' }),
        },
        {
          label: 'Manzil',
          value: settings.location,
          onClick: () => setModal({ kind: 'location' }),
        },
        {
          label: 'Valyuta',
          value: settings.currency === 'UZS' ? "so'm" : 'USD',
          onClick: () => setModal({ kind: 'currency' }),
        },
      ],
    },
    {
      title: 'Kategoriyalar',
      items: [
        {
          label: 'Savdo kategoriyalari',
          value: `${saleCategories.length} ta`,
          onClick: () => setModal({ kind: 'categories', catType: 'sale' }),
        },
        {
          label: 'Xarajat kategoriyalari',
          value: `${expenseCategories.length} ta`,
          onClick: () => setModal({ kind: 'categories', catType: 'expense' }),
        },
      ],
    },
    {
      title: "Ma'lumotlar",
      items: [
        {
          label: 'Jami yozuvlar',
          value: `${transactions.length} ta`,
          onClick: null,
        },
        {
          label: 'CSV eksport (barcha vaqt)',
          value: '',
          onClick: handleExport,
        },
        {
          label: "Barchasini o'chirish",
          value: '',
          onClick: () => setModal({ kind: 'reset' }),
          danger: true,
        },
      ],
    },
  ]

  return (
    <>
      <main className="px-5 lg:px-10 py-8 max-w-2xl">
        <h1 className="text-3xl font-black tracking-tight mb-8">Sozlamalar</h1>

        <div className="space-y-8">
          {sections.map(section => (
            <div key={section.title}>
              <p className="text-xs uppercase tracking-wide text-mute font-bold mb-3">
                {section.title}
              </p>
              <div className="bg-surface border border-border rounded-2xl overflow-hidden">
                {section.items.map((item, i) => (
                  <button
                    key={item.label}
                    onClick={item.onClick ?? undefined}
                    disabled={!item.onClick}
                    className={`w-full flex items-center justify-between px-5 py-4 text-left transition-colors ${
                      i < section.items.length - 1 ? 'border-b border-border' : ''
                    } ${item.onClick ? 'hover:bg-subtle' : 'cursor-default'}`}
                  >
                    <span className={`text-sm font-medium ${item.danger ? 'text-ink' : ''}`}>
                      {item.label}
                    </span>
                    <div className="flex items-center gap-2">
                      {item.value && <span className="text-sm text-mute">{item.value}</span>}
                      {item.onClick && <ChevronRight size={16} className="text-mute" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="text-center pt-4">
            <p className="text-xs text-mute">Kassa v1.0</p>
            <p className="text-xs text-mute mt-1">Kodd Studio mahsuloti</p>
          </div>
        </div>
      </main>

      {/* Modals */}
      {modal?.kind === 'name' && (
        <EditModal
          title="Biznes nomi"
          value={settings.businessName}
          placeholder="Masalan: Baraka Market"
          onSave={v => { updateSettings({ businessName: v }); showToast('Nom yangilandi') }}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.kind === 'location' && (
        <EditModal
          title="Manzil"
          value={settings.location}
          placeholder="Masalan: Yunusobod"
          onSave={v => { updateSettings({ location: v }); showToast('Manzil yangilandi') }}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.kind === 'currency' && (
        <CurrencyModal
          current={settings.currency}
          onSave={v => { updateSettings({ currency: v }); showToast('Valyuta yangilandi') }}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.kind === 'categories' && (
        <CategoryManager
          type={modal.catType}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.kind === 'reset' && (
        <ResetModal
          onConfirm={handleReset}
          onClose={() => setModal(null)}
        />
      )}
    </>
  )
}
