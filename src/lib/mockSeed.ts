import type { Transaction } from '@/types'

const SALE_DISTRIBUTION = [
  { categoryId: 'cash', weight: 40, min: 50_000, max: 800_000 },
  { categoryId: 'click', weight: 25, min: 100_000, max: 1_500_000 },
  { categoryId: 'payme', weight: 15, min: 80_000, max: 1_200_000 },
  { categoryId: 'uzcard', weight: 10, min: 100_000, max: 900_000 },
  { categoryId: 'humo', weight: 7, min: 80_000, max: 600_000 },
  { categoryId: 'transfer', weight: 3, min: 500_000, max: 3_000_000 },
]

const EXPENSE_DISTRIBUTION = [
  { categoryId: 'product', weight: 35, min: 100_000, max: 800_000 },
  { categoryId: 'salary', weight: 5, min: 2_000_000, max: 5_000_000 },  // kam, lekin katta
  { categoryId: 'rent', weight: 3, min: 3_000_000, max: 8_000_000 },     // oyiga 1-2 marta
  { categoryId: 'utilities', weight: 10, min: 50_000, max: 400_000 },
  { categoryId: 'transport', weight: 15, min: 30_000, max: 200_000 },
  { categoryId: 'marketing', weight: 8, min: 100_000, max: 500_000 },
  { categoryId: 'tax', weight: 4, min: 500_000, max: 2_000_000 },
  { categoryId: 'other-expense', weight: 20, min: 20_000, max: 300_000 },
]

function weightedPick<T extends { weight: number }>(items: T[]): T {
  const total = items.reduce((s, i) => s + i.weight, 0)
  let r = Math.random() * total
  for (const item of items) {
    r -= item.weight
    if (r <= 0) return item
  }
  return items[items.length - 1]
}

function randomBetween(min: number, max: number): number {
  // 10 000 ga yaxlitlash — realistik raqamlar
  const raw = min + Math.random() * (max - min)
  return Math.round(raw / 10_000) * 10_000
}

function genId(): string {
  return Math.random().toString(36).slice(2, 11)
}

/**
 * 30 kunlik realistik mock tranzaksiyalar.
 * Har kuni 5-15 ta yozuv. Yakshanbada kamroq aktivlik.
 * Eng so'nggi kun — bugun.
 */
export function generateSeedTransactions(days = 30): Transaction[] {
  const transactions: Transaction[] = []
  const now = new Date()

  for (let dayOffset = days - 1; dayOffset >= 0; dayOffset--) {
    const day = new Date(now)
    day.setDate(day.getDate() - dayOffset)
    day.setHours(0, 0, 0, 0)

    const isSunday = day.getDay() === 0
    const baseCount = isSunday ? 3 : 8
    const variance = isSunday ? 2 : 7
    const txCount = baseCount + Math.floor(Math.random() * variance)

    for (let i = 0; i < txCount; i++) {
      // 75% savdo, 25% xarajat
      const isSale = Math.random() < 0.75
      const dist = isSale ? SALE_DISTRIBUTION : EXPENSE_DISTRIBUTION
      const picked = weightedPick(dist)

      // ish kunining soati: 9:00 - 22:00
      const hour = 9 + Math.floor(Math.random() * 13)
      const minute = Math.floor(Math.random() * 60)
      const txDate = new Date(day)
      txDate.setHours(hour, minute, 0, 0)

      transactions.push({
        id: genId(),
        type: isSale ? 'sale' : 'expense',
        amount: randomBetween(picked.min, picked.max),
        category: picked.categoryId,
        date: txDate.toISOString(),
      })
    }
  }

  // Sana bo'yicha sort (eng yangisi tepada)
  transactions.sort((a, b) => b.date.localeCompare(a.date))
  return transactions
}
