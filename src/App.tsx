import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { SiteShell } from './components/site-shell'
import { DocsPage } from './pages/docs-page'
import { HomePage } from './pages/home-page'
import { NotFoundPage } from './pages/not-found-page'
import { PlaygroundPage } from './pages/playground-page'

function RouteEffects() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return null
}

export default function App() {
  return (
    <SiteShell>
      <RouteEffects />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/playground" element={<PlaygroundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </SiteShell>
  )
}
