'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BarChart3, Plus, ListOrdered, User } from 'lucide-react'
import { useLang } from '@/hooks/useLang'

const ITEMS = [
  { href: '/', key: 'home', icon: Home },
  { href: '/reports', key: 'reports', icon: BarChart3 },
  { href: '/transactions', key: 'transactions', icon: ListOrdered },
  { href: '/settings', key: 'settings', icon: User },
] as const

export function MobileBottomNav() {
  const pathname = usePathname()
  const { tr } = useLang()

  const renderItem = (item: (typeof ITEMS)[number]) => {
    const active = pathname === item.href
    const Icon = item.icon
    return (
      <Link
        key={item.href}
        href={item.href}
        className="flex flex-col items-center gap-1 px-3 py-2 flex-1"
      >
        <Icon
          size={22}
          strokeWidth={active ? 2.2 : 1.8}
          className={active ? 'text-green' : 'text-mute'}
        />
        <span className={`text-xs whitespace-nowrap ${active ? 'font-semibold text-green' : 'font-medium text-mute'}`}>
          {tr.nav[item.key]}
        </span>
      </Link>
    )
  }

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-sm border-t border-border z-40">
      <div className="flex items-center justify-around px-2 pt-2 pb-6 max-w-md mx-auto">
        {ITEMS.slice(0, 2).map(renderItem)}

        {/* O'rta + tugma — dark FAB */}
        <Link
          href="/transactions/new"
          className="flex flex-col items-center -mt-6 px-3"
          aria-label={tr.home.addNew}
        >
          <div className="w-14 h-14 rounded-full bg-dark flex items-center justify-center shadow-lg shadow-dark/30">
            <Plus size={26} strokeWidth={2.5} className="text-white" />
          </div>
        </Link>

        {ITEMS.slice(2).map(renderItem)}
      </div>
    </nav>
  )
}
