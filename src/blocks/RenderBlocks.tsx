import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { BannerBlock } from '@/blocks/Banner/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { CarouselBlock } from '@/blocks/Carousel/Component'
import { CollectionBlock } from '@/blocks/Collection/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FeaturedProductBlock } from '@/blocks/FeaturedProduct/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { NewsletterBlock } from '@/blocks/Newsletter/Component'
import { PressBlock } from '@/blocks/Press/Component'
import { ProductIntroBlock } from '@/blocks/ProductIntro/Component'
import { SabiHeroBlock } from '@/blocks/SabiHero/Component'
import { SlideshowBlock } from '@/blocks/Slideshow/Component'
import { StepsBlock } from '@/blocks/Steps/Component'
import { ThreeItemGridBlock } from '@/blocks/ThreeItemGrid/Component'
import { toKebabCase } from '@/utilities/toKebabCase'
import React, { Fragment } from 'react'

import type { Page } from '../payload-types'

const blockComponents = {
  archive: ArchiveBlock,
  banner: BannerBlock,
  carousel: CarouselBlock,
  collection: CollectionBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  featuredProduct: FeaturedProductBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  newsletter: NewsletterBlock,
  press: PressBlock,
  productIntro: ProductIntroBlock,
  sabiHero: SabiHeroBlock,
  slideshow: SlideshowBlock,
  steps: StepsBlock,
  threeItemGrid: ThreeItemGridBlock,
}

const blockLabels: Record<string, string> = {
  collection: 'Collection',
  featuredProduct: 'Featured product',
  newsletter: 'Newsletter',
  press: 'Press',
  productIntro: 'Product intro',
  sabiHero: 'Hero',
  slideshow: 'Slideshow',
  steps: 'Steps',
}

/** Storefront blocks own their full-bleed section + spacing; legacy template blocks get vertical rhythm. */
const SECTION_BLOCKS = new Set<string>([
  'collection',
  'featuredProduct',
  'newsletter',
  'press',
  'productIntro',
  'sabiHero',
  'slideshow',
  'steps',
])

/** Blocks that sit under the floating navbar (no top offset needed when first on a page). */
export const FULL_BLEED_BLOCKS = new Set<string>(['sabiHero', 'slideshow'])

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockName, blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType] as React.ComponentType<Record<string, unknown>>
            const id = blockName ? toKebabCase(blockName) : undefined

            // data-sol-block* lets the build-mode bar outline sections and deep-link to them in the admin.
            const marker = {
              'data-sol-block': index,
              'data-sol-block-label': blockName || blockLabels[blockType] || blockType,
            }

            if (SECTION_BLOCKS.has(blockType)) {
              return (
                <div key={block.id || index} {...marker}>
                  <Block {...block} id={id} />
                </div>
              )
            }
            return (
              <div
                className="py-[calc(var(--sol-section-y)/2)]"
                key={block.id || index}
                {...marker}
              >
                <Block {...block} id={id} />
              </div>
            )
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
