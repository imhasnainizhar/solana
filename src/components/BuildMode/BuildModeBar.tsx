'use client'
/* eslint-disable @next/next/no-html-link-for-pages -- /admin and /next/* are separate root layouts / route handlers: full page loads are intended */

import { cn } from '@/utilities/cn'
import {
  ChevronDown,
  Eye,
  EyeOff,
  LayoutGrid,
  Palette,
  PencilLine,
  SquareDashed,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { useBuildModeDoc } from './store'

type State = {
  admin: boolean
  draft?: boolean
  status?: 'published' | 'changed' | 'draft' | null
  user?: { email: string; name: string | null }
}

const STATUS: Record<NonNullable<State['status']>, { label: string; dot: string }> = {
  published: { label: 'Published', dot: 'bg-emerald-400' },
  changed: { label: 'Unpublished changes', dot: 'bg-amber-400' },
  draft: { label: 'Draft — not published', dot: 'bg-amber-400' },
}

const chip =
  'inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white'

/**
 * Storefront "Build mode" toolbar. Only rendered for admins — the role is checked
 * server-side by GET /next/build-mode — and hidden inside the admin live preview.
 */
export function BuildModeBar() {
  const doc = useBuildModeDoc()
  const pathname = usePathname()
  const [state, setState] = useState<State | null>(null)
  const [open, setOpen] = useState(true)
  const [outlines, setOutlines] = useState(false)

  useEffect(() => {
    if (window.self !== window.top) return // admin live preview already has the editor
    const params = new URLSearchParams()
    if (doc) {
      params.set('collection', doc.collection)
      params.set('id', String(doc.id))
    }
    const ctrl = new AbortController()
    fetch(`/next/build-mode?${params}`, { credentials: 'include', signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : { admin: false }))
      .then((s: State) => setState(s))
      .catch(() => {})
    return () => ctrl.abort()
  }, [doc, pathname])

  if (!state?.admin) return null

  const editHref = doc ? `/admin/collections/${doc.collection}/${doc.id}` : null
  const draftHref = `/next/build-mode/draft?enable=${state.draft ? 0 : 1}&path=${encodeURIComponent(pathname)}`
  const status = state.status ? STATUS[state.status] : null

  return (
    <>
      {outlines && doc ? <SectionOutlines doc={doc} /> : null}
      <div
        aria-label="Build mode"
        className="fixed inset-x-0 bottom-[calc(var(--sol-dock-h)+1.25rem)] z-[90] flex justify-center px-3 md:bottom-5 print:hidden"
        role="toolbar"
      >
        <div className="flex max-w-full items-center gap-1 overflow-x-auto rounded-full bg-[#141414]/95 p-1 text-white shadow-[0_12px_40px_-12px_rgb(0_0_0/0.5)] ring-1 ring-white/10 backdrop-blur-md sol-rail">
          <button
            aria-expanded={open}
            className={cn(chip, 'pl-2 font-semibold')}
            onClick={() => setOpen((o) => !o)}
            type="button"
          >
            <span className="grid h-5 w-5 place-items-center rounded-full bg-white text-[11px] font-bold text-black">
              S
            </span>
            Build mode
            <ChevronDown
              aria-hidden
              className={cn('h-3.5 w-3.5 transition-transform', !open && '-rotate-90')}
            />
          </button>

          {open && (
            <>
              {status && (
                <span className="inline-flex h-8 items-center gap-1.5 whitespace-nowrap px-2 text-[13px] text-white/75">
                  <span aria-hidden className={cn('h-2 w-2 rounded-full', status.dot)} />
                  {status.label}
                </span>
              )}
              <a
                className={cn(chip, state.draft && 'bg-amber-400/20 text-amber-200')}
                href={draftHref}
                title={
                  state.draft
                    ? 'Showing latest drafts — click for the live site'
                    : 'Preview unpublished drafts'
                }
              >
                {state.draft ? (
                  <Eye aria-hidden className="h-4 w-4" />
                ) : (
                  <EyeOff aria-hidden className="h-4 w-4" />
                )}
                {state.draft ? 'Draft preview' : 'Live'}
              </a>
              {editHref && (
                <a className={chip} href={editHref}>
                  <PencilLine aria-hidden className="h-4 w-4" />
                  Edit {doc?.collection === 'products' ? 'product' : 'page'}
                </a>
              )}
              {doc && (
                <button
                  aria-pressed={outlines}
                  className={cn(chip, outlines && 'bg-white text-black hover:bg-white/90')}
                  onClick={() => setOutlines((v) => !v)}
                  type="button"
                >
                  <SquareDashed aria-hidden className="h-4 w-4" />
                  Sections
                </button>
              )}
              <a className={chip} href="/admin/globals/theme">
                <Palette aria-hidden className="h-4 w-4" />
                Theme
              </a>
              <a className={chip} href="/admin" title={state.user?.email}>
                <LayoutGrid aria-hidden className="h-4 w-4" />
                Admin
              </a>
            </>
          )}
        </div>
      </div>
    </>
  )
}

type Target = { index: number; label: string; rect: DOMRect }

/** Hover outlines for page sections (blocks rendered with `data-sol-block`) + "Edit section" deep links. */
function SectionOutlines({ doc }: { doc: { collection: string; id: number | string } }) {
  const [target, setTarget] = useState<Target | null>(null)
  const el = useRef<HTMLElement | null>(null)
  const overlay = useRef<HTMLDivElement>(null)

  const measure = useCallback(() => {
    const node = el.current
    if (!node) return setTarget(null)
    setTarget({
      index: Number(node.dataset.solBlock),
      label: node.dataset.solBlockLabel || 'Section',
      rect: node.getBoundingClientRect(),
    })
  }, [])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const t = e.target as Element | null
      if (t && overlay.current?.contains(t)) return
      const block = (t?.closest?.('[data-sol-block]') as HTMLElement | null) ?? null
      if (block !== el.current) {
        el.current = block
        measure()
      }
    }
    document.addEventListener('mouseover', onMove)
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      document.removeEventListener('mouseover', onMove)
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [measure])

  if (!target) return null
  const { rect } = target
  const top = Math.max(rect.top, 0)

  return (
    <div
      className="pointer-events-none fixed z-[85] outline-2 -outline-offset-2 outline-dashed outline-[#4f7cff]"
      ref={overlay}
      style={{
        height: Math.min(rect.bottom, window.innerHeight) - top,
        left: rect.left,
        top,
        width: rect.width,
      }}
    >
      <a
        className="pointer-events-auto absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-[#4f7cff] px-3 py-1.5 text-[12px] font-medium text-white shadow-lg hover:bg-[#3b67ea]"
        href={`/admin/collections/${doc.collection}/${doc.id}#layout-row-${target.index}`}
      >
        <PencilLine aria-hidden className="h-3.5 w-3.5" />
        Edit section · {target.label}
      </a>
    </div>
  )
}
