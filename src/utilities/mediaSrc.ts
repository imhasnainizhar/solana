import type { Media } from '@/payload-types'

export type ImageData = {
  src: string
  alt: string
  width?: number
  height?: number
  focalX?: number
  focalY?: number
}

/**
 * Normalises an upload field value into props for next/image. URLs stay
 * relative (`/api/media/file/…`) so they match `images.localPatterns` and work
 * on any host/port; absolute URLs (Vercel Blob, remote) are passed through.
 */
export const mediaSrc = (resource?: Media | number | string | null, fallbackAlt = ''): ImageData | null => {
  if (!resource || typeof resource !== 'object' || !resource.url) return null
  let src = resource.url
  const server = process.env.NEXT_PUBLIC_SERVER_URL
  if (server && src.startsWith(server)) src = src.slice(server.length) || '/'
  return {
    src,
    alt: resource.alt || fallbackAlt,
    width: resource.width ?? undefined,
    height: resource.height ?? undefined,
    focalX: resource.focalX ?? undefined,
    focalY: resource.focalY ?? undefined,
  }
}

/** CSS object-position from Payload's focal point (percentages). */
export const focalPosition = (img?: ImageData | null) =>
  img && typeof img.focalX === 'number' && typeof img.focalY === 'number'
    ? `${img.focalX}% ${img.focalY}%`
    : undefined
