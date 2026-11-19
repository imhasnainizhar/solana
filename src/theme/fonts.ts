import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { Fraunces, Instrument_Serif, Inter_Tight, Manrope, Space_Grotesk } from 'next/font/google'

/**
 * Every face used by a pairing in `./fontPairings.ts`. Each exposes a CSS
 * variable on <html>; browsers only download a face once a rule uses it, and
 * only the default pairing's faces are preloaded.
 */
const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-inter-tight',
  display: 'swap',
})
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-instrument-serif',
  display: 'swap',
  preload: false,
})
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  preload: false,
})
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  preload: false,
})
const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
  preload: false,
})

export const fontVariableClassName = [
  GeistSans.variable,
  GeistMono.variable,
  interTight.variable,
  instrumentSerif.variable,
  fraunces.variable,
  spaceGrotesk.variable,
  manrope.variable,
].join(' ')
