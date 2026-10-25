import { useEffect, type RefObject } from 'react'

// Entrées au scroll communes aux sections du bas de page, jouées en CSS
// (voir index.css) : [data-chars] titre en lettres qui montent, [data-up]
// bloc qui monte, [data-stagger] enfants qui montent l'un après l'autre,
// [data-draw] filet qui se trace. Un IntersectionObserver pose data-in
// quand l'élément arrive à l'écran, et le retire s'il repasse en dessous :
// aucune mesure de mise en page, donc aucun à-coup au chargement.
export function useReveal(scope: RefObject<HTMLElement | null>, motion: boolean, deps: unknown[] = []) {
  useEffect(() => {
    const root = scope.current
    if (!root || !motion) return
    const targets = root.querySelectorAll<HTMLElement>('[data-chars], [data-up], [data-stagger], [data-draw]')
    root.querySelectorAll<HTMLElement>('[data-stagger]').forEach((el) => {
      Array.from(el.children).forEach((child, i) => (child as HTMLElement).style.setProperty('--i', String(i)))
    })
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const el = e.target as HTMLElement
          if (e.isIntersecting) el.setAttribute('data-in', '')
          else if (e.boundingClientRect.top > 0) el.removeAttribute('data-in')
        })
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    targets.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [scope, motion, ...deps])
}
