import { SYNTAX_CLASSES } from '@/lib/syntax-colors'

export type SourceLanguage =
  'lab' | 'python' | 'ir' | 'markdown' | 'shell' | 'toml' | 'json' | 'text'

const CLASS = {
  base: SYNTAX_CLASSES.variable,
  variable: SYNTAX_CLASSES.variable,
  punctuation: SYNTAX_CLASSES.punctuation,
  comment: SYNTAX_CLASSES.comment,
  keyword: SYNTAX_CLASSES.keyword,
  type: SYNTAX_CLASSES.type,
  function: SYNTAX_CLASSES.function,
  string: SYNTAX_CLASSES.string,
  quantity: SYNTAX_CLASSES.number,
  durable: SYNTAX_CLASSES.durable,
} as const

/*
 * The compiler's own keyword list (crates/lab-ide/src/semantic.rs `KEYWORDS`).
 * No artifact word is in it: `plasmid` and `strain` are vocabulary a package
 * declares with `artifact`, not grammar, so they are coloured as the
 * declaration openers they are rather than as keywords. `layout` is absent for
 * the same reason: it is an ordinary property name inside a `circuit` block.
 */
const LAB_KEYWORDS =
  'use|role|build|buy|is|any|circuit|artifact|record|workflow|state|require|accept|across|declares|if|else|for|in|match|case|return|when|every|after|emit|and|or|not'

const PYTHON_KEYWORDS =
  'False|None|True|and|as|assert|async|await|break|case|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|match|nonlocal|not|or|pass|raise|return|try|while|with|yield'
const PYTHON_KEYWORD_SET = new Set(PYTHON_KEYWORDS.split('|'))

type PythonLexemeKind =
  'comment' | 'identifier' | 'number' | 'punctuation' | 'string' | 'whitespace'

interface PythonLexeme {
  text: string
  kind: PythonLexemeKind
}

const PYTHON_TOKEN_PATTERN =
  /(?:[rRuUbBfF]{0,2})(?:"""[\s\S]*?(?:"""|$)|'''[\s\S]*?(?:'''|$)|"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')|#[^\n]*|\b\d+(?:\.\d+)?\b|\b[A-Za-z_][A-Za-z0-9_]*\b|==|!=|<=|>=|:=|->|\*\*|\/\/|<<|>>|[-+*/%@&|^~<>]=?|[()[\]{},.:;=]|\s+|./g

