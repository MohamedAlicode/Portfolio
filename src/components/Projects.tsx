import { useEffect, useRef, type CSSProperties } from 'react'
import { projects } from '../data/projects'
import { projectsUi } from '../data/content'
import { useLang } from '../lib/i18n'
import { setChapter } from '../lib/chapters'
import { onShowProject } from '../lib/showcase'
import { useSection } from '../hooks/useSection'
import { useReveal } from '../hooks/useReveal'
import { useCarousel } from '../hooks/useCarousel'
import { ProjectSlide } from './ProjectSlide'
import { ProjectDetails } from './ProjectDetails'
import { CarouselControls } from './CarouselControls'

const n = projects.length

// Les projets en carrousel, comme la une d'Apple TV : la carte du milieu en
// grand, ses voisines qui dépassent sur les côtés, des points en dessous.
// Il avance tout seul toutes les 6 secondes (voir useCarousel pour le
// comportement complet). On dessine les positions pos-2 à pos+2.
export function Projects({ motion }: { motion: boolean }) {
  const { t, lang } = useLang()
  const root = useRef<HTMLElement>(null)
  const c = useCarousel({ count: n, motion, initial: Math.max(0, projects.findIndex((p) => `#${p.slug}` === location.hash)) })
  const { pos, active, mod, go, step } = c
  const project = projects[active]

  useSection(root, 'paper', { id: project.slug, num: active + 1 })
  useReveal(root, motion, [lang])

  // Le chapitre en bas à gauche suit le projet affiché
  useEffect(() => {
    const r = root.current?.getBoundingClientRect()
    if (r && r.top < innerHeight / 2 && r.bottom > innerHeight / 2) setChapter({ id: project.slug, num: active + 1 })
  }, [project.slug, active])

  // Un lien « Vu dans Altaïr » amène le carrousel sur Altaïr
  useEffect(
    () =>
      onShowProject((slug) => {
        const i = projects.findIndex((p) => p.slug === slug)
        if (i >= 0) go(i)
      }),
    [go],
  )

  const slots = [-2, -1, 0, 1, 2].map((o) => pos + o)

  return (
    <section id="projets" ref={root} aria-labelledby="projets-title" className="relative overflow-hidden pt-16 pb-20 lg:pt-20 lg:pb-28">
      {/* Avec les animations, ce titre est montré par le cercle du hero */}
      <div className={motion ? 'sr-only' : 'wrap pb-12'}>
        <p className="label text-accent-ink">{t(projectsUi.kicker)}</p>
        <h2 id="projets-title" className="mt-6 max-w-[16ch] font-display text-[clamp(44px,7vw,110px)] leading-[0.95] font-normal">
          {t(projectsUi.title)}
        </h2>
      </div>

      <div role="region" aria-roledescription={t(projectsUi.carousel)} aria-label={t(projectsUi.kicker)} data-up {...c.regionProps}>
        {/* Annonce le projet affiché aux lecteurs d'écran (sauf pendant le défilement automatique) */}
        <p className="sr-only" aria-live={c.running ? 'off' : 'polite'} aria-atomic="true">
          {`${t(projectsUi.slide)} ${active + 1} ${t(projectsUi.of)} ${n} : ${project.name}`}
        </p>

        <div className="carousel relative touch-pan-y select-none" {...c.trackProps}>
          {/* Donne sa hauteur à la piste : les cartes sont posées par-dessus */}
          <div aria-hidden="true" className="carousel-size invisible mx-auto" />
          {slots.map((k) => (
            <ProjectSlide
              key={k}
              project={projects[mod(k)]}
              index={mod(k)}
              total={n}
              offset={k - pos}
              playing={k === pos && c.visible && motion && !c.stopped}
              onSelect={() => step(k - pos)}
            />
          ))}
        </div>

        <CarouselControls
          names={projects.map((p) => p.name)}
          active={active}
          onGo={go}
          onStep={step}
          stopped={c.stopped}
          onToggle={c.toggle}
          fillRef={c.fillRef}
          prevLabel={t(projectsUi.prev)}
          nextLabel={t(projectsUi.next)}
        />
      </div>

      {/* Les trois fiches sont empilées dans la même case : la hauteur ne
          change pas d'un projet à l'autre, la page ne saute pas */}
      <div data-up style={{ '--d': 2 } as CSSProperties} className="grid">
        {projects.map((p, i) => (
          <div key={p.slug} className="project-details [grid-area:1/1]" data-active={i === active || undefined} inert={i !== active}>
            <ProjectDetails project={p} index={i} total={n} motion={motion} />
          </div>
        ))}
      </div>
    </section>
  )
}
