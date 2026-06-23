'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useKassaStore } from '@/store/useKassaStore'
import { BrandSplash } from '@/components/system/BrandSplash'

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)
  const onboardingCompleted = useKassaStore(s => s.settings.onboardingCompleted)

  useEffect(() => {
    const isOnboarding = pathname.startsWith('/onboarding')

    if (!onboardingCompleted && !isOnboarding) {
      router.replace('/onboarding')
      return
    }
    if (onboardingCompleted && isOnboarding) {
      router.replace('/')
      return
    }
    setReady(true)
  }, [onboardingCompleted, pathname, router])

  if (!ready) {
    return <BrandSplash />
  }

  return <>{children}</>
}
