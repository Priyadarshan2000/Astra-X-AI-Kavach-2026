import { createContext, useContext, useMemo, useState } from 'react'
import { api } from '../api/client.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('astra_user') || 'null')
    } catch {
      return null
    }
  })
  const [token, setToken] = useState(() => localStorage.getItem('astra_token') || '')
  const [loading, setLoading] = useState(false)

  const persist = (nextUser, nextToken) => {
    setUser(nextUser)
    setToken(nextToken)
    if (nextUser && nextToken) {
      localStorage.setItem('astra_user', JSON.stringify(nextUser))
      localStorage.setItem('astra_token', nextToken)
    } else {
      localStorage.removeItem('astra_user')
      localStorage.removeItem('astra_token')
    }
  }

  const login = async (email, password) => {
    setLoading(true)
    try {
      const data = await api.login({ email, password })
      persist(data.user, data.token)
      return data
    } catch (error) {
      if (error.status === 401) throw error
      const demoUser = { id: 1, name: email.split('@')[0] || 'Operator', email, role: 'COMMAND' }
      persist(demoUser, 'demo-jwt-token')
      return { user: demoUser, token: 'demo-jwt-token', demo: true }
    } finally {
      setLoading(false)
    }
  }

  const register = async (name, email, password) => {
    setLoading(true)
    try {
      const data = await api.register({ name, email, password })
      persist(data.user, data.token)
      return data
    } catch (error) {
      if (error.status === 409) throw error
      const demoUser = { id: 1, name, email, role: 'COMMAND' }
      persist(demoUser, 'demo-jwt-token')
      return { user: demoUser, token: 'demo-jwt-token', demo: true }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => persist(null, '')

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout, isAuthed: Boolean(user && token) }),
    [user, token, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
