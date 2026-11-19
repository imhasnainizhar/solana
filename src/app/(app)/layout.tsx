import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import { BuildModeBar } from '@/components/BuildMode/BuildModeBar'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { brand } from '@/lib/brand'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { getServerSideURL } from '@/utilities/getURL'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { ThemeLivePreview } from '@/components/ThemeLivePreview'
import { buildThemeCss, resolveMotion, themeColor } from '@/theme/css'
import { fontVariableClassName } from '@/theme/fonts'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'
import './globals.css'

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

export async function generateViewport(): Promise<Viewport> {
  const theme = await getCachedGlobal('theme')()
  return { themeColor: themeColor(theme) }
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  // Theme global → CSS variables, rendered server-side so there is no flash.
  const theme = await getCachedGlobal('theme')()

  return (
    <html
      className={fontVariableClassName}
      data-motion={resolveMotion(theme)}
      data-theme="light"
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: buildThemeCss(theme) }} id="sol-theme" />
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
          <LivePreviewListener />
          <ThemeLivePreview />

          <Header />
          <main className="flex-1" id="main">
            {children}
          </main>
          <Footer />
          <BuildModeBar />
        </Providers>
      </body>
    </html>
  )
}
