import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { path, type Localized } from '../data/content'
import { useLang } from '../lib/i18n'
import { gsap, ScrollTrigger, useGSAP } from '../lib/motion'
import { scrollToHash } from '../lib/scroll'
import { useSection } from '../hooks/useSection'
import { useReveal } from '../hooks/useReveal'
import { SplitChars } from './SplitChars'

// Frise du parcours, dans l'ordre : un filet bronze la parcourt au scroll,
// chaque étape s'allume quand on l'atteint, et l'année en cours s'affiche
// en grand à gauche (grand écran).
export function Path({ motion }: { motion: boolean }) {
  const { t, lang } = useLang()
  const root = useRef<HTMLElement>(null)
  const [current, setCurrent] = useState(motion ? 0 : path.entries.length - 1)
  useSection(root, 'deep', { id: 'parcours', num: 5 })
  useReveal(root, motion, [lang])

  useGSAP(
    () => {
      if (!motion) return
      const list = root.current!.querySelector('[data-list]')
      const fill = root.current!.querySelector<HTMLElement>('[data-fill]')!
      ScrollTrigger.create({
        trigger: list,
        start: 'top 60%',
        end: 'bottom 60%',
        onUpdate: (self) => fill.style.setProperty('--fill', self.progress.toFixed(4)),
      })
      gsap.utils.toArray<HTMLElement>('[data-entry]', root.current).forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 60%',
          onEnter: () => setCurrent(i),
          onLeaveBack: () => setCurrent(Math.max(0, i - 1)),
        })
      })
    },
    { scope: root, dependencies: [motion] },
  )

  const go = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    scrollToHash('#contact')
  }
  const text = (v: string | Localized) => (typeof v === 'string' ? v : t(v))

  return (
    <section id="parcours" ref={root} aria-labelledby="parcours-title" className="relative py-20 lg:py-28">
      <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-14">
        <header className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <p data-up className="label text-accent-ink">
              {t(path.kicker)}
            </p>
            <h2
              id="parcours-title"
              data-chars
              className="mt-6 font-display text-[clamp(44px,5.2vw,84px)] leading-[0.95] font-normal tracking-[-0.01em]"
            >
              <SplitChars lines={t(path.title)} />
            </h2>
            <p data-up className="mt-6 max-w-[42ch] text-muted">
              {t(path.intro)}
            </p>
            {motion && (
              <div aria-hidden="true" className="mt-14 hidden overflow-hidden lg:block">
                <Rolling value={text(path.entries[current].mark)} />
              </div>
            )}
          </div>
        </header>

        <div className="relative lg:col-span-7">
          <span aria-hidden="true" className="absolute top-2 bottom-2 left-[7px] w-px bg-line" />
          <span
            data-fill
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-[7px] w-px origin-top bg-accent"
            style={motion ? { transform: 'scaleY(var(--fill, 0))' } : undefined}
          />
          <ol data-list>
            {path.entries.map((e, i) => (
              <li
                key={e.id}
                id={`parcours-${e.id}`}
                data-entry
                {...(i <= current ? { 'data-on': '' } : {})}
                {...(i === current ? { 'data-current': '' } : {})}
                className="entry relative pb-12 pl-11 last:pb-0 lg:pb-14"
              >
                <span
                  aria-hidden="true"
                  className="entry-dot absolute top-[5px] left-0 h-[15px] w-[15px] rounded-full border border-line bg-bg"
                />
                <div className="entry-body">
                  <p className="label flex flex-wrap gap-x-3 gap-y-1">
                    <span className="text-accent-ink">{t(e.when)}</span>
                    <span className="text-muted">{t(path.kinds[e.kind])}</span>
                  </p>
                  <h3 className="mt-3 font-display text-[clamp(28px,2.6vw,38px)] leading-[1.05] font-normal">{t(e.title)}</h3>
                  <p className="mt-1 text-muted">{t(e.place)}</p>
                  {e.text && <p className="mt-3 max-w-[58ch] text-[15.5px] leading-[1.6]">{t(e.text)}</p>}
                  {e.assets && (
                    <div className="mt-5 max-w-[58ch] rounded-[10px] border border-line bg-surface p-5">
                      <p className="label text-[11px] text-accent-ink">{t(path.assetsLabel)}</p>
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {t(e.assets).map((a) => (
                          <li key={a} className="rounded-full border border-line px-3 py-1 text-[14px]">
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {e.kind === 'next' && (
                    <a href="#contact" onClick={go} className="btn btn-primary mt-6">
                      {t(path.nextCta)} <span className="arrow" aria-hidden="true">→</span>
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

// Repère en grand : l'ancien glisse vers le haut, le nouveau arrive par le bas
function Rolling({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  // Premier repère rendu par React (la mise en page est juste dès le départ),
  // les suivants posés à la main pendant l'animation
  const [initial] = useState(value)
  const shown = useRef(value)

  useEffect(() => {
    const el = ref.current
    if (!el || value === shown.current) return
    shown.current = value
    const tl = gsap
      .timeline()
      .to(el, { yPercent: -105, duration: 0.35, ease: 'power3.in' })
      .add(() => {
        el.textContent = value
      })
      .fromTo(el, { yPercent: 105 }, { yPercent: 0, duration: 0.6, ease: 'expo.out' })
    return () => {
      tl.progress(1).kill()
    }
  }, [value])

  return (
    <span
      ref={ref}
      className="block font-display text-[clamp(96px,11vw,176px)] leading-[0.9] tracking-[-0.02em] text-accent-ink tabular-nums"
    >
      {initial}
    </span>
  )
}
