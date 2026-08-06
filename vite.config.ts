import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import remarkCodeMeta from './src/lib/remark-code-meta.ts'
import remarkDocSearch from './src/lib/remark-doc-search.ts'

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
})
