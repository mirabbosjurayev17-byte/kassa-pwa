'use client'

import { useKassaStore } from '@/store/useKassaStore'

export function LangSwitch({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  const lang = useKassaStore(s => s.settings.lang) ?? 'uz'
  const updateSettings = useKassaStore(s => s.updateSettings)

  const light = variant === 'light'

  return (
    <button
      onClick={() => updateSettings({ lang: lang === 'uz' ? 'ru' : 'uz' })}
      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
        light
          ? 'border border-white/20 bg-white/10 hover:bg-white/20'
          : 'border border-border bg-surface hover:bg-subtle'
      }`}
    >
      <span className={`text-xs font-bold ${
        lang === 'uz'
          ? light ? 'text-white' : 'text-ink'
          : light ? 'text-white/40' : 'text-mute'
      }`}>UZ</span>
      <span className={`text-xs ${light ? 'text-white/30' : 'text-mute'}`}>/</span>
      <span className={`text-xs font-bold ${
        lang === 'ru'
          ? light ? 'text-white' : 'text-ink'
          : light ? 'text-white/40' : 'text-mute'
      }`}>RU</span>
    </button>
  )
}
