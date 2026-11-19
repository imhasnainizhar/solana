import type { Field } from 'payload'

/** Section background options shared by the storefront blocks (values map to design tokens). */
export const backgroundField = (defaultValue: SectionBackground = 'cream'): Field => ({
  name: 'background',
  type: 'select',
  defaultValue,
  admin: { description: 'Section background (from the theme palette).' },
  options: [
    { label: 'Cream', value: 'cream' },
    { label: 'Sand', value: 'sand' },
    { label: 'Stone', value: 'stone' },
    { label: 'Dark', value: 'dark' },
  ],
})

export type SectionBackground = 'cream' | 'sand' | 'stone' | 'dark'

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
