'use client'

import { useState } from 'react'
import { useKassaStore } from '@/store/useKassaStore'
import { useLang } from '@/hooks/useLang'
import { exportToCsv } from '@/lib/exportCsv'
import { showToast } from '@/lib/toast'
import { ChevronRight, X, Plus } from 'lucide-react'

function EditModal({
  title, value, placeholder, onSave, onClose,
}: {
  title: string
  value: string
  placeholder: string
  onSave: (v: string) => void
  onClose: () => void
}) {
  const { tr } = useLang()
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
          className="w-full bg-base border border-border rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-green transition-colors mb-4"
        />
        <div className="grid grid-cols-2 gap-3">
          <button onClick={onClose} className="py-3 rounded-xl border border-border text-sm font-bold hover:bg-subtle transition-colors">
            {tr.settings.cancel}
          </button>
          <button onClick={handleSave} disabled={!val.trim()} className="py-3 rounded-xl bg-green text-white text-sm font-bold disabled:opacity-30">
            {tr.settings.save}
          </button>
        </div>
      </div>
    </div>
  )
}

function CurrencyModal({
  current, onSave, onClose,
}: {
  current: 'UZS' | 'USD'
  onSave: (v: 'UZS' | 'USD') => void
  onClose: () => void
}) {
  const { tr } = useLang()
  return (
    <div className="fixed inset-0 bg-ink/30 backdrop-blur-sm z-50 flex items-end lg:items-center justify-center p-4">
      <div className="bg-surface rounded-2xl border border-border w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <p className="font-bold">{tr.settings.currency}</p>
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
              <span className="text-sm">{c === 'UZS' ? "so'm (UZS)" : 'USD'}</span>
              {current === c && <span className="w-2 h-2 rounded-full bg-ink" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function ResetModal({ onConfirm, onClose }: { onConfirm: () => void; onClose: () => void }) {
  const { tr } = useLang()
  return (
    <div className="fixed inset-0 bg-ink/30 backdrop-blur-sm z-50 flex items-end lg:items-center justify-center p-4">
      <div className="bg-surface rounded-2xl border border-border w-full max-w-sm p-6">
        <p className="font-black text-lg mb-2">{tr.settings.resetConfirmTitle}</p>
        <p className="text-sm text-mute mb-6">{tr.settings.resetConfirmBody}</p>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={onClose} className="py-3 rounded-xl border border-border text-sm font-bold hover:bg-subtle transition-colors">
            {tr.settings.cancel}
          </button>
          <button onClick={onConfirm} className="py-3 rounded-xl bg-ink text-white text-sm font-bold">
            {tr.settings.delete}
          </button>
        </div>
      </div>
    </div>
  )
}

function CategoryManager({ type, onClose }: { type: 'sale' | 'expense'; onClose: () => void }) {
  const { tr } = useLang()
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
    showToast(tr.settings.updated.categoryAdded)
  }

  function handleRemove(id: string) {
    removeCategory(id)
    showToast(tr.settings.updated.categoryRemoved)
  }

  return (
    <div className="fixed inset-0 bg-ink/30 backdrop-blur-sm z-50 flex items-end lg:items-center justify-center p-4">
      <div className="bg-surface rounded-2xl border border-border w-full max-w-sm p-6 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between mb-5">
          <p className="font-bold">{type === 'sale' ? tr.settings.saleCategories : tr.settings.expenseCategories}</p>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-subtle flex items-center justify-center">
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 mb-4">
          {categories.map(c => (
            <div key={c.id} className="flex items-center justify-between px-4 py-3 bg-base rounded-xl">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${type === 'sale' ? 'bg-green' : 'bg-ink'}`} />
                <span className="text-sm font-medium">{c.label}</span>
              </div>
              <button onClick={() => handleRemove(c.id)} className="w-7 h-7 rounded-lg hover:bg-border flex items-center justify-center transition-colors">
                <X size={13} strokeWidth={2.5} className="text-mute" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newLabel}
            onChange={e => setNewLabel(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder={tr.settings.addCategory}
            className="flex-1 bg-base border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green transition-colors"
          />
          <button onClick={handleAdd} disabled={!newLabel.trim()} className="w-10 h-10 rounded-xl bg-green text-white flex items-center justify-center disabled:opacity-30">
            <Plus size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  )
}

type ModalType =
  | { kind: 'name' }
  | { kind: 'owner' }
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
  const { tr } = useLang()
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
    showToast(tr.settings.updated.reset)
  }

  function handleExport() {
    if (transactions.length === 0) {
      showToast(tr.settings.noEntries, 'error')
      return
    }
    exportToCsv(transactions, allCategories)
    showToast(`✓ ${transactions.length} ${tr.settings.updated.exported}`)
  }

  const sections: { title: string; items: SettingsItem[] }[] = [
    {
      title: tr.settings.business,
      items: [
        { label: tr.settings.name, value: settings.businessName, onClick: () => setModal({ kind: 'name' }) },
        { label: tr.settings.owner, value: settings.ownerName, onClick: () => setModal({ kind: 'owner' }) },
        { label: tr.settings.location, value: settings.location, onClick: () => setModal({ kind: 'location' }) },
        { label: tr.settings.currency, value: settings.currency === 'UZS' ? "so'm" : 'USD', onClick: () => setModal({ kind: 'currency' }) },
      ],
    },
    {
      title: tr.settings.categories,
      items: [
        { label: tr.settings.saleCategories, value: `${saleCategories.length}`, onClick: () => setModal({ kind: 'categories', catType: 'sale' }) },
        { label: tr.settings.expenseCategories, value: `${expenseCategories.length}`, onClick: () => setModal({ kind: 'categories', catType: 'expense' }) },
      ],
    },
    {
      title: tr.settings.data,
      items: [
        { label: tr.settings.totalEntries, value: `${transactions.length}`, onClick: null },
        { label: tr.settings.csvExport, value: '', onClick: handleExport },
        { label: tr.settings.resetAll, value: '', onClick: () => setModal({ kind: 'reset' }), danger: true },
      ],
    },
  ]

  return (
    <>
      <main className="px-5 lg:px-10 py-8 max-w-2xl">
        <h1 className="text-3xl font-black tracking-tight mb-8">{tr.settings.title}</h1>

        <div className="space-y-8">
          {sections.map(section => (
            <div key={section.title}>
              <p className="text-xs uppercase tracking-wide text-mute font-bold mb-3">{section.title}</p>
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
                    <span className={`text-sm font-medium ${item.danger ? 'text-ink' : ''}`}>{item.label}</span>
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
            <p className="text-xs text-mute">{tr.settings.version}</p>
            <p className="text-xs text-mute mt-1">{tr.settings.studio}</p>
          </div>
        </div>
      </main>

      {modal?.kind === 'name' && (
        <EditModal title={tr.settings.name} value={settings.businessName} placeholder={tr.settings.namePlaceholder}
          onSave={v => { updateSettings({ businessName: v }); showToast(tr.settings.updated.name) }}
          onClose={() => setModal(null)} />
      )}
      {modal?.kind === 'owner' && (
        <EditModal title={tr.settings.owner} value={settings.ownerName} placeholder={tr.settings.ownerPlaceholder}
          onSave={v => { updateSettings({ ownerName: v }); showToast(tr.settings.updated.owner) }}
          onClose={() => setModal(null)} />
      )}
      {modal?.kind === 'location' && (
        <EditModal title={tr.settings.location} value={settings.location} placeholder={tr.settings.locationPlaceholder}
          onSave={v => { updateSettings({ location: v }); showToast(tr.settings.updated.location) }}
          onClose={() => setModal(null)} />
      )}
      {modal?.kind === 'currency' && (
        <CurrencyModal current={settings.currency}
          onSave={v => { updateSettings({ currency: v }); showToast(tr.settings.updated.currency) }}
          onClose={() => setModal(null)} />
      )}
      {modal?.kind === 'categories' && (
        <CategoryManager type={modal.catType} onClose={() => setModal(null)} />
      )}
      {modal?.kind === 'reset' && (
        <ResetModal onConfirm={handleReset} onClose={() => setModal(null)} />
      )}
    </>
  )
}
