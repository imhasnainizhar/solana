import { DEFAULT_FONT_PAIRING, type FontPairingSlug, fontPairings } from './fontPairings'
import { DEFAULT_PRESET, isPreset, type Palette, presets } from './presets'

/**
 * Turns the `theme` global into CSS custom properties on :root.
 *
 * Pure + isomorphic: the root layout renders the result into a <style> tag on
 * the server (no flash), and the live-preview listener re-runs it in the
 * browser while an admin edits the Theme global.
 */
export type ThemeSettings = {
  preset?: string | null
  colors?: Partial<
    Record<'background' | 'surface' | 'ink' | 'muted' | 'accent' | 'border', string | null>
  > | null
  fontPairing?: string | null
  radius?: string | null
  buttonShape?: string | null
  buttonStyle?: string | null
  density?: string | null
  heroOverlay?: string | null
  motion?: string | null
}

export type MotionLevel = 'full' | 'reduced' | 'off'

const RADIUS_SCALE: Record<string, number> = { none: 0, sm: 0.4, md: 0.7, lg: 1, full: 1.5 }
const DENSITY: Record<string, number> = { compact: 0.72, comfortable: 1, spacious: 1.3 }
const HERO_OVERLAY: Record<string, number> = { none: 0, light: 0.6, default: 1, strong: 1.4 }
const BUTTON_RADIUS: Record<string, string> = {
  pill: '999px',
  rounded: 'calc(12px * var(--sol-radius-scale))',
  square: '0px',
}

const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i
export const isHexColor = (v: unknown): v is string => typeof v === 'string' && HEX.test(v.trim())

/** Relative luminance of a #rgb/#rrggbb colour (WCAG). */
const luminance = (hex: string) => {
  let h = hex.trim().slice(1)
  if (h.length === 3) h = [...h].map((c) => c + c).join('')
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** Readable text colour on top of `bg`. */
export const contrastText = (bg: string, light = '#ffffff', dark = '#111111') =>
  luminance(bg) > 0.4 ? dark : light

export const resolvePalette = (
  theme?: ThemeSettings | null,
): Palette & { scheme: 'light' | 'dark' } => {
  const preset = presets[isPreset(theme?.preset) ? theme.preset : DEFAULT_PRESET]
  const p: Palette = { ...preset.palette }
  const o = theme?.colors || {}
  const pick = (k: keyof NonNullable<ThemeSettings['colors']>) =>
    isHexColor(o[k]) ? o[k]!.trim() : undefined

  const background = pick('background')
  const surface = pick('surface')
  const ink = pick('ink')
  const muted = pick('muted')
  const accent = pick('accent')
  const border = pick('border')

  if (background) {
    p.background = background
    p.paper = background
  }
  if (surface) p.surface = surface
  if (background || surface) p.surfaceAlt = `color-mix(in srgb, ${p.surface} 45%, ${p.background})`
  if (ink) {
    p.ink = ink
    p.subtle = `color-mix(in srgb, ${ink} 55%, ${p.background})`
  }
  if (muted) p.muted = muted
  if (border) p.border = border
  if (accent) {
    p.accent = accent
    p.onAccent = contrastText(accent)
  }

  const scheme = background ? (luminance(background) > 0.4 ? 'light' : 'dark') : preset.scheme
  return { ...p, scheme }
}

export const resolveMotion = (theme?: ThemeSettings | null): MotionLevel =>
  theme?.motion === 'reduced' || theme?.motion === 'off' ? theme.motion : 'full'

export const themeCssVars = (theme?: ThemeSettings | null): Record<string, string> => {
  const p = resolvePalette(theme)
  const pairing =
    fontPairings[(theme?.fontPairing as FontPairingSlug) || DEFAULT_FONT_PAIRING] ??
    fontPairings[DEFAULT_FONT_PAIRING]

  return {
    'color-scheme': p.scheme,
    '--sol-cream': p.background,
    '--sol-sand': p.surfaceAlt,
    '--sol-stone': p.surface,
    '--sol-paper': p.paper,
    '--sol-line': p.border,
    '--sol-ink': p.ink,
    '--sol-ink-soft': p.muted,
    '--sol-ink-muted': p.subtle,
    '--sol-hero': p.dark,
    '--sol-on-hero': p.onDark,
    '--sol-accent': p.accent,
    '--sol-on-accent': p.onAccent,
    '--sol-accent-warm': p.highlight,
    '--sol-font-display': pairing.display,
    '--sol-font-sans': pairing.body,
    '--sol-tracking-display': pairing.displayTracking,
    '--sol-radius-scale': String(RADIUS_SCALE[theme?.radius || 'lg'] ?? 1),
    '--sol-radius-button': BUTTON_RADIUS[theme?.buttonShape || 'pill'] ?? BUTTON_RADIUS.pill,
    '--sol-density': String(DENSITY[theme?.density || 'comfortable'] ?? 1),
    '--sol-hero-overlay': String(HERO_OVERLAY[theme?.heroOverlay || 'default'] ?? 1),
  }
}

/** `:root { … }` rule for the theme (safe to inline: values are whitelisted/validated). */
export const buildThemeCss = (theme?: ThemeSettings | null) => {
  const body = Object.entries(themeCssVars(theme))
    .map(([k, v]) => `${k}:${v}`)
    .join(';')
  // Outline buttons: higher specificity than motion.css' `.sol-btn-*` rules.
  const outline =
    theme?.buttonStyle === 'outline'
      ? ':root .sol-btn-primary{background:transparent;color:var(--sol-ink);box-shadow:inset 0 0 0 1.5px currentColor}' +
        ':root .sol-btn-primary:hover{background:var(--sol-ink);color:var(--sol-cream)}' +
        ':root .sol-btn-light{background:transparent;color:var(--sol-on-hero);box-shadow:inset 0 0 0 1.5px currentColor}' +
        ':root .sol-btn-light:hover{background:var(--sol-on-hero);color:var(--sol-hero)}'
      : ''
  return `:root{${body}}${outline}`
}

/** Browser UI colour (viewport `themeColor`). */
export const themeColor = (theme?: ThemeSettings | null) => {
  const p = resolvePalette(theme)
  return p.background.startsWith('#') ? p.background : presets[DEFAULT_PRESET].palette.background
}
