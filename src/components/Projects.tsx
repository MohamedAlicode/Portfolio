import { projects } from '../data/projects'
import { projectsUi } from '../data/content'
import { useLang } from '../lib/i18n'
import { ProjectChapter } from './ProjectChapter'

const entrances = ['slide', 'curtain', 'rise'] as const

export function Projects({ motion, count = projects.length }: { motion: boolean; count?: number }) {
  const { t } = useLang()
  return (
    <section id="projets" aria-labelledby="projets-title">
      {/* Avec les animations, ce titre est montré par le cercle du hero */}
      <div className={motion ? 'sr-only' : 'wrap pt-28'}>
        <p className="label text-accent-ink">{t(projectsUi.kicker)}</p>
        <h2 id="projets-title" className="mt-6 max-w-[16ch] font-display text-[clamp(44px,7vw,110px)] leading-[0.95] font-normal">
          {t(projectsUi.title)}
        </h2>
      </div>
      {projects.slice(0, count).map((p, i) => (
        <ProjectChapter
          key={p.slug}
          project={p}
          index={i}
          total={projects.length}
          motion={motion}
          entrance={entrances[i % entrances.length]}
          flip={i === 1}
        />
      ))}
    </section>
  )
}
