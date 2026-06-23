'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BarChart3, ListOrdered, FolderTree, Users, Settings, Plus, Sparkles } from 'lucide-react'
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
        aria-current={active ? 'page' : undefined}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl mb-1 transition-all ${
          active ? 'bg-dark text-white' : 'text-mute hover:bg-subtle hover:text-ink'
        }`}
      >
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
          active ? 'bg-green-bright' : 'bg-subtle'
        }`}>
          <Icon size={16} strokeWidth={2} className={active ? 'text-ink' : 'text-mute'} />
        </div>
        <span className={`text-sm ${active ? 'font-medium' : 'font-normal'}`}>{item.label}</span>
      </Link>
    )
  }

  return (
    <aside className="hidden lg:flex w-64 bg-surface border-r border-border flex-col flex-shrink-0 sticky top-0 h-screen">
      {/* Logo */}
      <div className="px-6 py-7 flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-dark flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 512 512" fill="none">
            <g stroke="#00DF81" strokeWidth="50" strokeLinecap="round" strokeLinejoin="round">
              <path d="M190 150 V362" /><path d="M190 258 L332 150" /><path d="M190 258 L336 362" />
            </g>
          </svg>
        </div>
        <span className="font-semibold text-base tracking-tight text-ink">Kassa</span>
      </div>

      {/* Nav */}
      <div className="px-3 flex-1 overflow-y-auto no-scrollbar">
        <p className="text-[11px] font-medium text-mute uppercase tracking-widest px-3 mb-2">
          {lang === 'uz' ? 'Asosiy' : 'Главное'}
        </p>
        {MAIN_ITEMS.map(renderItem)}

        <div className="mt-6">
          <p className="text-[11px] font-medium text-mute uppercase tracking-widest px-3 mb-2">
            {lang === 'uz' ? 'Boshqalar' : 'Другое'}
          </p>
          {SECONDARY_ITEMS.map(renderItem)}
        </div>
      </div>

      {/* New record CTA */}
      <div className="px-3 pb-3">
        <Link
          href="/transactions/new"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-green-bright text-ink text-sm font-medium hover:brightness-105 active:scale-[0.99] transition-all"
        >
          <Plus size={18} strokeWidth={2.5} />
          {lang === 'uz' ? 'Yangi yozuv' : 'Новая запись'}
        </Link>
      </div>

      {/* AI card */}
      <div className="px-3 pb-6">
        <div className="relative card-dark rounded-2xl p-4 overflow-hidden">
          <div className="absolute inset-0 card-dark-sheen pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-6 h-6 rounded-full bg-green-bright flex items-center justify-center">
                <Sparkles size={12} className="text-ink" />
              </div>
              <p className="text-xs font-medium text-white">{lang === 'uz' ? 'AI maslahat' : 'AI совет'}</p>
              <span className="w-1.5 h-1.5 rounded-full bg-green-bright ml-auto animate-pulse" />
            </div>
            <p className="text-xs text-white/65 leading-relaxed">
              {lang === 'uz'
                ? 'Kunlik foydangizni kuzatib boring va xarajatlarni nazoratda tuting.'
                : 'Следите за дневной прибылью и держите расходы под контролем.'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
