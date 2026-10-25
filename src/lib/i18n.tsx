import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Lang, Localized } from '../data/content'

type LangContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  t: <T>(value: Localized<T>) => T
}

const LangContext = createContext<LangContextValue | null>(null)

// Langue de départ : ?lang=en dans l'adresse, puis le choix mémorisé,
// puis la langue du navigateur ; le français sinon.
function initialLang(): Lang {
  try {
    const param = new URLSearchParams(window.location.search).get('lang')
    if (param === 'fr' || param === 'en') return param
    const saved = localStorage.getItem('lang')
    if (saved === 'fr' || saved === 'en') return saved
  } catch {
    // stockage indisponible : on continue
  }
  const nav = navigator.languages?.find((l) => /^(fr|en)/i.test(l))
  return nav && /^en/i.test(nav) ? 'en' : 'fr'
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    try {
      localStorage.setItem('lang', next)
    } catch {
      // stockage indisponible
    }
  }, [])

  const value = useMemo<LangContextValue>(
    () => ({ lang, setLang, t: (v) => v[lang] }),
    [lang, setLang],
  )
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang doit être utilisé dans <LangProvider>')
  return ctx
}
