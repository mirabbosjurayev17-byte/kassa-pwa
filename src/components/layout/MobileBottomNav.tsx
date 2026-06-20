'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BarChart3, Plus, ListOrdered, User } from 'lucide-react'

type NavItem = {
  href: string
  label: string
  icon: typeof Home
}

const ITEMS: NavItem[] = [
  { href: '/', label: 'Bosh', icon: Home },
  { href: '/reports', label: 'Hisobot', icon: BarChart3 },
  { href: '/transactions', label: 'Yozuvlar', icon: ListOrdered },
  { href: '/settings', label: 'Profil', icon: User },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-40">
      <div className="flex items-center justify-around px-2 pt-2 pb-6 max-w-md mx-auto">
        {/* Birinchi 2 ta */}
        {ITEMS.slice(0, 2).map((item) => {
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
                strokeWidth={active ? 2.5 : 2}
                className={active ? 'text-ink' : 'text-mute'}
              />
              <span className={`text-xs ${active ? 'font-bold text-ink' : 'font-medium text-mute'}`}>
                {item.label}
              </span>
            </Link>
          )
        })}

        {/* O'rta + tugma — floating */}
        <Link
          href="/transactions/new"
          className="flex flex-col items-center -mt-6 px-3"
          aria-label="Yangi yozuv qo'shish"
        >
          <div className="w-14 h-14 rounded-full bg-blue flex items-center justify-center shadow-lg shadow-blue/30">
            <Plus size={26} strokeWidth={3} className="text-white" />
          </div>
        </Link>

        {/* Qolgan 2 ta */}
        {ITEMS.slice(2).map((item) => {
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
                strokeWidth={active ? 2.5 : 2}
                className={active ? 'text-ink' : 'text-mute'}
              />
              <span className={`text-xs ${active ? 'font-bold text-ink' : 'font-medium text-mute'}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
