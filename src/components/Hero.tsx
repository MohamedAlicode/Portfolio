import { useRef, type CSSProperties } from 'react'
import { hero, ui } from '../data/content'
import { useLang } from '../lib/i18n'
import { gsap, finePointer, useGSAP } from '../lib/motion'
import { setChapter, setZone } from '../lib/chapters'
import { scrollToHash } from '../lib/scroll'
import { useMagnetic } from '../hooks/useMagnetic'
import { Blueprint } from './Blueprint'
import { SplitChars } from './SplitChars'

// Hero : le titre monte lettre par lettre sur une grille de plan.
// Au scroll, le titre recule et un cercle s'ouvre sur les projets,
// comme le film d'Altaïr s'ouvre en cercle.
export function Hero({ ready, motion }: { ready: boolean; motion: boolean }) {
  const { t, lang } = useLang()
  const root = useRef<HTMLElement>(null)
  const cta1 = useRef<HTMLAnchorElement>(null)
  const cta2 = useRef<HTMLAnchorElement>(null)
  useMagnetic(cta1)
  useMagnetic(cta2)

  // Au scroll : le titre recule, le cercle s'ouvre sur les projets
  useGSAP(
    () => {
      if (!motion) return
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          onUpdate: (self) => {
            // La page passe dans la zone « papier » quand le cercle a tout couvert
            if (self.progress > 0.82) {
              setZone('paper')
            } else {
              setZone('base')
              setChapter(null)
            }
          },
        },
      })
      tl.to('[data-hero-content]', { yPercent: -12, scale: 0.92, duration: 0.6 }, 0)
        // Le contenu s'efface sans quitter l'arbre d'accessibilité (le titre reste
        // lisible par les lecteurs d'écran) ; seuls les liens deviennent inactifs
        .to('[data-hero-content]', { opacity: 0, duration: 0.42 }, 0.18)
        .set('[data-hero-content] a', { visibility: 'hidden' }, 0.6)
        .to('[data-hero-meta]', { autoAlpha: 0, duration: 0.2 }, 0.05)
        .fromTo(
          '[data-portal]',
          { clipPath: 'circle(0% at 50% 58%)' },
          { clipPath: 'circle(75% at 50% 58%)', duration: 0.72, ease: 'power1.in' },
          0.12,
        )
        .from('[data-portal-item]', { y: 60, autoAlpha: 0, stagger: 0.05, duration: 0.3, ease: 'power2.out' }, 0.5)
        .to({}, { duration: 0.12 })
    },
    { scope: root, dependencies: [motion, lang], revertOnUpdate: true },
  )

  // Viseur de dessinateur qui suit le curseur sur la grille
  useGSAP(
    () => {
      if (!motion || !finePointer()) return
      const area = root.current!.querySelector<HTMLElement>('[data-sticky]')!
      const cross = area.querySelector<HTMLElement>('[data-cross]')!
      const label = cross.querySelector<HTMLElement>('[data-coords]')!
      const xTo = gsap.quickTo(cross, '--x', { duration: 0.5, ease: 'power3.out' })
      const yTo = gsap.quickTo(cross, '--y', { duration: 0.5, ease: 'power3.out' })
      const move = (e: PointerEvent) => {
        const r = area.getBoundingClientRect()
        const x = e.clientX - r.left
        const y = e.clientY - r.top
        xTo(x)
        yTo(y)
        label.textContent = `x ${String(Math.round(x)).padStart(4, '0')}  ·  y ${String(Math.round(y)).padStart(4, '0')}`
        gsap.to(cross, { autoAlpha: 1, duration: 0.3, overwrite: 'auto' })
      }
      const leave = () => gsap.to(cross, { autoAlpha: 0, duration: 0.4, overwrite: 'auto' })
      area.addEventListener('pointermove', move)
      area.addEventListener('pointerleave', leave)
      return () => {
        area.removeEventListener('pointermove', move)
        area.removeEventListener('pointerleave', leave)
      }
    },
    { scope: root, dependencies: [motion] },
  )

  // Entrée, une fois l'intro levée : jouée en CSS (lettres puis blocs)
  const inAttr = ready ? { 'data-in': '' } : {}

  const go = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault()
    scrollToHash(hash)
  }

  return (
    <section
      id="top"
      ref={root}
      aria-labelledby="hero-title"
      className="relative"
      style={{ height: motion ? '260vh' : undefined }}
    >
      <div data-sticky className={`${motion ? 'sticky top-0 h-svh' : 'relative min-h-svh'} overflow-hidden`}>
        <Blueprint start={ready} />

        {/* Viseur */}
        <div
          data-cross
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0"
          style={{ ['--x' as string]: '0px', ['--y' as string]: '0px' }}
        >
          <span className="absolute inset-y-0 w-px bg-accent/35" style={{ left: 'var(--x)' }} />
          <span className="absolute inset-x-0 h-px bg-accent/35" style={{ top: 'var(--y)' }} />
          <span
            data-coords
            className="label absolute whitespace-pre text-[10px] tabular-nums tracking-[0.12em] text-accent-ink"
            style={{ left: 'calc(var(--x) + 12px)', top: 'calc(var(--y) + 10px)' }}
          />
        </div>

        <div className="wrap relative flex h-full min-h-svh flex-col justify-center pt-24 pb-24">
          <div data-hero-content className="origin-[0%_50%]">
            <p data-up {...inAttr} style={{ '--base': '550ms', '--d': 0 } as CSSProperties} className="mb-6 flex items-center gap-3 text-[14px] text-muted">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              {t(hero.status)}
            </p>
            <h1
              id="hero-title"
              data-chars
              {...inAttr}
              style={{ '--base': '100ms' } as CSSProperties}
              className="font-display text-[clamp(52px,min(9.4vw,15svh),156px)] leading-[0.92] font-normal tracking-[-0.025em]"
            >
              <SplitChars lines={t(hero.title)} />
            </h1>
            <p data-up {...inAttr} style={{ '--base': '550ms', '--d': 1 } as CSSProperties} className="mt-8 max-w-[54ch] text-[clamp(17px,1.5vw,20px)] leading-[1.6] text-muted">
              {t(hero.intro)}
            </p>
            <div data-up {...inAttr} style={{ '--base': '550ms', '--d': 2 } as CSSProperties} className="mt-8 flex flex-wrap gap-3">
              <a ref={cta1} href="#projets" onClick={(e) => go(e, '#projets')} className="btn btn-primary">
                {t(hero.ctaProjects)} <span className="arrow" aria-hidden="true">→</span>
              </a>
              <a ref={cta2} href="#contact" onClick={(e) => go(e, '#contact')} className="btn">
                {t(hero.ctaContact)}
              </a>
            </div>
          </div>
        </div>

        <div
          data-hero-meta
          className="wrap absolute inset-x-0 flex items-end justify-between gap-6"
          style={{ bottom: 'calc(28px + env(safe-area-inset-bottom, 0px))' }}
        >
          <ul data-up {...inAttr} style={{ '--base': '550ms', '--d': 3 } as CSSProperties} className="label flex flex-wrap gap-x-5 gap-y-1 text-muted xl:hidden">
            {t(hero.eyebrow).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {motion && (
            <span data-up {...inAttr} style={{ '--base': '550ms', '--d': 4 } as CSSProperties} aria-hidden="true" className="label hidden items-center gap-3 text-muted sm:flex">
              {t(ui.scroll)}
              <span className="relative block h-10 w-px overflow-hidden bg-line">
                <span className="scroll-cue absolute inset-x-0 top-0 h-1/2 bg-accent" />
              </span>
            </span>
          )}
        </div>

        {/* Cartouche façon plan technique (grand écran) */}
        <div
          data-hero-content
          className="absolute right-[max(48px,calc((100vw-1320px)/2+48px))] hidden w-[340px] border border-line text-[13px] xl:block"
          style={{ bottom: 'calc(96px + env(safe-area-inset-bottom, 0px))' }}
        >
          <p data-up {...inAttr} style={{ '--base': '550ms', '--d': 5 } as CSSProperties} className="label flex justify-between border-b border-line px-4 py-3 text-accent-ink">
            <span>{t(hero.sheet.title)}</span>
            <span className="tabular-nums">2026</span>
          </p>
          <dl className="m-0">
            {hero.sheet.rows.map((row) => (
              <div data-up {...inAttr} style={{ '--base': '550ms', '--d': 6 } as CSSProperties} key={row.k.fr} className="grid grid-cols-[96px_1fr] border-b border-line last:border-b-0">
                <dt className="label border-r border-line px-4 py-2.5 text-[10.5px] text-muted">{t(row.k)}</dt>
                <dd className="m-0 px-4 py-2.5">{t(row.v)}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Le cercle qui s'ouvre sur les projets (le vrai titre de section est dans Projets) */}
        {motion && (
          <div
            data-portal
            aria-hidden="true"
            className="tone-paper absolute inset-0 flex items-center bg-bg text-fg"
            style={{ clipPath: 'circle(0% at 50% 58%)' }}
          >
            <div className="wrap">
              <p data-portal-item className="label mb-6 text-accent-ink">
                {t(hero.portalKicker)}
              </p>
              <p data-portal-item className="max-w-[15ch] font-display text-[clamp(44px,7.4vw,120px)] leading-[0.95] tracking-[-0.02em]">
                {t(hero.portalTitle)}
              </p>
              <p data-portal-item className="mt-8 max-w-[44ch] text-[18px] text-muted">
                {t(hero.portalText)}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
