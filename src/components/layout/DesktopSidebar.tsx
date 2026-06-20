'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BarChart3, ListOrdered, FolderTree, Users, Settings } from 'lucide-react'
import { useKassaStore } from '@/store/useKassaStore'
import { useLang } from '@/hooks/useLang'
import { LangSwitch } from './LangSwitch'

export function DesktopSidebar() {
  const pathname = usePathname()
  const { tr } = useLang()
  const businessName = useKassaStore((s) => s.settings.businessName)
  const location = useKassaStore((s) => s.settings.location)

  const MAIN_ITEMS = [
    { href: '/', label: tr.nav.home, icon: Home },
    { href: '/reports', label: tr.nav.reports, icon: BarChart3 },
    { href: '/transactions', label: tr.nav.transactions, icon: ListOrdered },
    { href: '/categories', label: tr.nav.categories, icon: FolderTree },
    { href: '/staff', label: tr.nav.staff, icon: Users },
  ]

  return (
    <aside className="hidden lg:flex w-64 bg-surface border-r border-border flex-col flex-shrink-0 sticky top-0 h-screen">
      {/* Logo */}
      <div className="px-6 py-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-ink flex items-center justify-center flex-shrink-0">
            <span className="text-blue font-black text-lg leading-none">K</span>
          </div>
          <div className="min-w-0">
            <p className="font-black text-lg leading-none">{tr.appName}</p>
            <p className="text-xs text-mute font-medium mt-1 truncate">
              {businessName} · {location}
            </p>
          </div>
        </div>
      </div>

      {/* Til almashtirgich */}
      <div className="px-6 pb-4">
        <LangSwitch />
      </div>

      {/* Main nav */}
      <nav className="px-3 flex-1">
        {MAIN_ITEMS.map((item) => {
          const active = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                active
                  ? 'bg-blue text-white'
                  : 'text-mute hover:bg-subtle'
              }`}
            >
              <Icon size={18} strokeWidth={2} />
              <span className={`text-sm ${active ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom: Settings */}
      <div className="px-3 pb-6">
        <Link
          href="/settings"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
            pathname === '/settings'
              ? 'bg-blue text-white'
              : 'text-mute hover:bg-subtle'
          }`}
        >
          <Settings size={18} strokeWidth={2} />
          <span className="text-sm font-medium">{tr.nav.settings}</span>
        </Link>
      </div>
    </aside>
  )
}
