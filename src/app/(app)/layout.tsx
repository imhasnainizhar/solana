import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { brand } from '@/lib/brand'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { getServerSideURL } from '@/utilities/getURL'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { Inter_Tight } from 'next/font/google'
import React from 'react'
import './globals.css'

/** Display face (headlines, wordmark) — a tight grotesk approximating sabi's Pangea. */
const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-inter-tight',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  title: {
    default: brand.name,
    template: `%s — ${brand.name}`,
  },
  description: brand.description,
  openGraph: mergeOpenGraph(),
  robots: { follow: true, index: true },
}

export const viewport: Viewport = {
  themeColor: '#faf7f1',
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      className={[GeistSans.variable, GeistMono.variable, interTight.variable].join(' ')}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <a
            className="sr-only z-[100] rounded-full bg-ink px-4 py-2 text-cream focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
            href="#main"
          >
            Skip to content
          </a>
          <AdminBar />
          <LivePreviewListener />

          <Header />
          <main className="flex-1" id="main">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
