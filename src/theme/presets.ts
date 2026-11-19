/**
 * Theme presets — complete colour palettes for the storefront.
 *
 * Each key maps onto a `--sol-*` design token from `app/(app)/tokens.css`:
 * background → --sol-cream, surface → --sol-stone, surfaceAlt → --sol-sand,
 * paper → --sol-paper, ink → --sol-ink, muted → --sol-ink-soft,
 * subtle → --sol-ink-muted, border → --sol-line, dark → --sol-hero,
 * onDark → --sol-on-hero, accent → --sol-accent, onAccent → --sol-on-accent,
 * highlight → --sol-accent-warm.
 *
 * Pure data (no server imports) so the admin + live-preview client can reuse it.
 */
export type Palette = {
  background: string
  surface: string
  surfaceAlt: string
  paper: string
  ink: string
  muted: string
  subtle: string
  border: string
  dark: string
  onDark: string
  accent: string
  onAccent: string
  highlight: string
}

export type PresetSlug = 'sabi-cream' | 'midnight' | 'stone' | 'sage' | 'noir'

export type Preset = {
  label: string
  /** Light/dark hint (browser chrome colour, `color-scheme`). */
  scheme: 'light' | 'dark'
  palette: Palette
}

export const presets: Record<PresetSlug, Preset> = {
  'sabi-cream': {
    label: 'Sabi Cream',
    scheme: 'light',
    palette: {
      background: '#faf7f1',
      surface: '#ede8e0',
      surfaceAlt: '#f3ede8',
      paper: '#fffdf9',
      ink: '#1d1c18',
      muted: '#6e6e64',
      subtle: '#9a978c',
      border: '#dcd5c8',
      dark: '#0b0b0a',
      onDark: '#f7f4ee',
      accent: '#283746',
      onAccent: '#f7f4ee',
      highlight: '#e1643c',
    },
  },
  midnight: {
    label: 'Midnight',
    scheme: 'dark',
    palette: {
      background: '#0e1014',
      surface: '#1b1e25',
      surfaceAlt: '#14171c',
      paper: '#1a1d23',
      ink: '#eceae4',
      muted: '#a4a39c',
      subtle: '#77766f',
      border: '#2c3039',
      dark: '#050608',
      onDark: '#f2f1ec',
      accent: '#a9b8ff',
      onAccent: '#0e1014',
      highlight: '#ff8a5c',
    },
  },
  stone: {
    label: 'Stone',
    scheme: 'light',
    palette: {
      background: '#f4f4f2',
      surface: '#e3e3df',
      surfaceAlt: '#ebebe8',
      paper: '#fbfbfa',
      ink: '#1b1c1e',
      muted: '#64666a',
      subtle: '#93959a',
      border: '#cfcfca',
      dark: '#1b1c1e',
      onDark: '#f4f4f2',
      accent: '#3b4a5a',
      onAccent: '#f4f4f2',
      highlight: '#c2593b',
    },
  },
  sage: {
    label: 'Sage',
    scheme: 'light',
    palette: {
      background: '#f3f4ee',
      surface: '#dfe4d6',
      surfaceAlt: '#e9ece2',
      paper: '#fafbf7',
      ink: '#1f2a22',
      muted: '#5c695e',
      subtle: '#8b968c',
      border: '#c9d0bd',
      dark: '#16211a',
      onDark: '#eef1e8',
      accent: '#3f6b4a',
      onAccent: '#f3f4ee',
      highlight: '#c8793a',
    },
  },
  noir: {
    label: 'Noir (high contrast)',
    scheme: 'light',
    palette: {
      background: '#ffffff',
      surface: '#ececec',
      surfaceAlt: '#f5f5f5',
      paper: '#ffffff',
      ink: '#000000',
      muted: '#3a3a3a',
      subtle: '#5c5c5c',
      border: '#111111',
      dark: '#000000',
      onDark: '#ffffff',
      accent: '#000000',
      onAccent: '#ffffff',
      highlight: '#ff3b00',
    },
  },
}

export const DEFAULT_PRESET: PresetSlug = 'sabi-cream'

export const presetOptions = (Object.keys(presets) as PresetSlug[]).map((value) => ({
  label: presets[value].label,
  value,
}))

export const isPreset = (v: unknown): v is PresetSlug =>
  typeof v === 'string' && Object.prototype.hasOwnProperty.call(presets, v)
