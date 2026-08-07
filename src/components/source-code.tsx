export type SourceLanguage =
  'lab' | 'python' | 'ir' | 'markdown' | 'shell' | 'toml' | 'json'

/**
 * Six token colours, each carrying one meaning. The durable-effect arrow gets
 * the fluorophore green because `<-` is the distinction the language exists to
 * make.
 */
const CLASS = {
  base: 'text-[#f2e8db]',
  comment: 'text-[#8a7458]',
  keyword: 'text-[#eaa54a]',
  entity: 'text-[#6fd0dd]',
  string: 'text-[#cbb98a]',
  quantity: 'text-[#f2708f]',
  durable: 'text-[#93e03f]',
} as const

const LAB_KEYWORDS =
  'use|circuit|plasmid|record|material|observation|evidence|event|outcome|workflow|input|output|layout|state|require|accept|if|else|for|in|match|case|return|when|every|after|emit|and|or|not'

const PYTHON_KEYWORDS =
  'import|from|def|class|return|for|in|if|else|elif|with|as|None|True|False|and|or|not'

const QUANTITY = String.raw`\b\d+(?:\.\d+)?(?:\s*(?:ng\/uL|µL|uL|bp|kb|min|h|C))?\b`

/*
 * Declaration keywords that double as field names. `material: plasmid` inside a
 * constructor is a field, not a declaration, so it is matched with its colon
 * and left unhighlighted. Block openers like `layout:` are deliberately absent.
 */
const FIELD_NAMES = 'material|evidence|record|observation|event|outcome'

/** Declaration keywords that introduce a named entity, per the editor grammar. */
const LAB_DECLARATIONS =
  'part|circuit|plasmid|record|material|observation|evidence|event|outcome|workflow|strain'

/*
 * Mirrors editors/vscode/syntaxes/lab.tmLanguage.json in the compiler
 * repository, rule for rule and in its order, so a program reads the same on
 * this site as it does in the editor. Each branch is a named group, and
 * LAB_SCOPES maps that name to one of the six colours above.
 */
const LAB_RULES: [string, string][] = [
  ['cmt', String.raw`#[^\n]*`],
  ['str', String.raw`"(?:[^"\\]|\\.)*"`],
  // The durable arrow, and the action it performs.
  ['eff', String.raw`<-`],
  ['act', String.raw`(?<=<- )[A-Za-z_][A-Za-z0-9_]*`],
  ['op', String.raw`->|==|!=|<=|>=`],
  ['qty', QUANTITY],
  // The module path in `use std.bio.parts`, and the name a declaration binds.
  ['ns', String.raw`(?<=\buse )[A-Za-z_][A-Za-z0-9_.]*`],
  ['decl', String.raw`(?<=^(?:${LAB_DECLARATIONS}) )[A-Za-z_][A-Za-z0-9_]*`],
  ['fld', String.raw`\b(?:${FIELD_NAMES})\s*:`],
  ['kw', String.raw`(?<!\.)\b(?:${LAB_KEYWORDS})\b`],
  ['konst', String.raw`\b(?:None|true|false)\b`],
  // Types, by position rather than by an initial capital. See the note on the
  // `types` rule in the editor grammar for why case is not the signal.
  ['gen', String.raw`\b[A-Za-z_][A-Za-z0-9_]*(?=<[A-Za-z_])`],
  ['targ', String.raw`(?<=[A-Za-z0-9_])<[A-Za-z_][^<>\n]*>`],
  ['ret', String.raw`(?<=->)\s*[A-Za-z_][A-Za-z0-9_]*`],
  ['variant', String.raw`(?<=\bcase)\s+[A-Za-z_][A-Za-z0-9_]*`],
  ['ctor', String.raw`\b[A-Za-z_][A-Za-z0-9_]*(?=\s*\{)`],
  ['call', String.raw`\b[A-Za-z_][A-Za-z0-9_]*(?=\s*\()`],
]

