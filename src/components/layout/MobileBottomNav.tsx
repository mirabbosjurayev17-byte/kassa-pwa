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
        className={`group flex items-center h-11 rounded-full overflow-hidden transition-[background-color,padding] duration-300 ease-out ${
          active ? 'bg-white/12 px-4' : 'px-3.5 active:bg-white/5'
        }`}
      >
        <Icon
          size={21}
          strokeWidth={active ? 2.3 : 1.9}
          className={`flex-shrink-0 transition-colors duration-300 ${
            active ? 'text-green-bright' : 'text-white/55 group-active:text-white/80'
          }`}
        />
        <span
          className={`whitespace-nowrap text-[13px] font-medium text-white transition-all duration-300 ease-out ${
            active ? 'max-w-[100px] opacity-100 ml-2' : 'max-w-0 opacity-0 ml-0'
          }`}
        >
          {tr.nav[item.key]}
        </span>
      </Link>
    )
  }

  return (
    <nav className="lg:hidden fixed inset-x-0 bottom-safe z-40 flex justify-center px-5">
      <div className="flex items-center gap-1 bg-dark/95 backdrop-blur-md rounded-full p-1.5 shadow-float">
        {ITEMS.slice(0, 2).map(renderItem)}

        <Link
          href="/transactions/new"
          className="mx-0.5 w-12 h-12 rounded-full bg-green-bright flex items-center justify-center fab-glow hover:brightness-105 active:scale-90 transition-all duration-200"
          aria-label={tr.home.addNew}
        >
          <Plus size={24} strokeWidth={2.5} className="text-ink" />
        </Link>

        {ITEMS.slice(2).map(renderItem)}
      </div>
    </nav>
  )
}
