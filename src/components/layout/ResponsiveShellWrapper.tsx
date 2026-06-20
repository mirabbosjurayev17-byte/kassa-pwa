'use client'

import { usePathname } from 'next/navigation'
import { ResponsiveShell } from './ResponsiveShell'

export function ResponsiveShellWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isOnboarding = pathname.startsWith('/onboarding')

  if (isOnboarding) return <>{children}</>
  return <ResponsiveShell>{children}</ResponsiveShell>
}
