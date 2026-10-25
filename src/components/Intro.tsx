import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP } from '../lib/motion'
import { getSequence, preload } from '../lib/frames'
import { projects } from '../data/projects'
import { site, ui } from '../data/content'
import { useLang } from '../lib/i18n'
import { SplitChars } from './SplitChars'

const MIN_MS = 1400
const MAX_MS = 4500
const FIRST_FRAMES = 12

// Écran d'intro, comme celui d'Altaïr : le nom, un filet bronze qui suit le
// chargement (polices et premières images de la première démo), puis le rideau
// se lève sur la page. Jamais plus de 4,5 s.
export function Intro({ onDone }: { onDone: () => void }) {
  const { t } = useLang()
  const root = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const shown = useRef({ value: 0 })
  const target = useRef(0)

  useEffect(() => {
    const started = performance.now()
    let fontsDone = 0
    let frames = 0
    const update = () => {
      target.current = (fontsDone + frames / FIRST_FRAMES) / 2
    }
    const first = projects[0]
    const seq = getSequence(first.slug, first.frames)
    const tasks = Promise.all([
      document.fonts.ready.then(() => {
        fontsDone = 1
        update()
      }),
      preload(seq, FIRST_FRAMES, (n) => {
        frames = n
        update()
      }),
    ])
    const timeout = new Promise((r) => setTimeout(r, MAX_MS))
    let alive = true
    Promise.race([tasks, timeout]).then(() => {
      const wait = Math.max(0, MIN_MS - (performance.now() - started))
      setTimeout(() => alive && setReady(true), wait)
    })
    return () => {
      alive = false
    }
  }, [])

  // Le pourcentage et le filet rattrapent le chargement en douceur
  useGSAP(
    () => {
      const pct = root.current!.querySelector<HTMLElement>('[data-pct]')!
      const bar = root.current!.querySelector<HTMLElement>('[data-bar]')!
      const tick = () => {
        const s = shown.current
        s.value += (target.current - s.value) * 0.08
        bar.style.transform = `scaleX(${s.value.toFixed(4)})`
        pct.textContent = String(Math.round(s.value * 100)).padStart(3, '0')
      }
      gsap.ticker.add(tick)
      gsap.from('.char', { yPercent: 110, duration: 1.1, stagger: 0.025, ease: 'expo.out', delay: 0.1 })
      gsap.from('[data-meta]', { autoAlpha: 0, y: 12, duration: 0.8, delay: 0.5, ease: 'power3.out' })
      return () => gsap.ticker.remove(tick)
    },
    { scope: root },
  )

  useGSAP(
    () => {
      if (!ready) return
      target.current = 1
      const tl = gsap.timeline()
      tl.to(shown.current, { value: 1, duration: 0.45, ease: 'power2.out' })
        .to('.char', { yPercent: -110, duration: 0.7, stagger: 0.012, ease: 'power3.in' }, '>-0.05')
        .to('[data-meta]', { autoAlpha: 0, duration: 0.4 }, '<')
        .to(root.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.1, ease: 'power4.inOut' }, '>-0.25')
        .call(onDone, [], '<0.35')
    },
    { scope: root, dependencies: [ready] },
  )

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-bg text-fg"
      style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
    >
      <p data-meta className="label mb-6 text-muted">
        Portfolio · 2026
      </p>
      <p className="px-5 text-center font-display text-[clamp(44px,7.5vw,112px)] leading-[0.95] tracking-[-0.015em]">
        <SplitChars lines={[site.name]} />
      </p>
      <div data-meta className="mt-10 flex w-[min(340px,70vw)] items-center gap-4">
        <span className="relative h-px flex-1 overflow-hidden bg-line">
          <span data-bar className="absolute inset-0 origin-left scale-x-0 bg-accent" />
        </span>
        <span data-pct className="label tabular-nums text-accent-ink">
          000
        </span>
      </div>
      <p data-meta className="label mt-4 text-muted">
        {t(ui.loading)}
      </p>
    </div>
  )
}
