import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { EditorView } from '@codemirror/view'
import { tags as t } from '@lezer/highlight'

import { durableEffectTag } from '@/lib/playground/language'

/**
 * Colors match the dark code panel already established in index.css and
 * source-code.tsx, so a CodeMirror instance sits in the page without a
 * visible seam.
 */
const COLOR = {
  base: '#f2e8db',
  comment: '#8a7458',
  keyword: '#eaa54a',
  type: '#6fd0dd',
  string: '#cbb98a',
  number: '#f2708f',
  durable: '#93e03f',
}

export const labHighlightStyle = HighlightStyle.define([
  { tag: t.comment, color: COLOR.comment, fontStyle: 'italic' },
  { tag: t.keyword, color: COLOR.keyword },
  { tag: t.operator, color: COLOR.keyword },
  { tag: t.typeName, color: COLOR.type },
  { tag: t.variableName, color: COLOR.base },
  { tag: t.string, color: COLOR.string },
  { tag: t.number, color: COLOR.number },
  { tag: durableEffectTag, color: COLOR.durable, fontWeight: 500 },
])

export const labEditorTheme = EditorView.theme(
  {
    '&': {
      color: COLOR.base,
      backgroundColor: 'transparent',
      height: '100%',
      fontSize: '13.5px',
    },
    '.cm-content': {
      fontFamily: 'var(--font-mono)',
      caretColor: 'var(--color-gfp)',
      paddingTop: '20px',
      paddingBottom: '20px',
      lineHeight: '1.6',
    },
    // Horizontal spacing lives on the line itself, not on .cm-content: padding
    // on the shared parent sits outside each .cm-line's own painted box, so
    // .cm-activeLine's background stopped short of the gutter, leaving an
    // unhighlighted notch at the seam. Padding on .cm-line paints with it.
    '.cm-line': {
      paddingLeft: '8px',
      paddingRight: '20px',
    },
    '.cm-cursor, .cm-dropCursor': {
      borderLeftColor: 'var(--color-gfp)',
    },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection':
      {
        backgroundColor:
          'color-mix(in oklab, var(--color-gfp) 25%, transparent)',
      },
    '.cm-activeLine': {
      backgroundColor: 'color-mix(in oklab, white 4%, transparent)',
    },
    '.cm-activeLineGutter': {
      backgroundColor: 'color-mix(in oklab, white 4%, transparent)',
    },
    '.cm-gutters': {
      backgroundColor: 'transparent',
      color: 'color-mix(in oklab, #f6ece0 30%, transparent)',
      border: 'none',
    },
    '.cm-lineNumbers .cm-gutterElement': {
      padding: '0 8px 0 14px',
    },
    '.cm-tooltip': {
      backgroundColor: 'var(--color-vessel-raised)',
      border: '1px solid color-mix(in oklab, white 12%, transparent)',
      borderRadius: '10px',
      color: COLOR.base,
      fontSize: '13px',
    },
    '.cm-tooltip.cm-tooltip-autocomplete > ul': {
      fontFamily: 'var(--font-mono)',
    },
    '.cm-diagnostic': {
      borderLeft: 'none',
    },
    '&.cm-focused': {
      outline: 'none',
    },
  },
  { dark: true },
)

export function labTheme() {
  return [labEditorTheme, syntaxHighlighting(labHighlightStyle)]
}
