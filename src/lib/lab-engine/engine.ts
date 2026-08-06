import { byteOffsetToUtf16Index, utf16IndexToByteOffset } from './byte-offset'
import type {
  CompletionItem,
  Diagnostic,
  DocumentSymbol,
  Hover,
  Location,
  SemanticToken,
  Span,
  TextEdit,
} from './types'

type WasmModule = typeof import('../../wasm/lab-ide-wasm/lab_ide_wasm.js')
type LabWorkspace = InstanceType<WasmModule['LabWorkspace']>

/**
 * Thin, span-correcting wrapper around the `lab-ide-wasm` bundle. The wasm
 * side is byte-offset/UTF-8 native and single-threaded; this class converts
 * every offset at the boundary and keeps the last text set per path so
 * spans returned for *other* files (references, rename) convert correctly
 * too. Every method is async even though the underlying calls are
 * synchronous today, so a future move to a Web Worker is an internal change
 * here, not at every call site.
 */
export class LabEngine {
  private workspace: LabWorkspace | null = null
  private modulePromise: Promise<WasmModule> | null = null
  private readyPromise: Promise<void> | null = null
  private texts = new Map<string, string>()

  whenReady(): Promise<void> {
    if (!this.readyPromise) {
      this.readyPromise = this.load()
    }
    return this.readyPromise
  }

  private async load(): Promise<void> {
    if (!this.modulePromise) {
      this.modulePromise = import('../../wasm/lab-ide-wasm/lab_ide_wasm.js')
    }
    const mod = await this.modulePromise
    await mod.default()
    this.workspace = new mod.LabWorkspace()
  }

  private require(): LabWorkspace {
    if (!this.workspace) {
      throw new Error('LabEngine used before whenReady() resolved')
    }
    return this.workspace
  }

  /** Discards and recreates the workspace so no document from a previous project lingers. */
  async resetWorkspace(): Promise<void> {
    await this.whenReady()
    const mod = await this.modulePromise!
    this.workspace = new mod.LabWorkspace()
    this.texts.clear()
  }

  /**
   * `module` names the document the way a package manifest does. Without it
   * the engine derives a name from the path, which is right for a loose file
   * but not for one laid out under a package.
   */
  async setDocument(path: string, version: number, text: string, module?: string): Promise<void> {
    await this.whenReady()
    if (module) {
      this.require().setModuleDocument(path, BigInt(version), text, module)
    } else {
      this.require().setDocument(path, BigInt(version), text)
    }
    this.texts.set(path, text)
  }

  async removeDocument(path: string): Promise<void> {
    await this.whenReady()
    this.require().removeDocument(path)
    this.texts.delete(path)
  }

  async diagnostics(path: string): Promise<Diagnostic[]> {
    await this.whenReady()
    const result = (this.require().diagnostics(path) ?? []) as Diagnostic[]
    return result.map((diagnostic) => this.convertDiagnostic(diagnostic))
  }

  async documentSymbols(path: string): Promise<DocumentSymbol[]> {
    await this.whenReady()
    const result = (this.require().documentSymbols(path) ?? []) as DocumentSymbol[]
    return result.map((symbol) => this.convertSymbol(path, symbol))
  }

  async completions(path: string, utf16Offset: number): Promise<CompletionItem[]> {
    await this.whenReady()
    const offset = this.byteOffset(path, utf16Offset)
    return (this.require().completions(path, offset) ?? []) as CompletionItem[]
  }

  async hover(path: string, utf16Offset: number): Promise<Hover | undefined> {
    await this.whenReady()
    const offset = this.byteOffset(path, utf16Offset)
    const result = this.require().hover(path, offset) as Hover | undefined
    if (!result) return undefined
    return { ...result, span: this.toUtf16Span(path, result.span) }
  }

  async definition(path: string, utf16Offset: number): Promise<Location | undefined> {
    await this.whenReady()
    const offset = this.byteOffset(path, utf16Offset)
    const result = this.require().definition(path, offset) as Location | undefined
    if (!result) return undefined
    return this.convertLocation(result)
  }

  async references(path: string, utf16Offset: number): Promise<Location[]> {
    await this.whenReady()
    const offset = this.byteOffset(path, utf16Offset)
    const result = (this.require().references(path, offset) ?? []) as Location[]
    return result.map((location) => this.convertLocation(location))
  }

  async rename(path: string, utf16Offset: number, newName: string): Promise<TextEdit[]> {
    await this.whenReady()
    const offset = this.byteOffset(path, utf16Offset)
    const result = (this.require().rename(path, offset, newName) ?? []) as TextEdit[]
    return result.map((edit) => ({ ...edit, span: this.toUtf16Span(edit.source, edit.span) }))
  }

  async semanticTokens(path: string): Promise<SemanticToken[]> {
    await this.whenReady()
    const result = (this.require().semanticTokens(path) ?? []) as SemanticToken[]
    return result.map((token) => ({ ...token, span: this.toUtf16Span(path, token.span) }))
  }

  async formatDocument(path: string): Promise<string | undefined> {
    await this.whenReady()
    return this.require().formatDocument(path)
  }

  private byteOffset(path: string, utf16Offset: number): number {
    const text = this.texts.get(path) ?? ''
    return utf16IndexToByteOffset(text, utf16Offset)
  }

  private toUtf16Span(source: string, span: Span): Span {
    const text = this.texts.get(source) ?? ''
    return {
      start: byteOffsetToUtf16Index(text, span.start),
      end: byteOffsetToUtf16Index(text, span.end),
    }
  }

  private convertLocation(location: Location): Location {
    return { ...location, span: this.toUtf16Span(location.source, location.span) }
  }

  private convertDiagnostic(diagnostic: Diagnostic): Diagnostic {
    return {
      ...diagnostic,
      span: this.toUtf16Span(diagnostic.source, diagnostic.span),
      related: diagnostic.related?.map((info) => ({
        ...info,
        span: this.toUtf16Span(info.source, info.span),
      })),
    }
  }

  private convertSymbol(path: string, symbol: DocumentSymbol): DocumentSymbol {
    return {
      ...symbol,
      span: this.toUtf16Span(path, symbol.span),
      selection_span: this.toUtf16Span(path, symbol.selection_span),
      children: symbol.children?.map((child) => this.convertSymbol(path, child)),
    }
  }
}
