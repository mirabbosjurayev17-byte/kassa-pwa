import type { ReactNode } from 'react'

type Props = {
  label: string
  value: ReactNode
  hint?: string
  // Nuqta faqat semantik joyda: blue = savdo, teal = xarajat.
  dotColor?: 'blue' | 'teal'
}

export function KpiCard({ label, value, hint, dotColor }: Props) {
  const dot = dotColor === 'blue' ? 'bg-blue' : dotColor === 'teal' ? 'bg-teal' : null

  return (
    <div className="bg-surface rounded-xl border border-border p-5 shadow-sm shadow-blue-dark/5">
      <div className="flex items-center gap-2 mb-3">
        {dot && <span className={`w-2 h-2 rounded-full ${dot}`} />}
        <p className="text-xs text-mute font-bold uppercase tracking-wide">{label}</p>
      </div>
      <p className="text-2xl lg:text-3xl font-bold tabular-nums">{value}</p>
      {hint && <p className="text-xs text-mute mt-2">{hint}</p>}
    </div>
  )
}
