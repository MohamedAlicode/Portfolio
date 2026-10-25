import { useRef, type CSSProperties, type MouseEvent } from 'react'
import { footer, projectsUi, site } from '../data/content'
import { useLang } from '../lib/i18n'
import { ScrollTrigger, useGSAP } from '../lib/motion'
import { scrollToHash } from '../lib/scroll'

// Pied de page : le nom en très grand, qui se lève lettre par lettre en
// arrivant en bas de la page, puis les mentions et le retour en haut.
export function Footer({ motion }: { motion: boolean }) {
  const { t } = useLang()
  const root = useRef<HTMLElement>(null)

  // Le nom se lève lettre par lettre en arrivant en bas : le scroll règle
  // une seule variable (--p), chaque lettre en déduit sa position en CSS
  useGSAP(
    () => {
      if (!motion) return
      const mark = root.current!.querySelector<HTMLElement>('[data-mark]')!
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom bottom',
        onUpdate: (self) => mark.style.setProperty('--p', self.progress.toFixed(4)),
      })
    },
    { scope: root, dependencies: [motion] },
  )

  const top = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    scrollToHash('#top')
  }

  return (
    <footer ref={root} className="relative overflow-hidden">
      <div className="wrap">
        <p
          data-mark
          aria-hidden="true"
          style={{ '--n': site.name.replace(/ /g, '').length } as CSSProperties}
          className="flex justify-between font-display text-[clamp(40px,10.6vw,178px)] leading-[0.82] tracking-[-0.03em] whitespace-nowrap select-none"
        >
          {(() => {
            let i = 0
            return site.name.split(' ').map((word, wi) => (
              <span key={wi} className="split-line inline-block">
                {Array.from(word).map((ch, ci) => (
                  <span key={ci} className="char mark-char" style={{ '--i': i++ } as CSSProperties}>
                    {ch}
                  </span>
                ))}
              </span>
            ))
          })()}
        </p>
        <div className="mt-8 flex flex-col gap-3 border-t border-line py-7 text-[13.5px] text-muted md:flex-row md:items-center md:justify-between">
          <p>© 2026 {site.name}</p>
          <p>{t(footer.made)}</p>
          <div className="flex gap-6">
            <a href={site.sourceCode} target="_blank" rel="noopener" className="hover:text-fg">
              {t(footer.source)} <span aria-hidden="true">↗</span>
              <span className="sr-only">({t(projectsUi.newTab)})</span>
            </a>
            <a href="#top" onClick={top} className="hover:text-fg">
              {t(footer.top)} <span aria-hidden="true">↑</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
