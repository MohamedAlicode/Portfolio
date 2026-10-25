import { useEffect, useRef } from 'react'
import { gsap, finePointer, reducedMotion } from '../lib/motion'

// Curseur discret : un point bronze qui s'agrandit sur les démos
// (éléments marqués data-cursor) et affiche leur action.
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !finePointer() || reducedMotion()) return
    const label = el.querySelector('span')!
    const x = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' })
    const y = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' })
    let big = false
    const move = (e: PointerEvent) => {
      x(e.clientX)
      y(e.clientY)
      const target = (e.target as Element | null)?.closest?.('[data-cursor]')
      const next = !!target
      if (next !== big) {
        big = next
        if (target) label.textContent = target.getAttribute('data-cursor')
        gsap.to(el, { width: big ? 104 : 10, height: big ? 104 : 10, duration: 0.45, ease: 'power3.out' })
        gsap.to(label, { autoAlpha: big ? 1 : 0, duration: 0.25 })
      }
      gsap.to(el, { autoAlpha: 1, duration: 0.3, overwrite: 'auto' })
    }
    const leave = () => gsap.to(el, { autoAlpha: 0, duration: 0.3 })
    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-50 hidden h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent opacity-0 [@media(hover:hover)_and_(pointer:fine)]:flex"
    >
      <span className="label text-[11px] whitespace-nowrap text-on-accent opacity-0" />
    </div>
  )
}
