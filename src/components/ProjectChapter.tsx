import { useCallback, useRef } from 'react'
import type { Project } from '../data/projects'
import { projectsUi } from '../data/content'
import { useLang } from '../lib/i18n'
import { clamp, gsap, ScrollTrigger, useGSAP } from '../lib/motion'
import { useSection } from '../hooks/useSection'
import { useMagnetic } from '../hooks/useMagnetic'
import { FilmCanvas } from './FilmCanvas'
import { Counter } from './Counter'

type Entrance = 'slide' | 'curtain' | 'rise'
type Props = { project: Project; index: number; total: number; motion: boolean; entrance: Entrance; flip?: boolean }

// Un projet = un moment à l'écran. Le chapitre reste épinglé pendant que la
// démo se rejoue au scroll ; ses « temps » s'allument au fil du film, comme la
// liste de l'anatomie d'Altaïr. Viennent ensuite les chiffres, la stack et les liens.
export function ProjectChapter({ project, index, total, motion, entrance, flip }: Props) {
  const { t, lang } = useLang()
  const root = useRef<HTMLElement>(null)
  const pin = useRef<HTMLDivElement>(null)
  const progress = useRef(motion ? 0 : 0.5)
  const demoBtn = useRef<HTMLAnchorElement>(null)
  const codeBtn = useRef<HTMLAnchorElement>(null)
  useMagnetic(demoBtn)
  useMagnetic(codeBtn)
  useSection(root, project.zone, { id: project.slug, num: index + 1 })

  // Le scroll pilote le film ; un temps de pause au début et à la fin
  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: pin.current,
        start: motion ? 'top top' : 'top bottom',
        end: motion ? 'bottom bottom' : 'bottom top',
        onUpdate: (self) => {
          progress.current = motion ? clamp((self.progress - 0.06) / 0.84) : self.progress
        },
      })
    },
    { scope: root, dependencies: [motion] },
  )

  // Entrée du chapitre : chaque projet a la sienne (glissé, rideau, montée)
  useGSAP(
    () => {
      if (!motion) return
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: { trigger: pin.current, start: 'top 75%', toggleActions: 'play none none reverse' },
      })
      const kids = '[data-kid]'
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

      gsap.from('[data-detail]', {
        y: 40,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '[data-details]', start: 'top 85%', toggleActions: 'play none none reverse' },
      })
    },
    { scope: root, dependencies: [motion, lang], revertOnUpdate: true },
  )

  // Les « temps » s'allument quand le film atteint leur image
  const onFrame = useCallback(
    (frame: number) => {
      const el = root.current
      if (!el) return
      let active = 0
      project.beats.forEach((b, i) => {
        if (frame >= b.from) active = i
      })
      el.querySelectorAll<HTMLElement>('[data-beat]').forEach((li, i) => {
        li.toggleAttribute('data-active', i === active)
        li.toggleAttribute('data-past', i < active)
      })
      const bar = el.querySelector<HTMLElement>('[data-progress]')
      if (bar) bar.style.transform = `scaleX(${(frame / (project.frames - 1)).toFixed(3)})`
    },
    [project],
  )

  const titleId = `${project.slug}-title`

  return (
    <article id={project.slug} ref={root} aria-labelledby={titleId} className="relative">
      <div ref={pin} className={`relative ${motion ? 'h-[280vh] lg:h-[330vh]' : ''}`}>
        <div className={`${motion ? 'sticky top-0 h-svh' : 'min-h-svh py-20'} flex items-center lg:pt-16`}>
          <div className="wrap grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
            <figure
              data-film
              data-cursor={t(projectsUi.openDemo)}
              className={`relative m-0 min-w-0 lg:col-span-7 ${flip ? 'lg:order-2' : ''}`}
            >
              <div className="overflow-hidden rounded-[14px] border border-line bg-surface shadow-[0_30px_80px_-40px_rgba(10,26,42,0.55)]">
                <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-line" />
                  <span className="h-2.5 w-2.5 rounded-full bg-line" />
                  <span className="h-2.5 w-2.5 rounded-full bg-line" />
                  <span className="ml-3 truncate text-[12px] text-muted">{project.url}</span>
                </div>
                <FilmCanvas project={project} progress={progress} onFrame={onFrame} label={t(project.poster)} />
              </div>
              {/* Toute la démo est cliquable */}
              <a
                href={project.demo}
                target="_blank"
                rel="noopener"
                className="absolute inset-0 rounded-[14px]"
                aria-label={`${t(projectsUi.openDemo)} : ${project.name} (${t(projectsUi.newTab)})`}
              />
              <div className="mt-3 flex items-center gap-4">
                <span className="relative block h-px flex-1 overflow-hidden bg-line">
                  <span data-progress className="absolute inset-0 origin-left scale-x-0 bg-accent" />
                </span>
                <span className="label text-[11px] text-muted">{t(projectsUi.scrollHint)}</span>
              </div>
            </figure>

            <div className="min-w-0 lg:col-span-5">
              <p data-kid className="label flex gap-3 text-muted">
                <span className="tabular-nums text-accent-ink">
                  {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                </span>
                <span>{t(project.kind)}</span>
              </p>
              <h3 id={titleId} data-kid className="mt-3 font-display text-[clamp(44px,min(6vw,10svh),92px)] leading-[0.95] font-normal tracking-[-0.02em]">
                {project.name}
              </h3>
              <div className={motion ? 'hidden lg:block' : ''}>
                <Intro project={project} />
              </div>
              <ol data-kid className="beats mt-6 border-t border-line lg:mt-7">
                {project.beats.map((b, i) => (
                  <li
                    key={i}
                    data-beat
                    {...(i === 0 ? { 'data-active': '' } : {})}
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
        </div>
      </div>

      <div data-details className="wrap grid gap-12 pt-6 pb-28 lg:grid-cols-12 lg:gap-14 lg:pb-40">
        {motion && (
          <div data-detail className="lg:hidden">
            <Intro project={project} />
          </div>
        )}
        <dl className="grid grid-cols-3 gap-4 lg:col-span-7">
          {project.facts.map((f, i) => (
            <div data-detail key={i} className="min-w-0 border-t border-line pt-5">
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
          <p data-detail className="label text-muted">{t(projectsUi.role)}</p>
          <p data-detail className="mt-2">{t(project.role)}</p>
          <p data-detail className="label mt-7 text-muted">{t(projectsUi.stack)}</p>
          <ul data-detail className="mt-3 flex flex-wrap gap-1.5">
            {project.stack.map((s) => (
              <li key={s} className="rounded-[4px] border border-line px-2.5 py-1 text-[13px] text-muted">
                {s}
              </li>
            ))}
          </ul>
          <div data-detail className="mt-8 flex flex-wrap gap-3">
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
            <p data-detail className="mt-4 text-[13.5px] text-muted">
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
