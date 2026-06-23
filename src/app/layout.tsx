import type { Metadata } from 'next'
import { Onest } from 'next/font/google'
import './globals.css'
import { OnboardingGuard } from '@/components/OnboardingGuard'
import { ResponsiveShellWrapper } from '@/components/layout/ResponsiveShellWrapper'

const onest = Onest({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500'],
  variable: '--font-onest',
})

export const metadata: Metadata = {
  title: 'Kassa — Kunlik savdo va xarajat trackeri',
  description: "Do'kon, kafe va ustaxonalar uchun kunlik kassa dasturi",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="uz" className={onest.variable}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#021B1A" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Kassa" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className={`${onest.className} bg-base`}>
        <OnboardingGuard>
          <ResponsiveShellWrapper>{children}</ResponsiveShellWrapper>
        </OnboardingGuard>
      </body>
    </html>
  )
}
