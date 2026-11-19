import React from 'react'

import type { CallToActionBlock as CTABlockProps } from '@/payload-types'
import { RichText } from '@/components/RichText'
import { ButtonLink } from '@/blocks/shared/ButtonLink'

export const CallToActionBlock: React.FC<
  CTABlockProps & {
    id?: string | number
    className?: string
  }
> = ({ links, richText }) => {
  return (
    <div className="sol-container">
      <div className="flex flex-col gap-8 rounded-[var(--sol-radius-xl)] bg-hero p-8 text-on-hero md:flex-row md:items-center md:justify-between md:p-14">
        <div className="max-w-3xl [&_.prose]:text-on-hero [&_h2]:font-display [&_h2]:tracking-[-0.03em] [&_h3]:font-display [&_p]:text-on-hero/75">
          {richText && <RichText className="mb-0 prose-invert" data={richText} enableGutter={false} />}
        </div>
        <div className="flex flex-wrap gap-3">
          {(links || []).map(({ link }, i) => (
            <ButtonLink key={i} link={link} tone="light" />
          ))}
        </div>
      </div>
    </div>
  )
}
