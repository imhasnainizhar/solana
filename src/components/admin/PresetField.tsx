'use client'

import type { SelectFieldClientComponent } from 'payload'

import { FieldLabel, useField } from '@payloadcms/ui'
import React from 'react'

import { presets, type PresetSlug } from '@/theme/presets'

import './admin.scss'

/** Theme preset picker rendered as palette cards. */
export const PresetField: SelectFieldClientComponent = ({ field, path }) => {
  const { setValue, value } = useField<string>({ path })

  return (
    <div className="field-type sol-preset-field">
      <FieldLabel label={field.label} path={path} required={field.required} />
      <div className="sol-preset-field__grid" role="radiogroup">
        {(Object.keys(presets) as PresetSlug[]).map((slug) => {
          const { label, palette } = presets[slug]
          const active = (value || 'sabi-cream') === slug
          return (
            <button
              aria-checked={active}
              className="sol-preset-field__card"
              data-active={active}
              key={slug}
              onClick={() => setValue(slug)}
              role="radio"
              style={{
                background: palette.background,
                color: palette.ink,
                borderColor: palette.border,
              }}
              type="button"
            >
              <span className="sol-preset-field__name">{label}</span>
              <span className="sol-preset-field__swatches">
                {[
                  palette.surface,
                  palette.ink,
                  palette.accent,
                  palette.dark,
                  palette.highlight,
                ].map((c, i) => (
                  <span key={i} style={{ background: c }} />
                ))}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
