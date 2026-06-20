/**
 * 1847000 -> "1 847 000"
 * Bo'shliq separator (O'zbek va Rus standartiga mos), vergul yo'q.
 */
export function formatNumber(n: number): string {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

/**
 * 1847000 -> "1 847 000 so'm"
 */
export function formatCurrency(n: number, currency: 'UZS' | 'USD' = 'UZS'): string {
  const formatted = formatNumber(n)
  return currency === 'UZS' ? `${formatted} so'm` : `$${formatted}`
}

/**
 * 850000 -> "+850K", 1600000 -> "+1.6M", 420000 -> "−420K"
 * Compact format — kichik joylarda (kartochkalarda) ishlatish uchun
 */
export function formatCompact(n: number, withSign = false): string {
  const abs = Math.abs(n)
  const sign = n < 0 ? '−' : (withSign ? '+' : '')
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  if (abs >= 1_000) return `${sign}${Math.round(abs / 1_000)}K`
  return `${sign}${abs}`
}
