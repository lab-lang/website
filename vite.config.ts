import { fileURLToPath } from 'node:url'

import mdx from '@mdx-js/rollup'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import { defineConfig } from 'vite'

import remarkCodeMeta from './build/remark-code-meta.ts'
import remarkDocSearch from './build/remark-doc-search.ts'

export default defineConfig({
  plugins: [
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [
          remarkGfm,
          remarkCodeMeta,
          remarkFrontmatter,
          [remarkMdxFrontmatter, { name: 'frontmatter' }],
          // Last: it indexes the tree the other plugins have finished shaping.
          remarkDocSearch,
        ],
      }),
    },
    react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
