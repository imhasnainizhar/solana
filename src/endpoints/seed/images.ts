import type { File } from 'payload'

import sharp from 'sharp'

/**
 * Placeholder imagery for the seed:
 *  - photos are downloaded from picsum.photos with fixed seeds (stable across runs)
 *    and stored in the Media collection, so the storefront never hot-links them;
 *  - product "renders" are generated locally with sharp from SVG, so the catalog
 *    looks deliberate without shipping third-party product photos.
 * Every download falls back to a generated gradient if the network is unavailable.
 */

const toFile = (data: Buffer, name: string, mimetype: string): File => ({
  name,
  data,
  mimetype,
  size: data.byteLength,
})

const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7)

/** Warm, muted gradient used when a photo cannot be downloaded. */
async function gradientFallback(seed: string, w: number, h: number): Promise<File> {
  const n = hash(seed)
  const hues = [28, 36, 18, 200, 140, 12, 45]
  const a = hues[n % hues.length]
  const b = hues[(n >> 3) % hues.length]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0" stop-color="hsl(${a} 28% 62%)"/><stop offset="1" stop-color="hsl(${b} 22% 28%)"/></linearGradient>
  <radialGradient id="r" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="#fff" stop-opacity="0.35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
  <rect width="100%" height="100%" fill="url(#g)"/><rect width="100%" height="100%" fill="url(#r)"/></svg>`
  const data = await sharp(Buffer.from(svg)).jpeg({ quality: 82 }).toBuffer()
  return toFile(data, `${seed}.jpg`, 'image/jpeg')
}

export async function photo(seed: string, w: number, h: number): Promise<File> {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 20000)
    const res = await fetch(`https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}.jpg`, {
      signal: controller.signal,
    })
    clearTimeout(timer)
    if (!res.ok) throw new Error(String(res.status))
    const data = Buffer.from(await res.arrayBuffer())
    return toFile(data, `${seed}.jpg`, 'image/jpeg')
  } catch {
    return gradientFallback(seed, w, h)
  }
}

/** Download many photos with limited concurrency, preserving order. */
export async function photos(specs: { seed: string; w: number; h: number }[], concurrency = 6): Promise<File[]> {
  const out: File[] = new Array(specs.length)
  let i = 0
  await Promise.all(
    Array.from({ length: concurrency }, async () => {
      while (i < specs.length) {
        const k = i++
        out[k] = await photo(specs[k].seed, specs[k].w, specs[k].h)
      }
    }),
  )
  return out
}

export const finishes = {
  sand: { body: '#d8c9b2', shade: '#a8967b', light: '#f3ead9', bg: ['#efe8dc', '#dcd2c2'] },
  graphite: { body: '#45443f', shade: '#232320', light: '#77756d', bg: ['#e7e2da', '#cfc8bc'] },
  moss: { body: '#7c8669', shade: '#4e5641', light: '#a9b296', bg: ['#e9e7dc', '#d2d1c0'] },
} as const
export type Finish = keyof typeof finishes

type Shape = 'pebble' | 'pebble-side' | 'dock' | 'case' | 'band' | 'detail'

/** Studio-style product render: soft backdrop, floor shadow and a shaded object. */
export async function render(shape: Shape, finish: Finish, name: string, w = 1200, h = 1500): Promise<File> {
  const f = finishes[finish]
  const cx = w / 2
  const cy = h * 0.52
  let object = ''
  switch (shape) {
    case 'pebble':
      object = `<ellipse cx="${cx}" cy="${cy}" rx="${w * 0.27}" ry="${w * 0.25}" fill="url(#body)"/>
        <ellipse cx="${cx}" cy="${cy}" rx="${w * 0.27}" ry="${w * 0.25}" fill="url(#spec)"/>
        <circle cx="${cx}" cy="${cy}" r="${w * 0.055}" fill="none" stroke="${f.light}" stroke-opacity="0.85" stroke-width="5"/>
        <circle cx="${cx}" cy="${cy}" r="${w * 0.012}" fill="${f.light}"/>`
      break
    case 'pebble-side':
      object = `<rect x="${cx - w * 0.3}" y="${cy - w * 0.08}" width="${w * 0.6}" height="${w * 0.16}" rx="${w * 0.08}" fill="url(#body)"/>
        <rect x="${cx - w * 0.3}" y="${cy - w * 0.08}" width="${w * 0.6}" height="${w * 0.16}" rx="${w * 0.08}" fill="url(#spec)"/>
        <rect x="${cx - w * 0.06}" y="${cy - w * 0.088}" width="${w * 0.12}" height="6" rx="3" fill="${f.light}" opacity="0.9"/>`
      break
    case 'dock':
      object = `<rect x="${cx - w * 0.3}" y="${cy - w * 0.05}" width="${w * 0.6}" height="${w * 0.12}" rx="${w * 0.05}" fill="url(#body)"/>
        <ellipse cx="${cx}" cy="${cy - w * 0.05}" rx="${w * 0.18}" ry="${w * 0.035}" fill="${f.shade}" opacity="0.6"/>
        <rect x="${cx - w * 0.3}" y="${cy - w * 0.05}" width="${w * 0.6}" height="${w * 0.12}" rx="${w * 0.05}" fill="url(#spec)"/>`
      break
    case 'case':
      object = `<rect x="${cx - w * 0.2}" y="${cy - w * 0.3}" width="${w * 0.4}" height="${w * 0.6}" rx="${w * 0.2}" fill="url(#body)"/>
        <rect x="${cx - w * 0.2}" y="${cy - w * 0.3}" width="${w * 0.4}" height="${w * 0.6}" rx="${w * 0.2}" fill="url(#spec)"/>
        <line x1="${cx - w * 0.2}" x2="${cx + w * 0.2}" y1="${cy}" y2="${cy}" stroke="${f.shade}" stroke-width="4" opacity="0.7"/>`
      break
    case 'band':
      object = `<ellipse cx="${cx}" cy="${cy}" rx="${w * 0.28}" ry="${w * 0.2}" fill="none" stroke="url(#body)" stroke-width="${w * 0.07}"/>
        <ellipse cx="${cx}" cy="${cy}" rx="${w * 0.28}" ry="${w * 0.2}" fill="none" stroke="url(#spec)" stroke-width="${w * 0.07}"/>`
      break
    case 'detail':
      object = `<circle cx="${cx}" cy="${cy}" r="${w * 0.32}" fill="url(#body)"/>
        ${Array.from({ length: 6 }, (_, i) => `<circle cx="${cx}" cy="${cy}" r="${w * (0.05 + i * 0.045)}" fill="none" stroke="${f.light}" stroke-opacity="${0.75 - i * 0.1}" stroke-width="3"/>`).join('')}`
      break
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${f.bg[0]}"/><stop offset="1" stop-color="${f.bg[1]}"/></linearGradient>
    <radialGradient id="body" cx="0.35" cy="0.3" r="0.85"><stop offset="0" stop-color="${f.light}"/><stop offset="0.55" stop-color="${f.body}"/><stop offset="1" stop-color="${f.shade}"/></radialGradient>
    <radialGradient id="spec" cx="0.3" cy="0.22" r="0.35"><stop offset="0" stop-color="#fff" stop-opacity="0.45"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <radialGradient id="shadow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#000" stop-opacity="0.28"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <ellipse cx="${cx}" cy="${cy + w * 0.3}" rx="${w * 0.34}" ry="${w * 0.05}" fill="url(#shadow)"/>
  ${object}
  </svg>`
  const data = await sharp(Buffer.from(svg)).jpeg({ quality: 88 }).toBuffer()
  return toFile(data, `${name}.jpg`, 'image/jpeg')
}
