'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BarChart3, ListOrdered, FolderTree, Users, Settings } from 'lucide-react'
import { useKassaStore } from '@/store/useKassaStore'

const MAIN_ITEMS = [
  { href: '/', label: 'Bosh sahifa', icon: Home },
  { href: '/reports', label: 'Hisobotlar', icon: BarChart3 },
  { href: '/transactions', label: 'Yozuvlar', icon: ListOrdered },
  { href: '/categories', label: 'Kategoriyalar', icon: FolderTree },
  { href: '/staff', label: 'Xodimlar', icon: Users },
]

export function DesktopSidebar() {
  const pathname = usePathname()
  const businessName = useKassaStore((s) => s.settings.businessName)
  const location = useKassaStore((s) => s.settings.location)

  return (
    <aside className="hidden lg:flex w-64 bg-surface border-r border-border flex-col flex-shrink-0 sticky top-0 h-screen">
      {/* Logo */}
      <div className="px-6 py-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-ink flex items-center justify-center flex-shrink-0">
            <span className="text-blue font-black text-lg leading-none">K</span>
          </div>
          <div className="min-w-0">
            <p className="font-black text-lg leading-none">Kassa</p>
            <p className="text-xs text-mute font-medium mt-1 truncate">
              {businessName} · {location}
            </p>
          </div>
        </div>
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
                  ? 'bg-ink text-white'
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
              ? 'bg-ink text-white'
              : 'text-mute hover:bg-subtle'
          }`}
        >
          <Settings size={18} strokeWidth={2} />
          <span className="text-sm font-medium">Sozlamalar</span>
        </Link>
      </div>
    </aside>
  )
}
