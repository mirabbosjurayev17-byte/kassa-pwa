import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Transaction, Settings, Category } from '@/types'
import { DEFAULT_SALE_CATEGORIES, DEFAULT_EXPENSE_CATEGORIES } from '@/lib/categories'
import { generateSeedTransactions } from '@/lib/mockSeed'

type KassaState = {
  transactions: Transaction[]
  settings: Settings
  saleCategories: Category[]
  expenseCategories: Category[]

  // Actions
  addTransaction: (t: Omit<Transaction, 'id'>) => void
  deleteTransaction: (id: string) => void
  updateSettings: (s: Partial<Settings>) => void
  addCategory: (c: Category) => void
  removeCategory: (id: string) => void
  resetAll: () => void
  seedDemo: () => void
}

const DEFAULT_SETTINGS: Settings = {
  businessName: 'Mehr Market',
  ownerName: 'Aziz Karimov',
  location: 'Yunusobod',
  currency: 'UZS',
  onboardingCompleted: false,
  lang: 'uz',
}

function genId(): string {
  return Math.random().toString(36).slice(2, 11)
}

export const useKassaStore = create<KassaState>()(
  persist(
    (set, get) => ({
      transactions: [],
      settings: DEFAULT_SETTINGS,
      saleCategories: DEFAULT_SALE_CATEGORIES,
      expenseCategories: DEFAULT_EXPENSE_CATEGORIES,

      addTransaction: (t) =>
        set((state) => ({
          transactions: [{ ...t, id: genId() }, ...state.transactions],
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      updateSettings: (s) =>
        set((state) => ({
          settings: { ...state.settings, ...s },
        })),

      addCategory: (c) =>
        set((state) =>
          c.type === 'sale'
            ? { saleCategories: [...state.saleCategories, c] }
            : { expenseCategories: [...state.expenseCategories, c] }
        ),

      removeCategory: (id) =>
        set((state) => ({
          saleCategories: state.saleCategories.filter((c) => c.id !== id),
          expenseCategories: state.expenseCategories.filter((c) => c.id !== id),
        })),

      resetAll: () =>
        // Settings (biznes nomi, onboardingCompleted) saqlanadi — "barchasini o'chirish"
        // faqat yozuvlar va kategoriyalarni default'ga qaytaradi (onboarding'ga otib yubormaydi).
        set({
          transactions: [],
          saleCategories: DEFAULT_SALE_CATEGORIES,
          expenseCategories: DEFAULT_EXPENSE_CATEGORIES,
        }),

      seedDemo: () => {
        if (get().transactions.length > 0) return
        set({ transactions: generateSeedTransactions(30) })
      },
    }),
    {
      name: 'kassa-storage',
      storage: createJSONStorage(() => localStorage),
      version: 3,
      migrate: (persistedState, version) => {
        if (version < 3) {
          // Eski demo state'ini (AutoParts/Olov Grill) rad etamiz: yangi default settings +
          // bo'sh transactions (bosh sahifa qayta seed qiladi). Mehr Market identitetiga o'tamiz.
          return {
            transactions: [] as Transaction[],
            settings: DEFAULT_SETTINGS,
            saleCategories: DEFAULT_SALE_CATEGORIES,
            expenseCategories: DEFAULT_EXPENSE_CATEGORIES,
          } as unknown as KassaState
        }
        return persistedState as KassaState
      },
    }
  )
)
