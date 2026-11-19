'use client'

import type { TextFieldClientComponent } from 'payload'

import { FieldDescription, FieldError, FieldLabel, useField } from '@payloadcms/ui'
import React from 'react'

import './admin.scss'

/** Hex colour override: native colour picker + text input. Empty = use the preset colour. */
export const ColorField: TextFieldClientComponent = ({ field, path }) => {
  const { setValue, showError, value } = useField<string>({ path })
  const hex = typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value) ? value : '#000000'

  return (
    <div className="field-type text sol-color-field">
      <FieldLabel label={field.label} path={path} required={field.required} />
      <div className="sol-color-field__row">
        <input
          aria-label={`${typeof field.label === 'string' ? field.label : field.name} picker`}
          className="sol-color-field__swatch"
          data-empty={!value}
          onChange={(e) => setValue(e.target.value)}
          type="color"
          value={hex}
        />
        <input
          className="sol-color-field__input"
          onChange={(e) => setValue(e.target.value)}
          placeholder="Preset default"
          type="text"
          value={value || ''}
        />
        {value ? (
          <button className="sol-color-field__clear" onClick={() => setValue(null)} type="button">
            Reset
          </button>
        ) : null}
      </div>
      {showError ? <FieldError path={path} /> : null}
      <FieldDescription description={field.admin?.description} path={path} />
    </div>
  )
}
