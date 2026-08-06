import { lazy, Suspense, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { SiteShell } from './components/site-shell'
import { BrandPage } from './pages/brand-page'
import { CommunityPage } from './pages/community-page'
import { DocsPage } from './pages/docs-page'
import { HomePage } from './pages/home-page'
import { NotFoundPage } from './pages/not-found-page'
import { DEFAULT_DOC_SLUG } from './lib/docs-content'

// CodeMirror and the wasm compiler are heavy and only ever used on this one
// route — code-split it so the rest of the site's first load stays light.
const PlaygroundPage = lazy(() =>
  import('./pages/playground-page').then((mod) => ({ default: mod.PlaygroundPage })),
)

function RouteEffects() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash)
      if (target) {
        target.scrollIntoView({ behavior: 'instant', block: 'start' })
        return
      }
    }

    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [hash, pathname])

  return null
}

export default function App() {
  return (
    <SiteShell>
      <RouteEffects />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/docs"
          element={<Navigate replace to={`/docs/${DEFAULT_DOC_SLUG}`} />}
        />
        <Route path="/docs/*" element={<DocsPage />} />
        <Route
          path="/playground"
          element={
            <Suspense fallback={null}>
              <PlaygroundPage />
            </Suspense>
          }
        />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/brand" element={<BrandPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </SiteShell>
  )
}
