# Lab website

The static marketing, documentation, and playground frontend for the [Lab programming language](https://github.com/lab-lang/lab).

## Stack

- Vite
- React and TypeScript
- Tailwind CSS
- pnpm

## Development

```sh
pnpm install
pnpm dev
```

The production build is a static client application:

```sh
pnpm build
pnpm preview
```

The host must serve `index.html` as the fallback for client-side routes such as `/docs` and `/playground`.

## Structure

- `src/pages/home-page.tsx` — marketing page
- `src/pages/docs-page.tsx` — initial documentation shell
- `src/pages/playground-page.tsx` — editable playground shell
- `src/components/hero-demo.tsx` — source-to-liquid-handler hero animation
- `src/components/` — shared site and source-code presentation
- `src/data/examples.ts` — representative Lab examples

## Playground compiler integration

The playground currently performs clearly labeled structural inspection only. It does not claim to parse or compile source.

The intended next integration is the `lab-ide-wasm` host from the sibling Lab compiler repository. That API already exposes document diagnostics, symbols, completions, hover, definition, references, rename, semantic tokens, and formatting. Bundle its generated WebAssembly package, load one workspace for the editor session, and replace `src/lib/inspect-source.ts` with a typed adapter around those methods.
