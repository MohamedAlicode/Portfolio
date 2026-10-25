import { Fragment, useRef } from 'react'
import { marquee } from '../data/content'
import { clamp, gsap, ScrollTrigger, useGSAP } from '../lib/motion'

// Bandeau de la stack qui défile en continu. Il accélère et s'incline avec
// la vitesse du scroll, et change de sens quand on remonte.
export function Marquee({ motion }: { motion: boolean }) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = root.current
      const track = el?.querySelector<HTMLElement>('[data-track]')
      if (!el || !track || !motion) return
      let x = 0
      let dir = -1
      let boost = 0
      let active = false
      const skew = gsap.quickTo(track, 'skewX', { duration: 0.5, ease: 'power3.out' })

      ScrollTrigger.create({
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => {
          active = self.isActive
        },
        onUpdate: (self) => {
          const v = self.getVelocity()
          dir = self.direction === 1 ? -1 : 1
          boost = Math.max(boost, Math.min(Math.abs(v) / 120, 18))
          skew(clamp(-v / 400, -7, 7))
        },
      })

      const tick = (_t: number, dt: number) => {
        if (!active) return
        boost *= 0.94
        if (boost < 0.05) skew(0)
        const half = track.scrollWidth / 2
        x += dir * (0.55 + boost) * (dt / 16.7)
        if (x <= -half) x += half
        if (x > 0) x -= half
        gsap.set(track, { x })
      }
      gsap.ticker.add(tick)
      return () => gsap.ticker.remove(tick)
    },
    { scope: root, dependencies: [motion] },
  )

  const row = (
    <span className="flex shrink-0 items-center">
      {marquee.map((word, i) => (
        <Fragment key={word}>
          <span className={`px-[0.28em] whitespace-nowrap ${i % 2 ? 'text-accent-ink italic' : ''}`}>{word}</span>
          <span className="mx-[0.12em] inline-block h-[0.14em] w-[0.14em] shrink-0 rounded-full bg-accent" />
        </Fragment>
      ))}
    </span>
  )

  return (
    <div ref={root} aria-hidden="true" className="overflow-hidden border-y border-line py-6 lg:py-8">
      <div data-track className="flex w-max font-display text-[clamp(52px,8.4vw,136px)] leading-none will-change-transform">
        {row}
        {row}
      </div>
    </div>
  )
}
