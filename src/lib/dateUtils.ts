import type { Transaction } from '@/types'

export function startOfDay(d: Date): Date {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

export function isSameDay(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() === startOfDay(b).getTime()
}

export function daysAgo(n: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return startOfDay(d)
}

export function getDayLabel(d: Date): string {
  const days = ['Yak', 'Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh']
  return days[d.getDay()]
}

export function filterByDay(txs: Transaction[], day: Date): Transaction[] {
  return txs.filter(t => isSameDay(new Date(t.date), day))
}

export function sumByType(txs: Transaction[], type: 'sale' | 'expense'): number {
  return txs.filter(t => t.type === type).reduce((s, t) => s + t.amount, 0)
}

export function getProfit(txs: Transaction[]): number {
  return sumByType(txs, 'sale') - sumByType(txs, 'expense')
}
