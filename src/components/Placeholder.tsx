import { useRef } from 'react'
import { useSection } from '../hooks/useSection'

// Section provisoire pour l'étape 1 : les projets arrivent à l'étape 2
export function Placeholder() {
  const ref = useRef<HTMLElement>(null)
  useSection(ref, 'paper', { id: 'maison-cadran', num: 1 })
  return (
    <section id="projets" ref={ref} className="flex min-h-[120vh] items-start">
      <div className="wrap pt-24">
        <p className="label text-accent-ink">Étape 2</p>
        <p className="mt-6 max-w-[24ch] font-display text-[clamp(36px,5vw,72px)] leading-none">
          Les trois projets arrivent ici, avec leurs démos rejouées au scroll.
        </p>
      </div>
    </section>
  )
}
