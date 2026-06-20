import type { Metadata } from 'next'
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
    <html lang="uz">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap"
        />
      </head>
      <body>
        <OnboardingGuard>
          <ResponsiveShellWrapper>{children}</ResponsiveShellWrapper>
        </OnboardingGuard>
      </body>
    </html>
  )
}
