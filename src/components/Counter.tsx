import { useEffect, useRef } from 'react'
import { gsap } from '../lib/motion'
import { useLang } from '../lib/i18n'

// Chiffre clé qui compte jusqu'à sa valeur quand il arrive à l'écran,
// et se remet à zéro s'il repasse sous l'écran
export function Counter({ value, suffix = '', motion }: { value: number; suffix?: string; motion: boolean }) {
  const { lang } = useLang()
  const ref = useRef<HTMLSpanElement>(null)
  const format = (n: number) => new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-GB').format(Math.round(n))

  useEffect(() => {
    const el = ref.current
    if (!el || !motion) return
    const fmt = new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-GB')
    const o = { v: 0 }
    el.textContent = fmt.format(0)
    const tween = gsap.to(o, {
      v: value,
      duration: 1.8,
      ease: 'power2.out',
      paused: true,
      onUpdate: () => {
        el.textContent = fmt.format(Math.round(o.v))
      },
    })
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) tween.play()
        else if (e.boundingClientRect.top > 0) tween.pause(0)
      },
      { rootMargin: '0px 0px -12% 0px' },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      tween.kill()
      el.textContent = fmt.format(value)
    }
  }, [value, motion, lang])

  return (
    <span className="tabular-nums">
      <span ref={ref}>{format(value)}</span>
      {suffix}
    </span>
  )
}
