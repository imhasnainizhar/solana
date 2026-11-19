import type { Field } from 'payload'

/** Section background options shared by the storefront blocks (values map to design tokens). */
export const backgroundField = (defaultValue: SectionBackground = 'cream'): Field => ({
  name: 'background',
  type: 'select',
  defaultValue,
  label: 'Color scheme',
  admin: {
    description:
      'Section colors come from the active theme (Settings → Theme): light = page background / alternate / surface, dark = inverse, accent = brand color.',
  },
  options: [
    { label: 'Light — background', value: 'cream' },
    { label: 'Light — alternate', value: 'sand' },
    { label: 'Light — surface', value: 'stone' },
    { label: 'Dark (inverse)', value: 'dark' },
    { label: 'Accent', value: 'accent' },
  ],
})

/** Stored values keep their original names (cream/sand/stone) for backwards compatibility. */
export type SectionBackground = 'cream' | 'sand' | 'stone' | 'dark' | 'accent'

/** Optional anchor id so menu links like `/#science` can scroll to a section. */
export const anchorField: Field = {
  name: 'anchor',
  type: 'text',
  admin: {
    description: 'Optional anchor id (letters, numbers, dashes) — link to it with "/#anchor".',
  },
  validate: (value: unknown) =>
    !value || /^[a-z0-9-]+$/i.test(String(value)) || 'Use letters, numbers and dashes only.',
}
