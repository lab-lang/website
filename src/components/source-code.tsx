export type SourceLanguage = 'lab' | 'python' | 'ir' | 'markdown' | 'shell'

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

interface Grammar {
  pattern: RegExp
  classify: (token: string) => string
}

const GRAMMARS: Record<SourceLanguage, Grammar> = {
  lab: {
    pattern: new RegExp(
      `("(?:[^"\\\\]|\\\\.)*"` +
        `|#[^\\n]*` +
        `|<-|->|==|>=|<=` +
        `|${QUANTITY}` +
        `|\\b(?:${FIELD_NAMES})\\s*:` +
        // A keyword after a dot is a module path segment, as in `lab.designs.circuit`.
        `|(?<!\\.)\\b(?:${LAB_KEYWORDS})\\b` +
        `|\\b[A-Z][A-Za-z0-9_]*\\b)`,
      'g',
    ),
    classify: (token) => {
      if (token.startsWith('#')) return CLASS.comment
      if (token.startsWith('"')) return CLASS.string
      if (token === '<-') return `${CLASS.durable} font-medium`
      if (/^(?:->|==|>=|<=)$/.test(token)) return CLASS.keyword
      if (/^\d/.test(token)) return CLASS.quantity
      if (token.endsWith(':')) return CLASS.base
      if (new RegExp(`^(?:${LAB_KEYWORDS})$`).test(token)) return CLASS.keyword
      if (/^[A-Z]/.test(token)) return CLASS.entity
      return CLASS.base
    },
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
      if (new RegExp(`^(?:${PYTHON_KEYWORDS})$`).test(token)) return CLASS.keyword
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
}

function HighlightedLine({
  line,
  grammar,
}: {
  line: string
  grammar: Grammar
}) {
  const tokens = line.split(grammar.pattern)

  return (
    <>
      {tokens.map((token, index) =>
        token ? (
          <span className={grammar.classify(token)} key={index}>
            {token}
          </span>
        ) : null,
      )}
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
  const grammar = GRAMMARS[language]
  const lines = source.split('\n')
  const gutterWidth = String(lines.length).length

  return (
    <pre
      className={`px-4 py-4 font-mono text-[13px] leading-[1.6] sm:px-6 sm:text-[13.5px] ${
        scroll ? 'overflow-x-auto' : 'overflow-hidden'
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
