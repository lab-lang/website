import { useEffect, useState } from 'react'

import { LabEngine } from '@/lib/lab-engine/engine'

export type EngineStatus = 'loading' | 'ready' | 'error'

export function useLabEngine() {
  const [engine] = useState(() => new LabEngine())
  const [status, setStatus] = useState<EngineStatus>('loading')
  const [error, setError] = useState<unknown>(null)

  useEffect(() => {
    let cancelled = false
    // `engine` is created once via a lazy useState initializer, so this
    // effect runs exactly once; `status` already starts at 'loading'.
    engine
      .whenReady()
      .then(() => {
        if (!cancelled) setStatus('ready')
      })
      .catch((caught) => {
        if (cancelled) return
        setError(caught)
        setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [engine])

  return { engine, status, error }
}
