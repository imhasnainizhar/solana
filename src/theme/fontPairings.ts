/**
 * Curated font pairings. The faces are loaded with next/font in `./fonts.ts`
 * (self-hosted, only downloaded when a pairing uses them); this file only maps
 * a pairing to CSS font stacks so it can be shared with client code.
 */
export type FontPairingSlug =
  'modern' | 'editorial' | 'classic' | 'grotesk' | 'humanist' | 'technical'

const sans = 'ui-sans-serif, system-ui, sans-serif'
const serif = 'ui-serif, Georgia, serif'

export const fontPairings: Record<
  FontPairingSlug,
  { label: string; display: string; body: string; displayTracking: string }
> = {
  modern: {
    label: 'Modern — Inter Tight / Geist',
    display: `var(--font-inter-tight), var(--font-geist-sans), ${sans}`,
    body: `var(--font-geist-sans), ${sans}`,
    displayTracking: '-0.035em',
  },
  editorial: {
    label: 'Editorial — Instrument Serif / Geist',
    display: `var(--font-instrument-serif), ${serif}`,
    body: `var(--font-geist-sans), ${sans}`,
    displayTracking: '-0.02em',
  },
  classic: {
    label: 'Classic — Fraunces / Inter Tight',
    display: `var(--font-fraunces), ${serif}`,
    body: `var(--font-inter-tight), ${sans}`,
    displayTracking: '-0.03em',
  },
  grotesk: {
    label: 'Grotesk — Space Grotesk / Geist',
    display: `var(--font-space-grotesk), ${sans}`,
    body: `var(--font-geist-sans), ${sans}`,
    displayTracking: '-0.04em',
  },
  humanist: {
    label: 'Humanist — Manrope',
    display: `var(--font-manrope), ${sans}`,
    body: `var(--font-manrope), ${sans}`,
    displayTracking: '-0.035em',
  },
  technical: {
    label: 'Technical — Geist Mono / Geist',
    display: `var(--font-geist-mono), ui-monospace, monospace`,
    body: `var(--font-geist-sans), ${sans}`,
    displayTracking: '-0.05em',
  },
}

export const DEFAULT_FONT_PAIRING: FontPairingSlug = 'modern'

export const fontPairingOptions = (Object.keys(fontPairings) as FontPairingSlug[]).map((value) => ({
  label: fontPairings[value].label,
  value,
}))
