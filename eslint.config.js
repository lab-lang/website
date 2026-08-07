import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import importX from 'eslint-plugin-import-x'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'src/wasm'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      'import-x': importX,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    settings: {
      'import-x/resolver': {
        typescript: {
          // The app and the build tooling are compiled under separate
          // configs, which is the arrangement the resolver warns about.
          noWarnOnMultipleProjects: true,
          project: ['./tsconfig.app.json', './tsconfig.node.json'],
        },
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // Three groups, separated by a blank line: the standard library, then
      // packages from npm, then this project's own modules under @/.
      'import-x/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            ['internal', 'parent', 'sibling', 'index'],
          ],
          pathGroups: [{ pattern: '@/**', group: 'internal' }],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },
  {
    // Everything under src/ is reachable as @/…, so a relative specifier there
    // is always the alias written the long way. The Vite and ESLint configs
    // live outside src and load before the alias exists, so they are exempt.
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['./*', './**', '../*', '../**'],
              message: 'Import local modules through the @/ alias instead.',
            },
          ],
        },
      ],
    },
  },
  {
    // A map from MDX element names to renderers is the module's whole purpose,
    // so it exports a table of components rather than a component. Fast refresh
    // cannot follow that shape, and no arrangement of the file would let it.
    files: ['src/components/docs/mdx-components.tsx'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
  // Last: it turns off the stylistic rules prettier already decides.
  prettier,
)
