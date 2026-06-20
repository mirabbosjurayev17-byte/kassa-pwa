import type { Transaction, Category } from '@/types'

export function exportToCsv(transactions: Transaction[], categories: Category[], filename = 'kassa-hisobot.csv') {
  const getCatLabel = (id: string) => categories.find(c => c.id === id)?.label ?? id

  const header = ['Sana', 'Vaqt', 'Turi', 'Kategoriya', 'Summa', 'Izoh']

  const rows = transactions.map(tx => {
    const d = new Date(tx.date)
    return [
      d.toLocaleDateString('uz-UZ'),
      d.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
      tx.type === 'sale' ? 'Savdo' : 'Xarajat',
      getCatLabel(tx.category),
      tx.amount.toString(),
      tx.note ?? '',
    ]
  })

  const csv = [header, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  // BOM — Excel UTF-8 CSV'ni to'g'ri ochishi uchun (o'zbek/lotin harflar buzilmaydi)
  const bom = String.fromCharCode(0xfeff)
  const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
