import { StateEffect, StateField } from '@codemirror/state'
import { Decoration, EditorView, type DecorationSet } from '@codemirror/view'
import type { SemanticToken, SemanticTokenKind } from '../lab-engine/types'

/**
 * Decorations sourced from the real compiler's semantic tokens, layered
 * over the syntax-only StreamLanguage guess once analysis resolves. This is
 * what corrects the one thing a capitalization heuristic cannot get right:
 * capitalized inventory identifiers like `DH5alpha` are values, not types
 * once bound with `= strain(...)` (lab-ide/src/workspace.rs's own test
 * suite asserts exactly this).
 *
 * These decorations and the base StreamLanguage highlighting both produce
 * "mark" spans over the same range, and CodeMirror nests the syntax-level
 * span *inside* this one — so an inherited `color` here would lose to the
 * inner span's own explicit color. `!important` classes sidestep that,
 * regardless of nesting order.
 */
const KIND_CLASS: Record<SemanticTokenKind, string> = {
  comment: 'cm-lab-semantic-comment',
  keyword: 'cm-lab-semantic-keyword',
  string: 'cm-lab-semantic-string',
  number: 'cm-lab-semantic-number',
  type: 'cm-lab-semantic-type',
  function: 'cm-lab-semantic-function',
  variable: 'cm-lab-semantic-variable',
  operator: 'cm-lab-semantic-operator',
}

export const semanticTokenTheme = EditorView.baseTheme({
  '.cm-lab-semantic-comment': { color: '#8a7458 !important', fontStyle: 'italic' },
  '.cm-lab-semantic-keyword': { color: '#eaa54a !important' },
  '.cm-lab-semantic-string': { color: '#cbb98a !important' },
  '.cm-lab-semantic-number': { color: '#f2708f !important' },
  '.cm-lab-semantic-type': { color: '#6fd0dd !important' },
  '.cm-lab-semantic-function': { color: '#6fd0dd !important' },
  '.cm-lab-semantic-variable': { color: '#f2e8db !important' },
  '.cm-lab-semantic-operator': { color: '#eaa54a !important' },
})

export const setSemanticTokens = StateEffect.define<SemanticToken[]>()

export const semanticTokensField = StateField.define<DecorationSet>({
  create() {
    return Decoration.none
  },
  update(decorations, transaction) {
    let next = decorations.map(transaction.changes)
    for (const effect of transaction.effects) {
      if (effect.is(setSemanticTokens)) {
        next = buildDecorations(effect.value)
      }
    }
    return next
  },
  provide: (field) => EditorView.decorations.from(field),
})

function buildDecorations(tokens: SemanticToken[]): DecorationSet {
  const sorted = [...tokens].sort((a, b) => a.span.start - b.span.start)
  const marks = sorted
    .filter((token) => token.span.end > token.span.start)
    .map((token) =>
      Decoration.mark({ class: KIND_CLASS[token.kind] }).range(token.span.start, token.span.end),
    )
  return Decoration.set(marks, true)
}

export function applySemanticTokens(view: EditorView, tokens: SemanticToken[]) {
  view.dispatch({ effects: setSemanticTokens.of(tokens) })
}
