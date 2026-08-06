import { StreamLanguage, type StreamParser } from '@codemirror/language'
import { Tag } from '@lezer/highlight'

/**
 * Keyword list copied from the compiler's own semantic-token classifier
 * (crates/lab-ide/src/semantic.rs `KEYWORDS`, sibling `lab` checkout) so
 * this grammar never drifts from what the real engine considers a keyword.
 * Notably this does NOT include `layout` — it reads like a keyword inside a
 * `circuit` block but is an ordinary declaration property name.
 */
const KEYWORDS = new Set([
  'use',
  'circuit',
  'plasmid',
  'record',
  'material',
  'observation',
  'evidence',
  'event',
  'outcome',
  'workflow',
  'input',
  'output',
  'state',
  'require',
  'accept',
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

const QUANTITY_UNIT = /^(?:ng\/uL|uL|bp|kb|min|h|C)\b/

/** Highlight tag for `<-`, the durable-effect operator, kept visually distinct from `->`. */
export const durableEffectTag = Tag.define()

interface StreamState {
  inBlockComment: boolean
}

const labStreamParser: StreamParser<StreamState> = {
  startState: () => ({ inBlockComment: false }),

  token(stream) {
    if (stream.eatSpace()) return null

    if (stream.match('#')) {
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
    if (stream.match(/^(?:->|==|>=|<=)/)) return 'operator'

    if (stream.match(/^\d+(?:\.\d+)?/)) {
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
