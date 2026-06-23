'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Slim gradient progress bar that runs on first load and on every route change.
 * Gives the app a polished "loading" flourish without blocking content.
 */
export function TopProgressBar() {
  const pathname = usePathname()
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)
  const timers = useRef<number[]>([])

  useEffect(() => {
    timers.current.forEach(clearTimeout)
    setVisible(true)
    setProgress(8)
    const schedule = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms))
    timers.current = []
    schedule(() => setProgress(42), 90)
    schedule(() => setProgress(74), 260)
    schedule(() => setProgress(100), 540)
    schedule(() => setVisible(false), 780)
    schedule(() => setProgress(0), 940)
    return () => timers.current.forEach(clearTimeout)
  }, [pathname])

  return (
    <div
      aria-hidden
      className={`fixed inset-x-0 top-0 z-[100] h-[3px] transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className="h-full rounded-r-full bg-gradient-to-r from-green via-green-light to-green-bright transition-[width] duration-300 ease-out"
        style={{ width: `${progress}%`, boxShadow: '0 0 10px rgba(0,223,129,0.7)' }}
      />
    </div>
  )
}
