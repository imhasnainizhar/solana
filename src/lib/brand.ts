/**
 * Placeholder brand identity. Owners rename the store via env (SITE_NAME /
 * COMPANY_NAME) and, from Phase 3, the Theme / Site settings global.
 */
export const brand = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || process.env.SITE_NAME || 'Solana Studio',
  /** tiny lowercase wordmark shown in the navbar */
  wordmark: (process.env.NEXT_PUBLIC_SITE_WORDMARK || 'solana').toLowerCase(),
  company: process.env.COMPANY_NAME || 'Solana Studio',
  flagship: 'Aura One',
  description:
    'Solana Studio makes Aura One — a calm, considered object for everyday focus. Designed in small batches.',
} as const

export const siteTitle = (title?: string | null) =>
  title && title !== brand.name ? `${title} — ${brand.name}` : brand.name
