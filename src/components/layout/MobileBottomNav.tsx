'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLayoutEffect, useEffect, useRef, useState } from 'react'
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

  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const [pill, setPill] = useState<{ x: number; w: number; show: boolean }>({ x: 0, w: 0, show: false })

  const activeIndex = ITEMS.findIndex(i => i.href === pathname)

  const measure = () => {
    const el = itemRefs.current[activeIndex]
    if (el) setPill({ x: el.offsetLeft, w: el.offsetWidth, show: true })
    else setPill(p => ({ ...p, show: false }))
  }

  useLayoutEffect(measure, [activeIndex, pathname])
  useEffect(() => {
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex])

  const renderItem = (item: (typeof ITEMS)[number], index: number) => {
    const active = pathname === item.href
    const Icon = item.icon
    return (
      <Link
        key={item.href}
        ref={el => { itemRefs.current[index] = el }}
        href={item.href}
        aria-current={active ? 'page' : undefined}
        aria-label={tr.nav[item.key]}
        className="relative z-10 w-12 h-11 flex items-center justify-center"
      >
        <Icon
          size={22}
          strokeWidth={active ? 2.3 : 1.9}
          className={`transition-all duration-300 ${
            active ? 'text-green-bright scale-110' : 'text-white/50'
          }`}
        />
      </Link>
    )
  }

  return (
    <nav className="lg:hidden fixed inset-x-0 bottom-safe z-40 flex justify-center px-5">
      <div className="relative flex items-center gap-1 bg-dark/95 backdrop-blur-md rounded-full p-1.5 shadow-float">
        {/* Gliding active indicator */}
        <span
          aria-hidden
          className="absolute inset-y-1.5 left-0 rounded-full bg-white/12"
          style={{
            width: pill.w,
            transform: `translateX(${pill.x}px)`,
            opacity: pill.show ? 1 : 0,
            transition: 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), width 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease',
          }}
        />

        {ITEMS.slice(0, 2).map((it, i) => renderItem(it, i))}

        <Link
          href="/transactions/new"
          className="relative z-10 mx-0.5 w-12 h-12 rounded-full bg-green-bright flex items-center justify-center fab-glow hover:brightness-105 active:scale-90 transition-all duration-200"
          aria-label={tr.home.addNew}
        >
          <Plus size={24} strokeWidth={2.5} className="text-ink" />
        </Link>

        {ITEMS.slice(2).map((it, i) => renderItem(it, i + 2))}
      </div>
    </nav>
  )
}
