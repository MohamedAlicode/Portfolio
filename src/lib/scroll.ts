import Lenis from 'lenis'
import { gsap, ScrollTrigger, reducedMotion } from './motion'

// Défilement doux (Lenis) synchronisé avec ScrollTrigger, comme sur Altaïr.
// Coupé si le système demande moins d'animations : le scroll reste natif.
let lenis: Lenis | null = null

export function startSmoothScroll() {
  if (lenis || reducedMotion()) return () => {}
  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  })
  lenis.on('scroll', ScrollTrigger.update)
  const raf = (time: number) => lenis?.raf(time * 1000)
  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0)
  return () => {
    gsap.ticker.remove(raf)
    lenis?.destroy()
    lenis = null
  }
}

export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop()
    else lenis.start()
  } else {
    document.documentElement.style.overflow = locked ? 'hidden' : ''
  }
}

// Défile jusqu'à une ancre (#projets…) puis lui donne le focus pour le clavier
export function scrollToHash(hash: string) {
  const target = document.querySelector<HTMLElement>(hash)
  if (!target) return
  const focus = () => {
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
    target.focus({ preventScroll: true })
  }
  if (lenis) lenis.scrollTo(target, { offset: 0, onComplete: focus })
  else {
    target.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' })
    focus()
  }
}
