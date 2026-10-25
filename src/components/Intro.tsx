import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP } from '../lib/motion'
import { getSequence, preload } from '../lib/frames'
import { projects } from '../data/projects'
import { site, ui } from '../data/content'
import { useLang } from '../lib/i18n'
import { SplitChars } from './SplitChars'

const MIN_MS = 1200
const MAX_MS = 2600
const FIRST_FRAMES = 6
// Deuxième visite dans la même session : l'intro est écourtée
const REPEAT_MIN_MS = 300

// Écran d'intro, comme celui d'Altaïr : le nom, un filet bronze qui suit le
// chargement (polices et premières images de la première démo), puis le rideau
// se lève sur la page. Jamais plus de 2,6 s d'attente.
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
    let seen = false
    try {
      seen = sessionStorage.getItem('intro') === '1'
      sessionStorage.setItem('intro', '1')
    } catch {
      // stockage indisponible : intro complète
    }
    let alive = true
    Promise.race([tasks, timeout]).then(() => {
      const wait = Math.max(0, (seen ? REPEAT_MIN_MS : MIN_MS) - (performance.now() - started))
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
      // Les lettres montent en CSS (voir index.css), dès la première image
      // Elles attendent la police (400 ms au plus) pour ne pas changer de forme en montant
      const name = root.current!.querySelector('[data-chars]')
      let raf = 0
      const show = () => {
        raf = requestAnimationFrame(() => name?.setAttribute('data-in', ''))
      }
      const fallback = window.setTimeout(show, 400)
      document.fonts?.ready.then(() => {
        clearTimeout(fallback)
        show()
      })
      gsap.from('[data-meta]', { autoAlpha: 0, y: 12, duration: 0.8, delay: 0.5, ease: 'power3.out' })
      return () => {
        clearTimeout(fallback)
        cancelAnimationFrame(raf)
        gsap.ticker.remove(tick)
      }
    },
    { scope: root },
  )

  useGSAP(
    () => {
      if (!ready) return
      target.current = 1
      const tl = gsap.timeline()
      tl.to(shown.current, { value: 1, duration: 0.45, ease: 'power2.out' })
        .call(() => root.current?.querySelector('[data-chars]')?.setAttribute('data-out', ''), [], '>-0.05')
        .to('[data-meta]', { autoAlpha: 0, duration: 0.4 }, '<')
        .to(root.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.1, ease: 'power4.inOut' }, '<0.5')
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
      <p data-chars className="px-5 text-center font-display text-[clamp(44px,7.5vw,112px)] leading-[0.95] tracking-[-0.015em]">
        <SplitChars lines={[site.name]} />
      </p>
      <div data-meta className="mt-10 flex w-[min(340px,70vw)] items-center gap-4">
        <span className="relative h-px flex-1 overflow-hidden bg-line">
          <span data-bar className="absolute inset-0 origin-left bg-accent" style={{ transform: 'scaleX(0)' }} />
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
