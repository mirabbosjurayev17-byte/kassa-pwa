import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import './globals.css'
import { OnboardingGuard } from '@/components/OnboardingGuard'
import { ResponsiveShellWrapper } from '@/components/layout/ResponsiveShellWrapper'
import { TopProgressBar } from '@/components/system/TopProgressBar'

export const metadata: Metadata = {
  title: 'Kassa — Kunlik savdo va xarajat trackeri',
  description: "Do'kon, kafe va ustaxonalar uchun kunlik kassa dasturi",
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'Kassa',
    statusBarStyle: 'default',
  },
  icons: {
    icon: '/icon.svg',
    apple: '/icons/icon-192.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#021B1A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="uz" className={GeistSans.variable}>
      <body className="bg-base">
        <TopProgressBar />
        <OnboardingGuard>
          <ResponsiveShellWrapper>{children}</ResponsiveShellWrapper>
        </OnboardingGuard>
      </body>
    </html>
  )
}