function pythonLexemes(source: string): PythonLexeme[] {
  return [...source.matchAll(PYTHON_TOKEN_PATTERN)].map(([text]) => {
    if (text.startsWith('#')) return { text, kind: 'comment' }
    if (/^(?:[rRuUbBfF]{0,2})(?:"""|'''|"|')/.test(text)) {
      return { text, kind: 'string' }
    }
    if (/^\s+$/.test(text)) return { text, kind: 'whitespace' }
    if (/^\d/.test(text)) return { text, kind: 'number' }
    if (/^[A-Za-z_]/.test(text)) return { text, kind: 'identifier' }
    return { text, kind: 'punctuation' }
  })
}

function collectNames(
  source: string,
  pattern: RegExp,
  names: Set<string>,
  group = 1,
) {
  for (const match of source.matchAll(pattern)) {
    const name = match[group]
    if (name) names.add(name)
  }
}

function pythonSpans(source: string): Span[] {
  const lexemes = pythonLexemes(source)
  const masked = lexemes
    .map((lexeme) =>
      lexeme.kind === 'comment' || lexeme.kind === 'string'
        ? lexeme.text.replace(/[^\n]/g, ' ')
        : lexeme.text,
    )
    .join('')

  const variables = new Set<string>()
  const types = new Set<string>()
  const functions = new Set<string>()

  collectNames(
    masked,
    /^[ \t]*([A-Za-z_][A-Za-z0-9_]*)[ \t]*(?::[^=\n]+)?=(?!=)/gm,
    variables,
  )
  collectNames(masked, /\b(?:for|as)\s+([A-Za-z_][A-Za-z0-9_]*)/g, variables)
  collectNames(masked, /\bclass\s+([A-Za-z_][A-Za-z0-9_]*)/g, types)
  collectNames(masked, /\bdef\s+([A-Za-z_][A-Za-z0-9_]*)/g, functions)
  collectNames(
    masked,
    /\b([A-Z][A-Za-z0-9_]*)\s*(?=\.[A-Za-z_][A-Za-z0-9_]*\s*\()/g,
    types,
  )

  for (const match of masked.matchAll(
    /(?:^[ \t]*[A-Za-z_][A-Za-z0-9_]*[ \t]*:[ \t]*|[,(][ \t]*[A-Za-z_][A-Za-z0-9_]*[ \t]*:[ \t]*|->[ \t]*)([A-Za-z_][A-Za-z0-9_]*(?:\[[^\]\n]+\])?)/gm,
  )) {
    for (const name of match[1]?.match(/[A-Za-z_][A-Za-z0-9_]*/g) ?? []) {
      if (!PYTHON_KEYWORD_SET.has(name)) types.add(name)
    }
  }

  const nextSignificant: Array<PythonLexeme | undefined> = Array(lexemes.length)
  let next: PythonLexeme | undefined
  for (let index = lexemes.length - 1; index >= 0; index -= 1) {
    const lexeme = lexemes[index]
    nextSignificant[index] = next
    if (lexeme && lexeme.kind !== 'whitespace' && lexeme.kind !== 'comment') {
      next = lexeme
    }
  }

  return lexemes.map((lexeme, index) => {
    if (lexeme.kind === 'comment') {
      return { text: lexeme.text, className: CLASS.comment }
    }
    if (lexeme.kind === 'string') {
      return { text: lexeme.text, className: CLASS.string }
    }
    if (lexeme.kind === 'number') {
      return { text: lexeme.text, className: CLASS.quantity }
    }
    if (lexeme.kind === 'punctuation') {
      return { text: lexeme.text, className: CLASS.punctuation }
    }
    if (lexeme.kind === 'identifier') {
      if (PYTHON_KEYWORD_SET.has(lexeme.text)) {
        return { text: lexeme.text, className: CLASS.keyword }
      }
      if (nextSignificant[index]?.text === '(') {
        return {
          text: lexeme.text,
          className: /^[A-Z]/.test(lexeme.text) ? CLASS.type : CLASS.function,
        }
      }
      if (variables.has(lexeme.text)) {
        return { text: lexeme.text, className: CLASS.variable }
      }
      if (types.has(lexeme.text)) {
        return { text: lexeme.text, className: CLASS.type }
      }
      if (functions.has(lexeme.text)) {
        return { text: lexeme.text, className: CLASS.function }
      }
    }
    return { text: lexeme.text, className: CLASS.variable }
  })
}

const QUANTITY = String.raw`\b\d+(?:\.\d+)?(?:\s*(?:ng\/uL|ug\/uL|mg\/mL|nM|uM|mM|µL|uL|mL|bp|kb|min|h|C))?\b`

const LAB_TYPE_DECLARATIONS = 'role|record|artifact'
const LAB_FUNCTION_DECLARATIONS = 'circuit|workflow'

/*
 * Mirrors editors/vscode/syntaxes/lab.tmLanguage.json in the compiler
 * repository, rule for rule and in its order, so a program reads the same on
 * this site as it does in the editor. Each branch is a named group, and
 * LAB_SCOPES maps that name to one semantic colour.
 */
const LAB_RULES: [string, string][] = [
  // Documentation spans lines and is matched before `//` so that the `*` and
  // `/` opening a `/** */` or `/*! */` block cannot be read as a line comment.
  ['cmt', String.raw`/\*[*!][\s\S]*?\*/|//[^\n]*`],
  ['str', String.raw`"(?:[^"\\]|\\.)*"`],
  // The durable arrow, and the action it performs.
  ['eff', String.raw`<-`],
  ['act', String.raw`(?<=<- )[A-Za-z_][A-Za-z0-9_]*`],
  ['op', String.raw`->|==|!=|<=|>=|\.\.`],
  ['qty', QUANTITY],
  // The module path in `use std.bio.parts`, and the name a declaration binds.
  ['ns', String.raw`(?<=\buse )[A-Za-z_][A-Za-z0-9_.]*`],
  [
    'type_decl',
    String.raw`(?<=^(?:${LAB_TYPE_DECLARATIONS}) )[A-Za-z_][A-Za-z0-9_]*`,
  ],
  [
    'function_decl',
    String.raw`(?<=^(?:${LAB_FUNCTION_DECLARATIONS}) )[A-Za-z_][A-Za-z0-9_]*`,
  ],
  ['state_decl', String.raw`(?<=^state )[A-Za-z_][A-Za-z0-9_]*`],
  /*
   * An artifact instance: an optional provenance verb, the kind's word, and
   * the name it declares. The word belongs to a package rather than to the
   * grammar, so it is matched by shape and coloured as the declared name it
   * is, not from a list and not as a keyword. Leading spaces are allowed
   * because an instance also sits inside a `buy:`/`build:` provenance block;
   * the keyword guard keeps `match growth:` and `state observations:` from
   * reading as kind-and-name.
   */
  [
    'kind',
    String.raw`(?<=^ *(?:build |buy )?)(?!(?:${LAB_KEYWORDS})\b)[a-z_][a-z0-9_]*(?= [A-Za-z_][A-Za-z0-9_]*:?$)`,
  ],
  [
    'inst',
    String.raw`(?<=^ *(?:build |buy )?(?!(?:${LAB_KEYWORDS})\b)[a-z_][a-z0-9_]* )[A-Za-z_][A-Za-z0-9_]*(?=:|$)`,
  ],
  ['kw', String.raw`(?<!\.)\b(?:${LAB_KEYWORDS})\b`],
  ['konst', String.raw`\b(?:None|true|false)\b`],
  // Types, by position rather than by an initial capital. See the note on the
  // `types` rule in the editor grammar for why case is not the signal.
  ['gen', String.raw`\b[A-Za-z_][A-Za-z0-9_]*(?=<[A-Za-z_])`],
  ['targ', String.raw`(?<=[A-Za-z0-9_])<[A-Za-z_][^<>\n]*>`],
  ['ret', String.raw`(?<=->)\s*[A-Za-z_][A-Za-z0-9_]*`],
  ['binding_type', String.raw`(?<=:\s)[A-Za-z_][A-Za-z0-9_]*(?=\s*=)`],
  ['variant', String.raw`(?<=\bcase)\s+[A-Za-z_][A-Za-z0-9_]*`],
  ['ctor', String.raw`\b[A-Za-z_][A-Za-z0-9_]*(?=\s*\{)`],
  ['call', String.raw`\b[A-Za-z_][A-Za-z0-9_]*(?=\s*\()`],
  ['id', String.raw`\b[A-Za-z_][A-Za-z0-9_]*\b`],
  ['punct', String.raw`[()[\]{},.:=+*/-]`],
]

const LAB_SCOPES: Record<string, string> = {
  cmt: CLASS.comment,
  str: CLASS.string,
  eff: `${CLASS.durable} font-medium`,
  act: CLASS.durable,
  op: CLASS.punctuation,
  qty: CLASS.quantity,
  ns: CLASS.variable,
  type_decl: CLASS.type,
  function_decl: CLASS.function,
  state_decl: CLASS.variable,
  kind: CLASS.type,
  inst: CLASS.variable,
  kw: CLASS.keyword,
  konst: CLASS.keyword,
  gen: CLASS.type,
  targ: CLASS.type,
  ret: CLASS.type,
  binding_type: CLASS.type,
  variant: CLASS.type,
  ctor: CLASS.type,
  call: CLASS.function,
  id: CLASS.variable,
  punct: CLASS.punctuation,
}

interface Grammar {
  pattern: RegExp
  tokenize?: (source: string) => Span[]
  /** Used when the pattern's alternatives are not named groups. */
  classify?: (token: string) => string
  /** Maps a named group to its colour, for grammars that scope by rule. */
  scopes?: Record<string, string>
}

const GRAMMARS: Record<SourceLanguage, Grammar> = {
  lab: {
    pattern: new RegExp(
      LAB_RULES.map(([name, rule]) => `(?<${name}>${rule})`).join('|'),
      // `m` so that the declaration rules anchor to the start of each line,
      // which is where a declaration sits and an indented property does not.
      'gm',
    ),
    scopes: LAB_SCOPES,
  },
  python: {
    pattern: /(?!)/g,
    tokenize: pythonSpans,
  },
  ir: {
    pattern:
      /("(?:[^"\\]|\\.)*"|\b(?:design|protocol|builtin)\.[a-z_]+|![0-9]+|\b[a-z_]+_v[0-9]+\b|\b\d+\b|<|>)/g,
    classify: (token) => {
      if (token.startsWith('"')) return CLASS.string
      if (/^(?:design|protocol|builtin)\./.test(token)) return CLASS.keyword
      if (/^!/.test(token)) return CLASS.comment
      if (/_v\d+$/.test(token)) return CLASS.variable
      if (/^\d/.test(token)) return CLASS.quantity
      return CLASS.base
    },
  },
  markdown: {
    pattern: /(^#{1,6} .*$|\*\*[^*]+\*\*|`[^`]+`|^> .*$|\|)/gm,
    classify: (token) => {
      if (token.startsWith('#')) return `${CLASS.keyword} font-medium`
      if (token.startsWith('>')) return CLASS.comment
      if (token.startsWith('**')) return `${CLASS.base} font-medium`
      if (token.startsWith('`')) return CLASS.function
      if (token === '|') return CLASS.comment
      return CLASS.base
    },
  },
  shell: {
    pattern: /(^\$|#[^\n]*|--?[a-z-]+)/gm,
    classify: (token) => {
      if (token === '$') return CLASS.durable
      if (token.startsWith('#')) return CLASS.comment
      if (token.startsWith('-')) return CLASS.keyword
      return CLASS.base
    },
  },
  toml: {
    // The key alternative carries its leading indentation so the lookahead can
    // anchor to the start of a line; whitespace takes a colour class either way.
    pattern:
      /(^\s*\[[^\]\n]+\]|#[^\n]*|"(?:[^"\\]|\\.)*"|^\s*[A-Za-z0-9_-]+(?=\s*=)|\b(?:true|false)\b|\b\d+(?:\.\d+)?\b)/gm,
    classify: (token) => {
      const trimmed = token.trim()
      if (trimmed.startsWith('[')) return `${CLASS.keyword} font-medium`
      if (trimmed.startsWith('#')) return CLASS.comment
      if (trimmed.startsWith('"')) return CLASS.string
      if (/^(?:true|false)$/.test(trimmed)) return CLASS.keyword
      if (/^\d/.test(trimmed)) return CLASS.quantity
      return CLASS.variable
    },
  },
  json: {
    pattern:
      /("(?:[^"\\]|\\.)*"\s*:|"(?:[^"\\]|\\.)*"|\b(?:true|false|null)\b|-?\b\d+(?:\.\d+)?\b)/g,
    classify: (token) => {
      if (token.endsWith(':')) return CLASS.variable
      if (token.startsWith('"')) return CLASS.string
      if (/^(?:true|false|null)$/.test(token)) return CLASS.keyword
      return CLASS.quantity
    },
  },
  // Plain text: a directory tree or a block of output, where colouring a word
  // would claim a meaning it does not have.
  text: {
    pattern: /(?!)/g,
    classify: () => CLASS.base,
  },
}

/**
 * A scoped grammar walks its matches so each one keeps the colour of the rule
 * that matched it, and the text between matches stays plain. Splitting cannot
 * do this: it hands the classifier the gaps as well as the matches, with
 * nothing to tell them apart.
 */
function scopedSpans(source: string, grammar: Grammar) {
  const spans: Span[] = []
  let cursor = 0

  for (const match of source.matchAll(grammar.pattern)) {
    const start = match.index ?? 0
    if (start > cursor) {
      spans.push({ text: source.slice(cursor, start), className: CLASS.base })
    }
    const rule = Object.keys(match.groups ?? {}).find(
      (name) => match.groups?.[name] !== undefined,
    )
    spans.push({
      text: match[0],
      className: (rule && grammar.scopes?.[rule]) || CLASS.base,
    })
    cursor = start + match[0].length
  }

  if (cursor < source.length) {
    spans.push({ text: source.slice(cursor), className: CLASS.base })
  }

  return spans
}

interface Span {
  text: string
  className: string
}

/**
 * Tokenizes the whole source at once, then cuts the spans at newlines. A
 * construct that spans lines, such as a `/** *␑/` documentation block or a
 * Python docstring, is one token, so matching per line would colour its
 * opening line and then read the prose inside it as code.
 */
function highlight(source: string, grammar: Grammar): Span[][] {
  const spans = grammar.tokenize
    ? grammar.tokenize(source)
    : grammar.scopes
      ? scopedSpans(source, grammar)
      : source
          .split(grammar.pattern)
          .filter(Boolean)
          .map((token) => ({
            text: token,
            className: grammar.classify?.(token) ?? CLASS.base,
          }))

  const lines: Span[][] = [[]]
  for (const span of spans) {
    const parts = span.text.split('\n')
    parts.forEach((part, index) => {
      if (index > 0) lines.push([])
      if (part) lines[lines.length - 1].push({ ...span, text: part })
    })
  }
  return lines
}

export function SourceCode({
  source,
  language = 'lab',
  cursor = false,
  showLineNumbers = true,
  scroll = true,
  className = '',
}: {
  source: string
  language?: SourceLanguage
  cursor?: boolean
  showLineNumbers?: boolean
  /** Disable when an outer element owns scrolling, such as the editor overlay. */
  scroll?: boolean
  className?: string
}) {
  // An MDX fence can name any language; an unknown one falls back rather than
  // taking the page down on an undefined grammar.
  const grammar = GRAMMARS[language] ?? GRAMMARS.lab
  const lines = highlight(source, grammar)
  const gutterWidth = String(lines.length).length

  return (
    <pre
      className={`px-4 py-4 font-mono text-[13px] leading-[1.6] sm:px-6 sm:text-[13.5px] ${
        scroll ? 'overflow-x-auto scroll-fade-x' : 'overflow-hidden'
      } ${className}`}
    >
      <code>
        {lines.map((line, index) => (
          <span className="flex min-w-max" key={index}>
            {showLineNumbers && (
              <span
                aria-hidden="true"
                className="mr-5 shrink-0 select-none text-right text-[#6d5a45] tabular-nums"
                style={{ width: `${gutterWidth}ch` }}
              >
                {index + 1}
              </span>
            )}
            <span className="pr-8">
              {line.map((span, spanIndex) => (
                <span className={span.className} key={spanIndex}>
                  {span.text}
                </span>
              ))}
              {cursor && index === lines.length - 1 && (
                <span
                  aria-hidden="true"
                  className="typing-caret ml-px inline-block text-[#93e03f]"
                >
                  ▏
                </span>
              )}
            </span>
          </span>
        ))}
      </code>
    </pre>
  )
}
