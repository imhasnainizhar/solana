import type { Block } from 'payload'

import { anchorField, backgroundField } from '@/blocks/shared/fields'

/** Email capture (waitlist / newsletter) that stores sign-ups in the `subscribers` collection. */
export const Newsletter: Block = {
  slug: 'newsletter',
  interfaceName: 'NewsletterBlock',
  labels: { singular: 'Newsletter / waitlist', plural: 'Newsletters / waitlists' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'Join the waitlist to be the first to try Aura One.',
    },
    { name: 'body', type: 'textarea' },
    {
      type: 'row',
      fields: [
        { name: 'placeholder', type: 'text', defaultValue: 'Enter your email', admin: { width: '33%' } },
        { name: 'buttonLabel', type: 'text', defaultValue: 'Join waitlist', admin: { width: '33%' } },
        {
          name: 'source',
          type: 'text',
          defaultValue: 'waitlist',
          admin: { width: '33%', description: 'Saved with each sign-up.' },
        },
      ],
    },
    {
      name: 'successMessage',
      type: 'text',
      defaultValue: "You're on the list. We'll be in touch.",
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'minimal',
      options: [
        { label: 'Minimal (underlined field)', value: 'minimal' },
        { label: 'Centered card', value: 'card' },
      ],
    },
    backgroundField('stone'),
    anchorField,
  ],
}
