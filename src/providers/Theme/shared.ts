import type { Theme } from './types'

export const themeLocalStorageKey = 'payload-theme'

export const defaultTheme = 'light'

/**
 * The storefront palette is token-driven (tokens.css) and does not follow the OS
 * dark-mode preference; Phase 3 theme presets replace this mechanism.
 */
export const getImplicitPreference = (): Theme | null => defaultTheme
