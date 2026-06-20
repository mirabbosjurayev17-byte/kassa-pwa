'use client'

import { useKassaStore } from '@/store/useKassaStore'

export function LangSwitch() {
  const lang = useKassaStore(s => s.settings.lang) ?? 'uz'
  const updateSettings = useKassaStore(s => s.updateSettings)

  function toggle() {
    updateSettings({ lang: lang === 'uz' ? 'ru' : 'uz' })
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-subtle transition-colors"
    >
      <span className={`text-xs font-bold ${lang === 'uz' ? 'text-ink' : 'text-mute'}`}>UZ</span>
      <span className="text-xs text-mute">/</span>
      <span className={`text-xs font-bold ${lang === 'ru' ? 'text-ink' : 'text-mute'}`}>RU</span>
    </button>
  )
}
