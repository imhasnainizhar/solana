import type { SectionBackground } from './fields'

/**
 * Section colour schemes → theme palette tokens.
 * Dark and accent sections render with the "on dark" text tokens; the accent
 * scheme re-points them at the accent's contrast colour (see `.sol-scheme-accent`).
 */
export const backgroundClass = (bg?: SectionBackground | null) => {
  switch (bg) {
    case 'sand':
      return 'bg-sand text-ink'
    case 'stone':
      return 'bg-stone text-ink'
    case 'dark':
      return 'bg-hero text-on-hero'
    case 'accent':
      return 'sol-scheme-accent bg-brand text-on-brand'
    default:
      return 'bg-cream text-ink'
  }
}

/** True for schemes that use light text (dark + accent). */
export const isDark = (bg?: SectionBackground | null) => bg === 'dark' || bg === 'accent'
