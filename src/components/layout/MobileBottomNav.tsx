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
        aria-current={active ? 'page' : undefined}
        className={`flex items-center gap-2 h-11 rounded-full transition-all duration-300 ${
          active ? 'bg-white/12 px-4' : 'px-3'
        }`}
      >
        <Icon
          size={21}
          strokeWidth={active ? 2.3 : 1.9}
          className={active ? 'text-green-bright' : 'text-white/55'}
        />
        {active && (
          <span className="text-[13px] font-medium text-white whitespace-nowrap">
            {tr.nav[item.key]}
          </span>
        )}
      </Link>
    )
  }

  return (
    <nav className="lg:hidden fixed inset-x-0 bottom-safe z-40 flex justify-center px-5">
      <div className="flex items-center gap-1 bg-dark/95 backdrop-blur-md rounded-full p-1.5 shadow-float">
        {ITEMS.slice(0, 2).map(renderItem)}

        <Link
          href="/transactions/new"
          className="mx-0.5 w-12 h-12 rounded-full bg-green-bright flex items-center justify-center fab-glow active:scale-90 transition-transform"
          aria-label={tr.home.addNew}
        >
          <Plus size={24} strokeWidth={2.5} className="text-ink" />
        </Link>

        {ITEMS.slice(2).map(renderItem)}
      </div>
    </nav>
  )
}
