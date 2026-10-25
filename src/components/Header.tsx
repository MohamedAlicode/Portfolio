import { useEffect, useRef, useState } from 'react'
import { ui } from '../data/content'
import { useLang } from '../lib/i18n'
import { useTheme } from '../lib/theme'
import { gsap, useGSAP } from '../lib/motion'
import { scrollToHash } from '../lib/scroll'

const links = [
  { hash: '#projets', label: ui.nav.projects },
  { hash: '#competences', label: ui.nav.skills },
  { hash: '#parcours', label: ui.nav.path },
  { hash: '#contact', label: ui.nav.contact },
]

export function Header({ ready }: { ready: boolean }) {
  const { lang, setLang, t } = useLang()
  const { theme, toggle } = useTheme()
  const ref = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useGSAP(
    () => {
      if (!ready) return
      gsap.from(ref.current!.querySelectorAll('[data-reveal]'), {
        yPercent: -120,
        autoAlpha: 0,
        duration: 1,
        stagger: 0.06,
        ease: 'expo.out',
        delay: 0.35,
      })
    },
    { scope: ref, dependencies: [ready] },
  )

  const go = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault()
    scrollToHash(hash)
  }

  return (
    <header
      ref={ref}
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled ? 'border-b border-line bg-bg/80 backdrop-blur-md' : 'border-b border-transparent'
      }`}
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="wrap flex h-16 items-center justify-between gap-4 md:h-20">
        <a
          data-reveal
          href="#top"
          onClick={(e) => go(e, '#top')}
          className="font-display text-[22px] leading-none tracking-[0.01em] no-underline"
        >
          M<span className="text-accent">.</span>A<span className="text-accent">.</span> Ouachani
        </a>
        <nav aria-label={lang === 'fr' ? 'Navigation principale' : 'Main navigation'} className="hidden md:block">
          <ul className="flex gap-9 text-[14px]">
            {links.map((l) => (
              <li key={l.hash} data-reveal>
                <a href={l.hash} onClick={(e) => go(e, l.hash)} className="text-muted no-underline transition-colors hover:text-fg">
                  {t(l.label)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <button
            data-reveal
            type="button"
            onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
            aria-label={t(ui.langLabel)}
            className="label rounded-full border border-line px-3 py-2 text-muted transition-colors hover:border-fg hover:text-fg"
          >
            <span className={lang === 'fr' ? 'text-fg' : ''}>FR</span> / <span className={lang === 'en' ? 'text-fg' : ''}>EN</span>
          </button>
          <button
            data-reveal
            type="button"
            onClick={toggle}
            aria-label={t(ui.themeLabel)}
            className="label rounded-full border border-line px-3 py-2 text-muted transition-colors hover:border-fg hover:text-fg"
          >
            {theme === 'dark' ? t(ui.themeToLight) : t(ui.themeToDark)}
          </button>
        </div>
      </div>
    </header>
  )
}
