import { useKassaStore } from '@/store/useKassaStore'
import { t } from '@/lib/i18n'

export function useLang() {
  // ?? 'uz' — eski persist (lang yo'q) uchun fallback
  const lang = useKassaStore(s => s.settings.lang) ?? 'uz'
  return { lang, tr: t[lang] }
}
