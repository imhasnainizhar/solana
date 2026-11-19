import { toFooterData } from '@/components/site/nav'
import { brand } from '@/lib/brand'
import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

/** Sabi-style minimal footer: tagline + link columns, © line, oversized wordmark. */
export async function Footer() {
  const footer = toFooterData(await getCachedGlobal('footer', 1)())
  const year = new Date().getFullYear()

  return (
    <footer className="overflow-hidden bg-[color-mix(in_srgb,var(--sol-ink-soft)_7%,var(--sol-cream))] pt-16 text-ink md:pt-20">
      <div className="sol-container">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_auto] md:gap-16">
          <div>
            <p className="max-w-[22em] text-[17px] leading-[1.35] tracking-[-0.015em]">
              {footer.tagline || brand.description}
            </p>
            <p className="mt-7 text-[13px] text-ink-soft">
              © {year} {footer.legal || brand.company}
            </p>
          </div>
          {footer.columns.length > 0 && (
            <nav
              aria-label="Footer"
              className="grid grid-cols-2 gap-8 sm:grid-cols-[repeat(var(--cols),minmax(7.5rem,auto))] md:gap-14"
              style={{ ['--cols' as string]: footer.columns.length }}
            >
              {footer.columns.map((col) => (
                <div key={col.title}>
                  <h2 className="sol-eyebrow mb-3.5">{col.title}</h2>
                  <ul className="-my-2 flex flex-col md:-my-1">
                    {col.links.map((l) => (
                      <li key={l.href + l.label}>
                        <Link
                          className="inline-block py-2 text-[15px] transition-opacity duration-200 hover:opacity-55 md:py-1"
                          href={l.href}
                          {...(l.newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          )}
        </div>
        {footer.showWordmark ? (
          <p
            aria-hidden
            className="mt-16 select-none whitespace-nowrap text-center font-display leading-[0.72] tracking-[-0.06em] text-ink md:mt-24"
            style={{ fontSize: 'clamp(5rem, 27vw, 26rem)', marginBottom: '-0.04em' }}
          >
            {brand.wordmark}
          </p>
        ) : (
          <div className="h-16" />
        )}
      </div>
      {/* room for the floating mobile dock */}
      <div className="h-[calc(var(--sol-dock-h)+1.5rem)] lg:hidden" />
    </footer>
  )
}
