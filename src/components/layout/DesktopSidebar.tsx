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
    <aside
      className="hidden lg:flex w-64 flex-col flex-shrink-0 sticky top-0 h-screen"
      style={{ background: 'linear-gradient(180deg, #0350A7 0%, #0A1F5C 100%)' }}
    >
      {/* Logo */}
      <div className="px-6 py-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
            <span className="text-teal font-black text-lg leading-none">K</span>
          </div>
          <div className="min-w-0">
            <p className="font-black text-lg leading-none text-white">{tr.appName}</p>
            <p className="text-xs text-white/50 font-medium mt-1 truncate">
              {businessName} · {location}
            </p>
          </div>
        </div>
      </div>

      {/* Til almashtirgich */}
      <div className="px-6 pb-4">
        <LangSwitch variant="light" />
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
                  ? 'bg-white/15 text-white backdrop-blur-sm'
                  : 'text-white/50 hover:bg-white/10 hover:text-white'
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
              ? 'bg-white/15 text-white'
              : 'text-white/50 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Settings size={18} strokeWidth={2} />
          <span className="text-sm font-medium">{tr.nav.settings}</span>
        </Link>
      </div>
    </aside>
  )
}
