import type { ReactNode } from 'react'

type Props = {
  label: string
  value: ReactNode
  hint?: string
  // Nuqta faqat semantik joyda: blue = savdo, ink = xarajat.
  // Neytral metrikalarda (o'rtacha chek, marjin) nuqta yo'q.
  dotColor?: 'blue' | 'ink'
}

export function KpiCard({ label, value, hint, dotColor }: Props) {
  const dot = dotColor === 'blue' ? 'bg-blue' : dotColor === 'ink' ? 'bg-ink' : null

  return (
    <div className="bg-surface rounded-2xl border border-border p-6">
      <div className="flex items-center gap-2 mb-3">
        {dot && <span className={`w-2 h-2 rounded-full ${dot}`} />}
        <p className="text-xs text-mute font-bold uppercase tracking-wide">{label}</p>
      </div>
      {/* font-bold — signature'dan past tier (faqat hero font-black) */}
      <p className="text-2xl lg:text-3xl font-bold tabular-nums">{value}</p>
      {hint && <p className="text-xs text-mute mt-2">{hint}</p>}
    </div>
  )
}
