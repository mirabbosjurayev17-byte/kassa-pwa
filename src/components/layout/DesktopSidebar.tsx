'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BarChart3, ListOrdered, FolderTree, Users, Settings, Sparkles } from 'lucide-react'
import { useLang } from '@/hooks/useLang'

type NavItem = { href: string; label: string; icon: typeof Home }

export function DesktopSidebar() {
  const pathname = usePathname()
  const { tr, lang } = useLang()

  const MAIN_ITEMS: NavItem[] = [
    { href: '/', label: tr.nav.home, icon: Home },
    { href: '/reports', label: tr.nav.reports, icon: BarChart3 },
    { href: '/transactions', label: tr.nav.transactions, icon: ListOrdered },
    { href: '/categories', label: tr.nav.categories, icon: FolderTree },
    { href: '/staff', label: tr.nav.staff, icon: Users },
  ]
  const SECONDARY_ITEMS: NavItem[] = [
    { href: '/settings', label: tr.nav.settings, icon: Settings },
  ]

  const renderItem = (item: NavItem) => {
    const active = pathname === item.href
    const Icon = item.icon
    return (
      <Link
        key={item.href}
        href={item.href}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 transition-all ${
          active ? 'bg-dark text-white' : 'text-mute hover:bg-subtle hover:text-ink'
        }`}
      >
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${active ? 'bg-green' : 'bg-subtle'}`}>
          <Icon size={16} strokeWidth={1.5} className={active ? 'text-white' : 'text-mute'} />
        </div>
        <span className={`text-sm ${active ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
      </Link>
    )
  }

  return (
    <aside className="hidden lg:flex w-64 bg-surface border-r border-border flex-col flex-shrink-0 sticky top-0 h-screen">
      {/* Logo */}
      <div className="px-6 py-7 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-dark flex items-center justify-center">
          <span className="text-green font-bold text-sm">K</span>
        </div>
        <span className="font-semibold text-base tracking-tight">KASSA</span>
      </div>

      {/* Nav sections */}
      <div className="px-3 flex-1 overflow-y-auto">
        <p className="text-xs font-medium text-mute uppercase tracking-widest px-3 mb-2">
          {lang === 'uz' ? 'ASOSIY' : 'ГЛАВНОЕ'}
        </p>
        {MAIN_ITEMS.map(renderItem)}

        <div className="mt-6">
          <p className="text-xs font-medium text-mute uppercase tracking-widest px-3 mb-2">
            {lang === 'uz' ? 'BOSHQALAR' : 'ДРУГОЕ'}
          </p>
          {SECONDARY_ITEMS.map(renderItem)}
        </div>
      </div>

      {/* AI Assistant card */}
      <div className="px-3 pb-6">
        <div className="bg-dark-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-green flex items-center justify-center">
              <Sparkles size={12} className="text-white" />
            </div>
            <p className="text-xs font-semibold text-white">{lang === 'uz' ? 'AI Maslahat' : 'AI Совет'}</p>
            <div className="w-1.5 h-1.5 rounded-full bg-green ml-auto" />
          </div>
          <p className="text-xs text-white/60 leading-relaxed">
            {lang === 'uz'
              ? "Bugungi xarajat kechagiga nisbatan 23% yuqori."
              : "Сегодняшние расходы на 23% выше вчерашних."}
          </p>
        </div>
      </div>
    </aside>
  )
}
