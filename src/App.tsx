import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

// Hosting configuration lives outside src; share its exact redirects with the router.
// eslint-disable-next-line no-restricted-imports
import { redirects } from '../vercel.json'
import { SiteShell } from '@/components/site/site-shell'
import { HomePage } from '@/pages/home-page'
import { NotFoundPage } from '@/pages/not-found-page'

function Redirect({ to }: { to: string }) {
  const { search, hash } = useLocation()
  return <Navigate replace to={{ pathname: to, search, hash }} />
}

function RouteEffects() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1))
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
        {redirects.map(({ source, destination }) => (
          <Route
            key={source}
            path={source.replace('/:path*', '/*')}
            element={<Redirect to={destination} />}
          />
        ))}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </SiteShell>
  )
}
