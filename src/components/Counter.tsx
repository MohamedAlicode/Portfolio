import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/motion'
import { useLang } from '../lib/i18n'

// Chiffre clé qui compte jusqu'à sa valeur quand il arrive à l'écran
export function Counter({ value, suffix = '', motion }: { value: number; suffix?: string; motion: boolean }) {
  const { lang } = useLang()
  const ref = useRef<HTMLSpanElement>(null)
  const format = (n: number) => new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-GB').format(Math.round(n))

  useGSAP(
    () => {
      const el = ref.current
      if (!el || !motion) return
      const o = { v: 0 }
      gsap.to(o, {
        v: value,
        duration: 1.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reset' },
        onUpdate: () => {
          el.textContent = format(o.v)
        },
      })
    },
    { dependencies: [value, motion, lang], revertOnUpdate: true },
  )

  return (
    <span className="tabular-nums">
      <span ref={ref}>{format(value)}</span>
      {suffix}
    </span>
  )
}
