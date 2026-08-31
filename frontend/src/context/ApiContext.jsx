import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api, getApiBase } from '../api/client.js'

const ApiContext = createContext(null)

export function ApiProvider({ children }) {
  const [status, setStatus] = useState('checking')
  const [detail, setDetail] = useState('')

  useEffect(() => {
    let active = true

    api
      .health()
      .then((data) => {
        if (!active) return
        setStatus(data?.status === 'ready' ? 'online' : 'degraded')
        setDetail(data?.checks?.database_name || 'ASTRA-X API')
      })
      .catch(() => {
        if (!active) return
        setStatus('offline')
        setDetail(getApiBase())
      })

    return () => {
      active = false
    }
  }, [])

  const value = useMemo(
    () => ({
      status,
      detail,
      baseUrl: getApiBase(),
      isOnline: status === 'online' || status === 'degraded',
    }),
    [status, detail],
  )

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>
}

export function useApi() {
  const ctx = useContext(ApiContext)
  if (!ctx) throw new Error('useApi must be used within ApiProvider')
  return ctx
}
