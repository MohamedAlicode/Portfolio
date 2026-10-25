import { Fragment, useRef, type CSSProperties } from 'react'
import { about } from '../data/content'
import { useLang } from '../lib/i18n'
import { ScrollTrigger, useGSAP } from '../lib/motion'
import { useSection } from '../hooks/useSection'
import { useReveal } from '../hooks/useReveal'

// Quelques lignes plus personnelles, qui s'éclairent mot à mot au fil du scroll
export function About({ motion }: { motion: boolean }) {
  const { t, lang } = useLang()
  const root = useRef<HTMLElement>(null)
  useSection(root, 'paper', { id: 'a-propos', num: 6 })
  useReveal(root, motion, [lang])

  // Un seul nombre (--p, de 0 à 1) suit le scroll ; chaque mot calcule son
  // opacité en CSS d'après son rang. Rien à lire ni à animer mot par mot.
  useGSAP(
    () => {
      if (!motion) return
      const text = root.current!.querySelector<HTMLElement>('[data-words]')!
      ScrollTrigger.create({
        trigger: text,
        start: 'top 78%',
        end: 'bottom 52%',
        onUpdate: (self) => text.style.setProperty('--p', self.progress.toFixed(4)),
      })
    },
    { scope: root, dependencies: [motion] },
  )

  // Les mots entre * * passent en italique bronze
  const parts = t(about.text).split(/(\*[^*]+\*)/).filter(Boolean)
  const count = parts.reduce((n, part) => n + part.replace(/\*/g, '').split(/ +/).filter(Boolean).length, 0)
  let rank = 0

  return (
    <section id="a-propos" ref={root} aria-labelledby="a-propos-title" className="relative py-28 lg:py-44">
      <div className="wrap grid gap-10 lg:grid-cols-12 lg:gap-x-14 lg:gap-y-10">
        <h2 id="a-propos-title" data-up className="label text-accent-ink lg:col-span-3">
          {t(about.kicker)}
        </h2>
        <p
          data-words
          style={{ '--n': count } as CSSProperties}
          className="max-w-[30ch] font-display text-[clamp(30px,3.7vw,60px)] leading-[1.12] tracking-[-0.005em] lg:col-span-9 lg:row-span-2"
        >
          {parts.map((part, pi) => {
            const em = part.startsWith('*')
            // Coupe aux espaces ordinaires seulement : les insécables restent collées
            const words = (em ? part.slice(1, -1) : part).split(/( +)/)
            return (
              <Fragment key={pi}>
                {words.map((w, wi) =>
                  /^ *$/.test(w) ? (
                    <Fragment key={wi}>{w}</Fragment>
                  ) : (
                    <span key={wi} className={`word ${em ? 'em text-accent-ink italic' : ''}`} style={{ '--i': rank++ } as CSSProperties}>
                      {w}
                    </span>
                  ),
                )}
              </Fragment>
            )
          })}
        </p>
        <dl data-stagger className="grid grid-cols-2 gap-x-6 gap-y-5 text-[14.5px] lg:col-span-3 lg:grid-cols-1 lg:self-start">
          {about.facts.map((f, i) => (
            <div key={i} className="border-t border-line pt-3">
              <dt className="label text-[11px] text-muted">{t(f.k)}</dt>
              <dd className="m-0 mt-1">{t(f.v)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
