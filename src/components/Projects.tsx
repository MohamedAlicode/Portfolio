import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react'
import { projects } from '../data/projects'
import { projectsUi } from '../data/content'
import { useLang } from '../lib/i18n'
import { gsap } from '../lib/motion'
import { setChapter } from '../lib/chapters'
import { onShowProject } from '../lib/showcase'
import { useSection } from '../hooks/useSection'
import { useReveal } from '../hooks/useReveal'
import { ProjectSlide } from './ProjectSlide'
import { ProjectDetails } from './ProjectDetails'

const DELAY = 6 // secondes avant de passer au projet suivant
const SWIPE = 50 // pixels à glisser pour changer de projet
const n = projects.length
const mod = (i: number) => ((i % n) + n) % n

// Les projets en carrousel, comme la une d'Apple TV : la carte du milieu en
// grand, ses voisines qui dépassent sur les côtés, des points en dessous.
// Il avance tout seul toutes les 6 secondes (le point actif se remplit), et
// on le pilote aux flèches, aux points, au clavier ou en glissant.
// Il s'arrête au survol, quand on navigue dedans au clavier, hors de l'écran,
// et ne démarre pas tout seul si le système demande moins d'animations.
//
// Le carrousel tourne en boucle : « pos » compte les cartes sans fin, et on
// dessine les positions pos-2 à pos+2. Une carte garde sa clé en glissant
// d'une place à l'autre, si bien que le navigateur l'anime simplement.
export function Projects({ motion }: { motion: boolean }) {
  const { t, lang } = useLang()
  const root = useRef<HTMLElement>(null)
  const region = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const fill = useRef<HTMLSpanElement>(null)
  const [pos, setPos] = useState(() => Math.max(0, projects.findIndex((p) => `#${p.slug}` === location.hash)))
  const active = mod(pos)
  const project = projects[active]

  // Pourquoi le défilement automatique est arrêté (il faut qu'aucune raison ne tienne)
  const [stopped, setStopped] = useState(!motion) // bouton Pause / Lecture
  const [hover, setHover] = useState(false)
  const [focused, setFocused] = useState(false)
  const [visible, setVisible] = useState(false)
  const [dragging, setDragging] = useState(false)
  const running = !stopped && !hover && !focused && visible && !dragging

  useSection(root, 'paper', { id: project.slug, num: active + 1 })
  useReveal(root, motion, [lang])

  const go = useCallback((target: number) => {
    setPos((p) => {
      // Par le chemin le plus court, dans un sens ou dans l'autre
      let d = mod(target) - mod(p)
      if (d > n / 2) d -= n
      if (d < -n / 2) d += n
      return p + d
    })
  }, [])
  const step = useCallback((d: number) => setPos((p) => p + d), [])

  // Le chapitre en bas à gauche suit le projet affiché
  useEffect(() => {
    const r = root.current?.getBoundingClientRect()
    if (r && r.top < innerHeight / 2 && r.bottom > innerHeight / 2) setChapter({ id: project.slug, num: active + 1 })
  }, [project.slug, active])

  // Un lien « Vu dans Altaïr » amène le carrousel sur Altaïr
  useEffect(
    () =>
      onShowProject((slug) => {
        const i = projects.findIndex((p) => p.slug === slug)
        if (i >= 0) go(i)
      }),
    [go],
  )

  // À l'écran ou non (et onglet visible ou non)
  useEffect(() => {
    const el = region.current!
    let onScreen = false
    const update = () => setVisible(onScreen && !document.hidden)
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting
      update()
    })
    io.observe(el)
    document.addEventListener('visibilitychange', update)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', update)
    }
  }, [])

  // Le minuteur : le point actif se remplit, puis on passe au projet suivant.
  // Mis en pause, il garde où il en était ; un changement de projet le remet à zéro.
  const elapsed = useRef(0)
  useEffect(() => {
    elapsed.current = 0
    fill.current?.style.setProperty('--fill', '0')
  }, [pos])
  useEffect(() => {
    if (!running) return
    const tick = (_: number, dt: number) => {
      elapsed.current += dt / 1000
      fill.current?.style.setProperty('--fill', String(Math.min(1, elapsed.current / DELAY)))
      if (elapsed.current >= DELAY) step(1)
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [running, step])

  // Glisser au doigt (ou à la souris) : la piste suit, puis on change de
  // projet si on a glissé assez loin. Un défilement vertical reste au navigateur.
  const drag = useRef<{ x: number; y: number; id: number; moved: boolean } | null>(null)
  const setOffset = (px: number) => track.current?.style.setProperty('--drag', `${px}px`)
  const onPointerDown = (e: PointerEvent) => {
    if (e.button !== 0) return
    drag.current = { x: e.clientX, y: e.clientY, id: e.pointerId, moved: false }
  }
  const onPointerMove = (e: PointerEvent) => {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    const dx = e.clientX - d.x
    if (!d.moved) {
      if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(e.clientY - d.y)) return
      d.moved = true
      setDragging(true)
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    }
    setOffset(dx)
  }
  const onPointerEnd = (e: PointerEvent) => {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    const dx = e.clientX - d.x
    if (d.moved) {
      if (dx <= -SWIPE) step(1)
      else if (dx >= SWIPE) step(-1)
      setDragging(false)
      setOffset(0)
    }
    // Le clic qui suit un glissé ne doit pas ouvrir la démo
    if (!d.moved) drag.current = null
    else requestAnimationFrame(() => (drag.current = null))
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') step(-1)
    else if (e.key === 'ArrowRight') step(1)
    else return
    e.preventDefault()
    // Le lien de la carte quittée disparaît : on suit avec celui de la nouvelle
    if (track.current?.contains(e.target as Node))
      requestAnimationFrame(() => track.current?.querySelector<HTMLElement>('[data-center] a')?.focus())
  }

  const slots = [-2, -1, 0, 1, 2].map((o) => pos + o)

  return (
    <section id="projets" ref={root} aria-labelledby="projets-title" className="relative overflow-hidden pt-16 pb-20 lg:pt-20 lg:pb-28">
      {/* Avec les animations, ce titre est montré par le cercle du hero */}
      <div className={motion ? 'sr-only' : 'wrap pb-12'}>
        <p className="label text-accent-ink">{t(projectsUi.kicker)}</p>
        <h2 id="projets-title" className="mt-6 max-w-[16ch] font-display text-[clamp(44px,7vw,110px)] leading-[0.95] font-normal">
          {t(projectsUi.title)}
        </h2>
      </div>

      <div
        ref={region}
        role="region"
        aria-roledescription={t(projectsUi.carousel)}
        aria-label={t(projectsUi.kicker)}
        data-up
        onKeyDown={onKeyDown}
        onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(true)}
        onPointerLeave={() => setHover(false)}
        onFocus={(e) => e.target.matches(':focus-visible') && setFocused(true)}
        onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setFocused(false)}
      >
        {/* Annonce le projet affiché aux lecteurs d'écran (sauf pendant le défilement automatique) */}
        <p className="sr-only" aria-live={running ? 'off' : 'polite'} aria-atomic="true">
          {`${t(projectsUi.slide)} ${active + 1} ${t(projectsUi.of)} ${n} : ${project.name}`}
        </p>

        <div
          ref={track}
          data-dragging={dragging || undefined}
          className="carousel relative touch-pan-y select-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
          onClickCapture={(e) => {
            if (drag.current?.moved) {
              e.preventDefault()
              e.stopPropagation()
            }
          }}
        >
          {/* Donne sa hauteur à la piste : les cartes sont posées par-dessus */}
          <div aria-hidden="true" className="carousel-size invisible mx-auto" />
          {slots.map((k) => (
            <ProjectSlide
              key={k}
              project={projects[mod(k)]}
              index={mod(k)}
              total={n}
              offset={k - pos}
              playing={k === pos && visible && motion && !stopped}
              onSelect={() => step(k - pos)}
            />
          ))}
        </div>

        <div className="wrap mt-6 grid grid-cols-[1fr_auto_1fr] items-center lg:mt-8">
          <div className="col-start-2 flex items-center gap-3 sm:gap-5">
            <button type="button" onClick={() => step(-1)} className="carousel-btn" aria-label={t(projectsUi.prev)}>
              <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4">
                <path d="M10 3L5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </button>
            <ul className="flex items-center">
              {projects.map((p, i) => (
                <li key={p.slug}>
                  <button
                    type="button"
                    onClick={() => go(i)}
                    aria-label={`${t(projectsUi.show)} ${p.name}`}
                    aria-current={i === active ? 'true' : undefined}
                    className="carousel-dot"
                  >
                    <span ref={i === active ? fill : undefined} />
                  </button>
                </li>
              ))}
            </ul>
            <button type="button" onClick={() => step(1)} className="carousel-btn" aria-label={t(projectsUi.next)}>
              <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4">
                <path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </button>
          </div>
          <button
            type="button"
            onClick={() => setStopped((s) => !s)}
            className="carousel-btn justify-self-end"
            aria-label={stopped ? t(projectsUi.autoPlay) : t(projectsUi.autoPause)}
          >
            <svg aria-hidden="true" viewBox="0 0 10 10" className="h-2.5 w-2.5 fill-current">
              {stopped ? <path d="M2 1l7 4-7 4z" /> : <path d="M2 1h2v8H2zM6 1h2v8H6z" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Les trois fiches sont empilées dans la même case : la hauteur ne
          change pas d'un projet à l'autre, la page ne saute pas */}
      <div data-up style={{ '--d': 2 } as CSSProperties} className="grid">
        {projects.map((p, i) => (
          <div key={p.slug} className="project-details [grid-area:1/1]" data-active={i === active || undefined} inert={i !== active}>
            <ProjectDetails project={p} index={i} total={n} motion={motion} />
          </div>
        ))}
      </div>
    </section>
  )
}
