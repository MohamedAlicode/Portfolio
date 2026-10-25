import { useCallback, useRef, type CSSProperties } from 'react'
import type { Project } from '../data/projects'
import { projectsUi } from '../data/content'
import { useLang } from '../lib/i18n'
import { gsap, useGSAP } from '../lib/motion'
import { useSection } from '../hooks/useSection'
import { useReveal } from '../hooks/useReveal'
import { useMagnetic } from '../hooks/useMagnetic'
import { DemoVideo } from './DemoVideo'
import { Counter } from './Counter'

type Entrance = 'slide' | 'curtain' | 'rise'
type Props = { project: Project; index: number; total: number; motion: boolean; entrance: Entrance; flip?: boolean }

// Un projet : la démo tourne en boucle à côté de ses « temps », qui s'allument
// au fil de la vidéo comme la liste de l'anatomie d'Altaïr. Viennent ensuite
// les chiffres, la stack et les liens.
export function ProjectChapter({ project, index, total, motion, entrance, flip }: Props) {
  const { t, lang } = useLang()
  const root = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const demoBtn = useRef<HTMLAnchorElement>(null)
  const codeBtn = useRef<HTMLAnchorElement>(null)
  useMagnetic(demoBtn)
  useMagnetic(codeBtn)
  useSection(root, project.zone, { id: project.slug, num: index + 1 })
  useReveal(root, motion, [lang])

  // Entrée du chapitre : chaque projet a la sienne (glissé, rideau, montée).
  // Préparée seulement quand le chapitre approche (rien à calculer au
  // chargement), jouée aux trois quarts de l'écran, rembobinée si on remonte.
  useGSAP(
    (_, contextSafe) => {
      const el = stage.current
      if (!motion || !el || !contextSafe) return
      let tl: gsap.core.Timeline | null = null
      const build = contextSafe(() => {
        tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } })
        // Seulement les éléments affichés (certains n'existent qu'en grand écran)
        const kids = gsap.utils.toArray<HTMLElement>('[data-kid]', root.current).filter((k) => k.getClientRects().length > 0)
        tl.fromTo(
          '[data-film]',
          { clipPath: 'inset(14% 10% 14% 10% round 14px)' },
          { clipPath: 'inset(0% 0% 0% 0% round 14px)', duration: 1.4, ease: 'expo.out' },
          0,
        )
        if (entrance === 'slide') tl.from(kids, { x: flip ? -70 : 70, autoAlpha: 0, stagger: 0.09, duration: 1 }, 0.1)
        else if (entrance === 'curtain')
          tl.fromTo(
            kids,
            { clipPath: 'inset(100% 0% -20% 0%)', y: 24, autoAlpha: 0 },
            { clipPath: 'inset(-20% 0% -20% 0%)', y: 0, autoAlpha: 1, stagger: 0.09, duration: 1.1, ease: 'power4.inOut' },
            0.1,
          )
        else tl.from(kids, { y: 50, rotation: 2, transformOrigin: '0% 100%', autoAlpha: 0, stagger: 0.08, duration: 1 }, 0.1)
      })

      const near = new IntersectionObserver(
        ([e]) => {
          if (!e.isIntersecting || tl) return
          build()
          near.disconnect()
          play.observe(el)
        },
        { rootMargin: '100% 0px' },
      )
      const play = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) tl?.play()
          else if (e.boundingClientRect.top > 0) tl?.reverse()
        },
        { rootMargin: '0px 0px -25% 0px' },
      )
      near.observe(el)
      return () => {
        near.disconnect()
        play.disconnect()
      }
    },
    { scope: root, dependencies: [motion, lang], revertOnUpdate: true },
  )

  // Les « temps » s'allument au fil de la vidéo
  const onBeat = useCallback((active: number) => {
    root.current?.querySelectorAll<HTMLElement>('[data-beat]').forEach((li, i) => {
      li.toggleAttribute('data-active', i === active)
      li.toggleAttribute('data-past', i < active)
    })
  }, [])

  const titleId = `${project.slug}-title`

  return (
    <article id={project.slug} ref={root} aria-labelledby={titleId} className="relative">
      <div ref={stage} className="wrap grid items-center gap-8 pt-16 lg:grid-cols-12 lg:gap-14 lg:pt-24">
        <DemoVideo project={project} motion={motion} flip={flip} onBeat={onBeat} />

        <div className="min-w-0 lg:col-span-5">
          <p data-kid className="label flex gap-3 text-muted">
            <span className="tabular-nums text-accent-ink">
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
            <span>{t(project.kind)}</span>
          </p>
          <h3 id={titleId} data-kid className="mt-3 font-display text-[clamp(44px,6vw,92px)] leading-[0.95] font-normal tracking-[-0.02em]">
            {project.name}
          </h3>
          <Intro project={project} />
          <ol data-kid className="beats mt-6 border-t border-line lg:mt-7">
            {project.beats.map((b, i) => (
              <li
                key={i}
                data-beat
                {...(i === Math.min(1, project.beats.length - 1) ? { 'data-active': '' } : {})}
                className="beat grid grid-cols-[2.2rem_1fr] border-b border-line py-3"
              >
                <span className="label pt-[3px] tabular-nums text-accent-ink">{String(i + 1).padStart(2, '0')}</span>
                <span>
                  <span className="block font-medium">{t(b.title)}</span>
                  <span className="beat-text block text-[14.5px] leading-[1.5] text-muted">{t(b.text)}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div data-details className="wrap grid gap-12 pt-12 pb-16 lg:grid-cols-12 lg:gap-14 lg:pt-14 lg:pb-24">
        <dl className="grid grid-cols-3 gap-4 lg:col-span-7">
          {project.facts.map((f, i) => (
            <div data-up style={{ '--d': 1 + i } as CSSProperties} key={i} className="min-w-0 border-t border-line pt-5">
              <dt className="sr-only">{t(f.label)}</dt>
              <dd className="m-0">
                <span className="block font-display text-[clamp(40px,5vw,76px)] leading-none">
                  <Counter value={f.value} suffix={f.suffix ? t(f.suffix) : ''} motion={motion} />
                </span>
                <span aria-hidden="true" className="mt-3 block text-[14px] leading-[1.4] text-muted">
                  {t(f.label)}
                </span>
              </dd>
            </div>
          ))}
        </dl>
        <div className="min-w-0 lg:col-span-5">
          <p data-up style={{ '--d': 2 } as CSSProperties} className="label text-muted">{t(projectsUi.role)}</p>
          <p data-up style={{ '--d': 3 } as CSSProperties} className="mt-2">{t(project.role)}</p>
          <p data-up style={{ '--d': 4 } as CSSProperties} className="label mt-7 text-muted">{t(projectsUi.stack)}</p>
          <ul data-up style={{ '--d': 5 } as CSSProperties} className="mt-3 flex flex-wrap gap-1.5">
            {project.stack.map((s) => (
              <li key={s} className="rounded-[4px] border border-line px-2.5 py-1 text-[13px] text-muted">
                {s}
              </li>
            ))}
          </ul>
          <div data-up style={{ '--d': 6 } as CSSProperties} className="mt-8 flex flex-wrap gap-3">
            <a ref={demoBtn} href={project.demo} target="_blank" rel="noopener" className="btn btn-primary">
              {t(projectsUi.demo)} <span className="arrow" aria-hidden="true">↗</span>
              <span className="sr-only">({t(projectsUi.newTab)})</span>
            </a>
            <a ref={codeBtn} href={project.code} target="_blank" rel="noopener" className="btn">
              {t(projectsUi.code)}
              <span className="sr-only">({t(projectsUi.newTab)})</span>
            </a>
          </div>
          {project.demoNote && (
            <p data-up style={{ '--d': 6 } as CSSProperties} className="mt-4 text-[13.5px] text-muted">
              {t(project.demoNote)}
            </p>
          )}
        </div>
      </div>
    </article>
  )
}

function Intro({ project }: { project: Project }) {
  const { t } = useLang()
  return (
    <>
      <p data-kid className="mt-5 max-w-[36ch] text-[clamp(17px,1.5vw,21px)] leading-[1.45]">
        {t(project.hook)}
      </p>
      {project.notice && (
        <p data-kid className="mt-4 flex items-start gap-2 text-[13.5px] text-muted">
          <span className="label mt-[3px] shrink-0 rounded-[4px] border border-accent-ink px-1.5 py-0.5 text-[10px] text-accent-ink">
            {t(projectsUi.honest)}
          </span>
          <span>{t(project.notice)}</span>
        </p>
      )}
    </>
  )
}
