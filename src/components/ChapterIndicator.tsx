import { useRef } from 'react'
import { chapters } from '../data/content'
import { useChapter } from '../lib/chapters'
import { useLang } from '../lib/i18n'
import { gsap, ScrollTrigger, useGSAP } from '../lib/motion'

// En bas à gauche : numéro et nom du chapitre en cours, avec un filet
// qui avance dans la page (repris d'Altaïr).
export function ChapterIndicator() {
  const chapter = useChapter()
  const { t } = useLang()
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.to(ref.current, { autoAlpha: chapter ? 1 : 0, duration: 0.5 })
      if (chapter) {
        gsap.fromTo(
          '[data-swap]',
          { yPercent: 80, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.6, stagger: 0.05, ease: 'power3.out', overwrite: true },
        )
      }
    },
    { scope: ref, dependencies: [chapter?.id] },
  )

  useGSAP(
    () => {
      const bar = ref.current!.querySelector('[data-line]')
      gsap.fromTo(bar, { scaleX: 0 }, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: 0.3 },
      })
      return () => ScrollTrigger.refresh()
    },
    { scope: ref },
  )

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed z-30 hidden items-center gap-4 opacity-0 md:flex"
      style={{
        left: 'max(48px, env(safe-area-inset-left, 0px))',
        bottom: 'calc(28px + env(safe-area-inset-bottom, 0px))',
      }}
    >
      <span className="block overflow-hidden">
        <span data-swap className="label block tabular-nums text-accent-ink">
          {chapter ? String(chapter.num).padStart(2, '0') : ''}
        </span>
      </span>
      <span className="relative block h-px w-14 overflow-hidden bg-line">
        <span data-line className="absolute inset-0 origin-left bg-accent" />
      </span>
      <span className="block overflow-hidden">
        <span data-swap className="label block text-muted">
          {chapter ? t(chapters[chapter.id]) : ''}
        </span>
      </span>
    </div>
  )
}
