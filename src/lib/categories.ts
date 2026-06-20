import type { Category } from '@/types'

export const DEFAULT_SALE_CATEGORIES: Category[] = [
  { id: 'cash', label: 'Naqd', type: 'sale' },
  { id: 'click', label: 'Click', type: 'sale' },
  { id: 'payme', label: 'Payme', type: 'sale' },
  { id: 'uzcard', label: 'Uzcard', type: 'sale' },
  { id: 'humo', label: 'Humo', type: 'sale' },
  { id: 'transfer', label: "O'tkazma", type: 'sale' },
  { id: 'other-sale', label: 'Boshqa', type: 'sale' },
]

export const DEFAULT_EXPENSE_CATEGORIES: Category[] = [
  { id: 'product', label: 'Mahsulot', type: 'expense' },
  { id: 'salary', label: 'Ish haqi', type: 'expense' },
  { id: 'rent', label: 'Ijara', type: 'expense' },
  { id: 'utilities', label: 'Kommunal', type: 'expense' },
  { id: 'transport', label: 'Transport', type: 'expense' },
  { id: 'marketing', label: 'Reklama', type: 'expense' },
  { id: 'tax', label: 'Soliq', type: 'expense' },
  { id: 'other-expense', label: 'Boshqa', type: 'expense' },
]

export function getCategoryLabel(id: string, allCategories: Category[]): string {
  return allCategories.find(c => c.id === id)?.label ?? id
}
