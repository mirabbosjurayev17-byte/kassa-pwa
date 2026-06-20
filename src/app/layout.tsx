import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'
import { OnboardingGuard } from '@/components/OnboardingGuard'
import { ResponsiveShellWrapper } from '@/components/layout/ResponsiveShellWrapper'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
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
    <html lang="uz" className={dmSans.variable}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#141F14" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Kassa" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className={`${dmSans.className} bg-base`}>
        <OnboardingGuard>
          <ResponsiveShellWrapper>{children}</ResponsiveShellWrapper>
        </OnboardingGuard>
      </body>
    </html>
  )
}
