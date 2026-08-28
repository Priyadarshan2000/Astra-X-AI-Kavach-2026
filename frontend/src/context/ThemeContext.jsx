import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const ThemeContext = createContext(null)
const STORAGE_KEY = 'astra_theme'

function readTheme() {
  if (typeof document === 'undefined') return 'dark'
  const attr = document.documentElement.getAttribute('data-theme')
  if (attr === 'light' || attr === 'dark') return attr
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    /* ignore */
  }
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function applyTheme(next) {
  document.documentElement.setAttribute('data-theme', next)
  document.documentElement.style.colorScheme = next
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(readTheme)

  useEffect(() => {
    applyTheme(theme)
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === STORAGE_KEY && (event.newValue === 'light' || event.newValue === 'dark')) {
        setThemeState(event.newValue)
      }
    }
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    const onSystem = (event) => {
      try {
        if (localStorage.getItem(STORAGE_KEY)) return
      } catch {
        return
      }
      setThemeState(event.matches ? 'light' : 'dark')
    }
    window.addEventListener('storage', onStorage)
    mq.addEventListener('change', onSystem)
    return () => {
      window.removeEventListener('storage', onStorage)
      mq.removeEventListener('change', onSystem)
    }
  }, [])

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === 'dark',
      setTheme: setThemeState,
      toggle: () => setThemeState((current) => (current === 'dark' ? 'light' : 'dark')),
    }),
    [theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
