import type { ReactNode } from 'react'
import { MobileBottomNav } from './MobileBottomNav'
import { DesktopSidebar } from './DesktopSidebar'

export function ResponsiveShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <DesktopSidebar />

      <div className="flex-1 min-w-0 pb-32 lg:pb-0">
        {children}
      </div>

      <MobileBottomNav />
    </div>
  )
}
