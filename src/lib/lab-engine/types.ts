/**
 * Hand-written mirrors of the wire shapes produced by `lab-ide-wasm`
 * (crates/lab-ide/src/model.rs and crates/lab-language/src/diagnostics.rs in
 * the sibling `lab` checkout, serialized through serde-wasm-bindgen). Field
 * names match the Rust structs exactly — none of them carry a camelCase
 * rename, so `selection_span` and `new_text` stay snake_case here too.
 *
 * `Span` offsets are UTF-8 byte offsets into the source text, not UTF-16
 * code-unit indices, so every offset crossing the wasm boundary goes through
 * byte-offset.ts first.
 */

export type SourceId = string

export interface Span {
  start: number
  end: number
}

export type SymbolKind =
  | 'module'
  | 'circuit'
  | 'plasmid'
  | 'data'
  | 'workflow'
  | 'variable'
  | 'field'
  | 'case'

export interface DocumentSymbol {
  name: string
  kind: SymbolKind
  span: Span
  selection_span: Span
  children?: DocumentSymbol[]
}

export type CompletionKind = 'keyword' | 'type' | 'value' | 'function' | 'module'

export interface CompletionItem {
  label: string
  kind: CompletionKind
  detail: string | null
}

export interface Hover {
  span: Span
  markdown: string
}

export interface Location {
  source: SourceId
  span: Span
}

export interface TextEdit {
  source: SourceId
  span: Span
  new_text: string
}

export type SemanticTokenKind =
  | 'comment'
  | 'keyword'
  | 'string'
  | 'number'
  | 'type'
  | 'function'
  | 'variable'
  | 'operator'

export interface SemanticToken {
  span: Span
  kind: SemanticTokenKind
}

export type DiagnosticSeverity = 'error' | 'warning' | 'information' | 'hint'

export type DiagnosticCode = 'syntax' | 'semantic' | 'material_flow'

export interface DiagnosticRelatedInformation {
  source: SourceId
  span: Span
  message: string
}

export interface Diagnostic {
  source: SourceId
  span: Span
  severity: DiagnosticSeverity
  code: DiagnosticCode
  message: string
  related?: DiagnosticRelatedInformation[]
}
