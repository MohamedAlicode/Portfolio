import { useRef } from 'react'
import { chapters } from '../data/content'
import { useChapter } from '../lib/chapters'
import { useLang } from '../lib/i18n'
import { gsap, ScrollTrigger, useGSAP } from '../lib/motion'

// Dans la marge de gauche, écrits à la verticale : numéro et nom du chapitre
// en cours, avec un filet qui avance dans la page (repris d'Altaïr).
// À la verticale, ils ne passent jamais par-dessus le contenu.
export function ChapterIndicator() {
  const chapter = useChapter()
  const { t } = useLang()
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      // Masqué sur mobile : rien à animer
      if (!ref.current?.getClientRects().length) return
      gsap.to(ref.current, { autoAlpha: chapter ? 1 : 0, duration: 0.5 })
      if (chapter) {
        gsap.fromTo(
          '[data-swap]',
          { xPercent: 80, autoAlpha: 0 },
          { xPercent: 0, autoAlpha: 1, duration: 0.6, stagger: 0.05, ease: 'power3.out', overwrite: true },
        )
      }
    },
    { scope: ref, dependencies: [chapter?.id] },
  )

  // Le filet suit la progression dans la page (une variable CSS, rien à animer)
  useGSAP(
    () => {
      const bar = ref.current!.querySelector<HTMLElement>('[data-line]')!
      ScrollTrigger.create({
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => bar.style.setProperty('--page', self.progress.toFixed(4)),
      })
    },
    { scope: ref },
  )

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed z-30 hidden opacity-0 md:block"
      style={{
        left: 'calc(max(0px, (100vw - 1320px) / 2) + 16px)',
        bottom: 'calc(28px + env(safe-area-inset-bottom, 0px))',
      }}
    >
      <div className="flex rotate-180 items-center gap-4 [writing-mode:vertical-rl]">
        <span className="block overflow-hidden">
          <span data-swap className="label block tabular-nums text-accent-ink">
            {chapter ? String(chapter.num).padStart(2, '0') : ''}
          </span>
        </span>
        <span className="relative block h-14 w-px overflow-hidden bg-line">
          <span data-line className="absolute inset-0 origin-top bg-accent" style={{ transform: 'scaleY(var(--page, 0))' }} />
        </span>
        <span className="block overflow-hidden">
          <span data-swap className="label block text-muted">
            {chapter ? t(chapters[chapter.id]) : ''}
          </span>
        </span>
      </div>
    </div>
  )
}
