import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import './globals.css'
import { OnboardingGuard } from '@/components/OnboardingGuard'
import { ResponsiveShellWrapper } from '@/components/layout/ResponsiveShellWrapper'

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
    <html lang="uz" className={GeistSans.variable}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0F172A" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Kassa" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className={GeistSans.className}>
        <OnboardingGuard>
          <ResponsiveShellWrapper>{children}</ResponsiveShellWrapper>
        </OnboardingGuard>
      </body>
    </html>
  )
}
