import { useCallback, useEffect, useState } from 'react'

export type Theme = 'dark' | 'light'

// Le thème est posé sur <html data-scheme> avant le premier rendu (voir index.html)
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() =>
    document.documentElement.dataset.scheme === 'light' ? 'light' : 'dark',
  )

  useEffect(() => {
    document.documentElement.dataset.scheme = theme
  }, [theme])

  const toggle = useCallback(() => {
    setThemeState((t) => {
      const next = t === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem('theme', next)
      } catch {
        // stockage indisponible
      }
      return next
    })
  }, [])

  return { theme, toggle }
}
