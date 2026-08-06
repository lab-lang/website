/* tslint:disable */
/* eslint-disable */

export class LabWorkspace {
    free(): void;
    [Symbol.dispose](): void;
    completions(source: string, offset: number): any;
    definition(source: string, offset: number): any;
    diagnostics(source: string): any;
    documentSymbols(source: string): any;
    formatDocument(source: string): string | undefined;
    hover(source: string, offset: number): any;
    constructor();
    references(source: string, offset: number): any;
    removeDocument(source: string): void;
    rename(source: string, offset: number, new_name: string): any;
    semanticTokens(source: string): any;
    setDocument(source: string, version: bigint, text: string): void;
    /**
     * Register a document under a module name the host already knows,
     * rather than one guessed from the path. A file in a package takes its
     * name from that package's manifest, so a host that has read the
     * manifest supplies the name and keeps paths as the package lays them
     * out.
     */
    setModuleDocument(source: string, version: bigint, text: string, module: string): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_labworkspace_free: (a: number, b: number) => void;
    readonly labworkspace_completions: (a: number, b: number, c: number, d: number) => [number, number, number];
    readonly labworkspace_definition: (a: number, b: number, c: number, d: number) => [number, number, number];
    readonly labworkspace_diagnostics: (a: number, b: number, c: number) => [number, number, number];
    readonly labworkspace_documentSymbols: (a: number, b: number, c: number) => [number, number, number];
    readonly labworkspace_formatDocument: (a: number, b: number, c: number) => [number, number];
    readonly labworkspace_hover: (a: number, b: number, c: number, d: number) => [number, number, number];
    readonly labworkspace_new: () => number;
    readonly labworkspace_references: (a: number, b: number, c: number, d: number) => [number, number, number];
    readonly labworkspace_removeDocument: (a: number, b: number, c: number) => void;
    readonly labworkspace_rename: (a: number, b: number, c: number, d: number, e: number, f: number) => [number, number, number];
    readonly labworkspace_semanticTokens: (a: number, b: number, c: number) => [number, number, number];
    readonly labworkspace_setDocument: (a: number, b: number, c: number, d: bigint, e: number, f: number) => void;
    readonly labworkspace_setModuleDocument: (a: number, b: number, c: number, d: bigint, e: number, f: number, g: number, h: number) => void;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __externref_table_dealloc: (a: number) => void;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
