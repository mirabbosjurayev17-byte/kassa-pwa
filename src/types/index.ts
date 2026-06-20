export type TransactionType = 'sale' | 'expense'

export type Transaction = {
  id: string
  type: TransactionType
  amount: number          // so'mda butun son
  category: string        // category id (slug)
  note?: string
  date: string            // ISO 8601, masalan 2026-06-19T18:42:00.000Z
}

export type Currency = 'UZS' | 'USD'

export type Settings = {
  businessName: string
  location: string
  currency: Currency
  onboardingCompleted: boolean
}

export type Category = {
  id: string              // slug
  label: string           // ko'rsatiladigan nom (Uzbek)
  type: TransactionType
}