const LAB_SCOPES: Record<string, string> = {
  cmt: CLASS.comment,
  str: CLASS.string,
  eff: `${CLASS.durable} font-medium`,
  act: CLASS.durable,
  op: CLASS.keyword,
  qty: CLASS.quantity,
  ns: CLASS.entity,
  decl: CLASS.entity,
  fld: CLASS.base,
  kw: CLASS.keyword,
  konst: CLASS.keyword,
  gen: CLASS.entity,
  targ: CLASS.entity,
  ret: CLASS.entity,
  variant: CLASS.entity,
  ctor: CLASS.entity,
  call: CLASS.entity,
}

interface Grammar {
  pattern: RegExp
  /** Used when the pattern's alternatives are not named groups. */
  classify?: (token: string) => string
  /** Maps a named group to its colour, for grammars that scope by rule. */
  scopes?: Record<string, string>
}

const GRAMMARS: Record<SourceLanguage, Grammar> = {
  lab: {
    pattern: new RegExp(
      LAB_RULES.map(([name, rule]) => `(?<${name}>${rule})`).join('|'),
      'g',
    ),
    scopes: LAB_SCOPES,
  },
  python: {
    pattern: new RegExp(
      `("""[\\s\\S]*?"""|"(?:[^"\\\\]|\\\\.)*"|#[^\\n]*|\\b(?:${PYTHON_KEYWORDS})\\b|\\b\\d+(?:\\.\\d+)?\\b|\\b[A-Z][A-Za-z0-9_]*\\b)`,
      'g',
    ),
    classify: (token) => {
      if (token.startsWith('#')) return CLASS.comment
      if (token.startsWith('"')) return CLASS.string
      if (/^\d/.test(token)) return CLASS.quantity
      if (new RegExp(`^(?:${PYTHON_KEYWORDS})$`).test(token))
        return CLASS.keyword
      if (/^[A-Z]/.test(token)) return CLASS.entity
      return CLASS.base
    },
  },
  ir: {
    pattern:
      /("(?:[^"\\]|\\.)*"|\b(?:design|protocol|builtin)\.[a-z_]+|![0-9]+|\b[a-z_]+_v[0-9]+\b|\b\d+\b|<|>)/g,
    classify: (token) => {
      if (token.startsWith('"')) return CLASS.string
      if (/^(?:design|protocol|builtin)\./.test(token)) return CLASS.keyword
      if (/^!/.test(token)) return CLASS.comment
      if (/_v\d+$/.test(token)) return CLASS.entity
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
      if (token.startsWith('`')) return CLASS.entity
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
      return CLASS.entity
    },
  },
  json: {
    pattern:
      /("(?:[^"\\]|\\.)*"\s*:|"(?:[^"\\]|\\.)*"|\b(?:true|false|null)\b|-?\b\d+(?:\.\d+)?\b)/g,
    classify: (token) => {
      if (token.endsWith(':')) return CLASS.entity
      if (token.startsWith('"')) return CLASS.string
      if (/^(?:true|false|null)$/.test(token)) return CLASS.keyword
      return CLASS.quantity
    },
  },
}

/**
 * A scoped grammar walks its matches so each one keeps the colour of the rule
 * that matched it, and the text between matches stays plain. Splitting cannot
 * do this: it hands the classifier the gaps as well as the matches, with
 * nothing to tell them apart.
 */
function scopedSpans(line: string, grammar: Grammar) {
  const spans: { text: string; className: string }[] = []
  let cursor = 0

  for (const match of line.matchAll(grammar.pattern)) {
    const start = match.index ?? 0
    if (start > cursor) {
      spans.push({ text: line.slice(cursor, start), className: CLASS.base })
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

  if (cursor < line.length) {
    spans.push({ text: line.slice(cursor), className: CLASS.base })
  }

  return spans
}

function HighlightedLine({
  line,
  grammar,
}: {
  line: string
  grammar: Grammar
}) {
  const spans = grammar.scopes
    ? scopedSpans(line, grammar)
    : line
        .split(grammar.pattern)
        .filter(Boolean)
        .map((token) => ({
          text: token,
          className: grammar.classify?.(token) ?? CLASS.base,
        }))

  return (
    <>
      {spans.map((span, index) => (
        <span className={span.className} key={index}>
          {span.text}
        </span>
      ))}
    </>
  )
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
  const lines = source.split('\n')
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
              <HighlightedLine grammar={grammar} line={line} />
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
