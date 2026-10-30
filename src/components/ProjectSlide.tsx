import { useEffect, useRef, type CSSProperties } from 'react'
import type { Project } from '../data/projects'
import { projectsUi } from '../data/content'
import { useLang } from '../lib/i18n'

type Props = {
  project: Project
  index: number
  total: number
  /** Place par rapport à la carte du milieu : -1 à gauche, 0 au milieu, 1 à droite… */
  offset: number
  /** La démo tourne (seulement la carte du milieu, à l'écran) */
  playing: boolean
  /** Clic sur une voisine : elle passe au milieu */
  onSelect: () => void
}

const file = (slug: string, ext: string) => `${import.meta.env.BASE_URL}demos/${slug}.${ext}`

// Une carte du carrousel : la démo du projet en fond, en boucle, avec son
// nom et un bouton « Voir la démo » en bas, comme une affiche Apple TV.
// Les voisines restent à l'arrêt sur leur image d'attente.
export function ProjectSlide({ project, index, total, offset, playing, onSelect }: Props) {
  const { t } = useLang()
  const video = useRef<HTMLVideoElement>(null)
  const center = offset === 0

  useEffect(() => {
    const v = video.current!
    v.muted = true
    if (playing) {
      v.preload = 'auto'
      v.play().catch(() => {})
    } else v.pause()
  }, [playing])

  return (
    <div
      role="group"
      aria-roledescription={t(projectsUi.slide)}
      aria-label={`${index + 1} ${t(projectsUi.of)} ${total} : ${project.name}`}
      aria-hidden={center ? undefined : true}
      data-center={center || undefined}
      className="carousel-slide"
      style={{ '--o': offset } as CSSProperties}
      onClick={center ? undefined : onSelect}
    >
      <div className="relative h-full overflow-hidden rounded-[14px] border border-line bg-surface shadow-[0_30px_80px_-40px_rgba(10,26,42,0.55)]">
        <video
          ref={video}
          src={file(project.slug, 'mp4')}
          poster={file(project.slug, 'webp')}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#0a1a2a]/90 via-[#0a1a2a]/25 via-45% to-transparent" />
        <div className="carousel-veil absolute inset-0 bg-[#0a1a2a]" aria-hidden="true" />

        <div className="carousel-caption absolute inset-x-0 bottom-0 p-4 text-[#f2ede3] sm:p-6 lg:p-9">
          <p className="font-display text-[clamp(28px,4.6vw,68px)] leading-[0.95] tracking-[-0.02em]">{project.name}</p>
          <div className="mt-3 flex items-center gap-4 lg:mt-5">
            {center ? (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener"
                draggable={false}
                data-cursor={t(projectsUi.openDemo)}
                className="relative z-10 shrink-0 rounded-full bg-[#f2ede3] px-4 py-2 text-[13px] font-medium text-[#0a1a2a] transition-colors after:absolute after:-inset-[200vmax] after:content-[''] hover:bg-[#b08d57] sm:px-5 sm:py-2.5 sm:text-[14px]"
              >
                {t(projectsUi.openDemo)}
                <span className="sr-only">
                  {' '}
                  : {project.name} ({t(projectsUi.newTab)})
                </span>
              </a>
            ) : (
              <span className="shrink-0 rounded-full bg-[#f2ede3] px-4 py-2 text-[13px] font-medium text-[#0a1a2a] sm:px-5 sm:py-2.5 sm:text-[14px]">
                {t(projectsUi.openDemo)}
              </span>
            )}
            <p className="hidden min-w-0 truncate text-[15px] sm:block">
              <span className="font-semibold">{t(project.kind)}</span>
              <span className="text-[#f2ede3]/80"> · {t(project.hook)}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
