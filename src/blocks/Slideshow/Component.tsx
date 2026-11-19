import type { SlideshowBlock as Props } from '@/payload-types'

import React from 'react'

import { SlideshowClient } from './Component.client'

export function SlideshowBlock(props: Props & { id?: string }) {
  if (!props.slides?.length) return null
  return <SlideshowClient {...props} />
}
