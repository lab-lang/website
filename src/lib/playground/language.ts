import { StreamLanguage, type StreamParser } from '@codemirror/language'
import { Tag } from '@lezer/highlight'

/**
 * Keyword list copied from the compiler's own semantic-token classifier
 * (crates/lab-ide/src/semantic.rs `KEYWORDS`, sibling `lab` checkout) so
 * this grammar never drifts from what the real engine considers a keyword.
 * Notably this does NOT include `layout` — it reads like a keyword inside a
 * `circuit` block but is an ordinary declaration property name — nor any
 * artifact word such as `plasmid` or `strain`, which a package declares
 * rather than the grammar.
 */
const KEYWORDS = new Set([
  'use',
  'role',
  'build',
  'buy',
  'is',
  'any',
  'circuit',
  'artifact',
  'record',
  'workflow',
  'state',
  'require',
  'accept',
  'across',
  'declares',
  'if',
  'else',
  'for',
  'in',
  'match',
  'case',
  'return',
  'when',
  'every',
  'after',
  'emit',
  'and',
  'or',
  'not',
])

/**
 * A unit is a name, optionally over a denominator, rather than a word from a
 * fixed table: the parser reads `ng/uL` in `100 ng/uL` and in `Quantity<ng/uL>`
 * with one reader, and a package may measure in whatever it measures in.
 */
const QUANTITY_UNIT = /^[A-Za-z_][A-Za-z0-9_]*(?:\/[A-Za-z_][A-Za-z0-9_]*)?/

/** Highlight tag for `<-`, the durable-effect operator, kept visually distinct from `->`. */
export const durableEffectTag = Tag.define()

interface StreamState {
  inBlockComment: boolean
}

const labStreamParser: StreamParser<StreamState> = {
  startState: () => ({ inBlockComment: false }),

  token(stream, state) {
    // Documentation is `/** */` above a declaration and `/*! */` at the top of
    // a module. Both span lines, so the state carries across them; `/*` alone
    // opens neither, and there is no other block-comment form.
    if (state.inBlockComment) {
      while (!stream.eol()) {
        if (stream.match('*/')) {
          state.inBlockComment = false
          break
        }
        stream.next()
      }
      if (stream.eol() && state.inBlockComment) stream.skipToEnd()
      return 'comment'
    }

    if (stream.eatSpace()) return null

    if (stream.match(/^\/\*[*!]/)) {
      state.inBlockComment = true
      return 'comment'
    }

    if (stream.match('//')) {
      stream.skipToEnd()
      return 'comment'
    }

    if (stream.peek() === '"') {
      stream.next()
      while (!stream.eol()) {
        const character = stream.next()
        if (character === '\\') {
          stream.next()
          continue
        }
        if (character === '"') break
      }
      return 'string'
    }

    if (stream.match('<-')) return 'durableEffect'
    if (stream.match(/^(?:->|==|!=|>=|<=|\.\.)/)) return 'operator'

    if (stream.match(/^\d+(?:\.\d+)?/)) {
      stream.eatSpace()
      stream.match(QUANTITY_UNIT)
      return 'number'
    }

    if (stream.match(/^[A-Za-z_][A-Za-z0-9_]*/)) {
      const word = stream.current()
      if (KEYWORDS.has(word)) return 'keyword'
      // A syntax-only guess: capitalized identifiers are shown as a type
      // until the compiler's own semantic tokens correct this — Lab's
      // capitalization is not actually type-hood (see semantic-tokens.ts).
      if (/^[A-Z]/.test(word)) return 'typeName'
      return 'variableName'
    }

    stream.next()
    return null
  },

  tokenTable: {
    durableEffect: durableEffectTag,
  },
}

export function labLanguage() {
  return StreamLanguage.define(labStreamParser)
}
