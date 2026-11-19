import type { SectionBackground } from './fields'

export const backgroundClass = (bg?: SectionBackground | null) => {
  switch (bg) {
    case 'sand':
      return 'bg-sand text-ink'
    case 'stone':
      return 'bg-stone text-ink'
    case 'dark':
      return 'bg-hero text-on-hero'
    default:
      return 'bg-cream text-ink'
  }
}

export const isDark = (bg?: SectionBackground | null) => bg === 'dark'
