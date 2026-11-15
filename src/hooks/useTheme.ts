// Assisted by Codex (SI) — reviewed by pendiente
import { useEffect, useState } from 'react'

type Theme = 'dark' | 'light'
const STORAGE_KEY = 'spectrahive-theme'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark'
    } catch {
      return 'dark'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // The selected theme still works when browser storage is unavailable.
    }
  }, [theme])

  return { theme, toggleTheme: () => setTheme((previous) => previous === 'dark' ? 'light' : 'dark') }
}
