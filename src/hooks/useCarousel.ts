import { useCallback, useEffect, useRef, useState, type FocusEvent, type KeyboardEvent, type PointerEvent, type MouseEvent } from 'react'
import { gsap } from '../lib/motion'

const SWIPE = 50 // pixels à glisser pour changer de carte

// Tout le comportement d'un carrousel en boucle (projets, compétences) :
// - « pos » compte les cartes sans fin ; le composant dessine les positions
//   autour de pos et chaque carte garde sa clé en glissant d'une place à
//   l'autre, si bien que le navigateur l'anime simplement ;
// - il avance tout seul toutes les `delay` secondes (fillRef reçoit --fill,
//   de 0 à 1, pour le point qui se remplit) ;
// - il s'arrête au survol, quand on navigue dedans au clavier, hors de
//   l'écran, onglet caché, pendant un glissé, ou avec le bouton Pause
//   (il défile même si le système demande moins d'animations : c'est le
//   choix de l'auteur du site, et le bouton Pause reste là pour l'arrêter) ;
// - on le pilote aussi aux flèches du clavier et en glissant.
export function useCarousel({ count, delay = 6, initial = 0 }: { count: number; delay?: number; initial?: number }) {
  const mod = useCallback((i: number) => ((i % count) + count) % count, [count])
  const region = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const fill = useRef<HTMLSpanElement>(null)
  const [pos, setPos] = useState(initial)

  // Pourquoi le défilement automatique est arrêté (il faut qu'aucune raison ne tienne)
  const [stopped, setStopped] = useState(false) // bouton Pause / Lecture
  const [hover, setHover] = useState(false)
  const [focused, setFocused] = useState(false)
  const [visible, setVisible] = useState(false)
  const [dragging, setDragging] = useState(false)
  const running = !stopped && !hover && !focused && visible && !dragging

  const go = useCallback(
    (target: number) => {
      setPos((p) => {
        // Par le chemin le plus court, dans un sens ou dans l'autre
        let d = mod(target) - mod(p)
        if (d > count / 2) d -= count
        if (d < -count / 2) d += count
        return p + d
      })
    },
    [mod, count],
  )
  const step = useCallback((d: number) => setPos((p) => p + d), [])

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

  // Le minuteur : mis en pause, il garde où il en était ; un changement de
  // carte le remet à zéro
  const elapsed = useRef(0)
  useEffect(() => {
    elapsed.current = 0
    fill.current?.style.setProperty('--fill', '0')
  }, [pos])
  useEffect(() => {
    if (!running) return
    const tick = (_: number, dt: number) => {
      elapsed.current += dt / 1000
      fill.current?.style.setProperty('--fill', String(Math.min(1, elapsed.current / delay)))
      if (elapsed.current >= delay) step(1)
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [running, step, delay])

  // Glisser au doigt (ou à la souris) : la piste suit, puis on change de
  // carte si on a glissé assez loin. Un défilement vertical reste au navigateur.
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
    // Le clic qui suit un glissé ne doit pas ouvrir de lien
    if (!d.moved) drag.current = null
    else requestAnimationFrame(() => (drag.current = null))
  }
  const onClickCapture = (e: MouseEvent) => {
    if (drag.current?.moved) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') step(-1)
    else if (e.key === 'ArrowRight') step(1)
    else return
    e.preventDefault()
    // Les liens de la carte quittée disparaissent : on suit avec la nouvelle
    if (track.current?.contains(e.target as Node))
      requestAnimationFrame(() => {
        const c = track.current?.querySelector<HTMLElement>('[data-center]')
        ;(c?.querySelector<HTMLElement>('a') ?? c)?.focus()
      })
  }

  return {
    pos,
    active: mod(pos),
    mod,
    go,
    step,
    running,
    visible,
    stopped,
    toggle: () => setStopped((s) => !s),
    fillRef: fill,
    regionProps: {
      ref: region,
      onKeyDown,
      onPointerEnter: (e: PointerEvent) => e.pointerType === 'mouse' && setHover(true),
      onPointerLeave: () => setHover(false),
      onFocus: (e: FocusEvent) => e.target.matches(':focus-visible') && setFocused(true),
      onBlur: (e: FocusEvent) => !e.currentTarget.contains(e.relatedTarget) && setFocused(false),
    },
    trackProps: {
      ref: track,
      'data-dragging': dragging || undefined,
      onPointerDown,
      onPointerMove,
      onPointerUp: onPointerEnd,
      onPointerCancel: onPointerEnd,
      onClickCapture,
    },
  }
}
