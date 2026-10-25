import { useEffect, useRef, useState } from 'react'
import type { Project } from '../data/projects'
import { projectsUi } from '../data/content'
import { useLang } from '../lib/i18n'
import { gsap } from '../lib/motion'

type Props = {
  project: Project
  motion: boolean
  flip?: boolean
  /** Appelé quand la vidéo passe d'un « temps » à l'autre */
  onBeat?: (index: number) => void
}

const file = (slug: string, ext: string) => `${import.meta.env.BASE_URL}demos/${slug}.${ext}`

// La démo du projet tourne en boucle comme un GIF, mais en vidéo : plus
// légère et plus fluide. Elle se charge à l'approche, ne joue que lorsqu'elle
// est à l'écran, et un bouton la met en pause. Avec les mouvements réduits,
// elle reste à l'arrêt jusqu'à ce qu'on appuie sur Lecture.
export function DemoVideo({ project, motion, flip, onBeat }: Props) {
  const { t } = useLang()
  const video = useRef<HTMLVideoElement>(null)
  const bar = useRef<HTMLSpanElement>(null)
  const [paused, setPaused] = useState(!motion)
  const pausedRef = useRef(paused)
  const visible = useRef(false)
  const onBeatRef = useRef(onBeat)
  onBeatRef.current = onBeat
  // La vidéo démarre sur l'image d'attente (le 2e temps) : aucun saut au lancement
  const start = project.beats[1]?.at ?? 0

  const sync = () => {
    const v = video.current
    if (!v) return
    if (visible.current && !pausedRef.current) v.play().catch(() => {})
    else v.pause()
  }

  useEffect(() => {
    const v = video.current!
    v.muted = true
    const near = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        v.preload = 'auto'
        near.disconnect()
      },
      { rootMargin: '100% 0px' },
    )
    const seen = new IntersectionObserver(([e]) => {
      visible.current = e.isIntersecting
      sync()
    })
    near.observe(v)
    seen.observe(v)

    // Le filet et les temps suivent la vidéo
    let beat = -1
    const tick = () => {
      if (!visible.current || !v.duration) return
      bar.current!.style.transform = `scaleX(${(v.currentTime / v.duration).toFixed(4)})`
      let i = 0
      project.beats.forEach((b, n) => {
        if (v.currentTime >= b.at) i = n
      })
      if (i !== beat) {
        beat = i
        onBeatRef.current?.(i)
      }
    }
    gsap.ticker.add(tick)
    return () => {
      near.disconnect()
      seen.disconnect()
      gsap.ticker.remove(tick)
    }
  }, [project])

  useEffect(() => {
    pausedRef.current = paused
    sync()
  }, [paused])

  return (
    <figure data-film className={`m-0 min-w-0 lg:col-span-7 ${flip ? 'lg:order-2' : ''}`}>
      <div className="relative">
        <div className="overflow-hidden rounded-[14px] border border-line bg-surface shadow-[0_30px_80px_-40px_rgba(10,26,42,0.55)]">
          <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
            <span className="ml-3 truncate text-[12px] text-muted">{project.url}</span>
          </div>
          <video
            ref={video}
            src={`${file(project.slug, 'mp4')}#t=${start}`}
            poster={file(project.slug, 'webp')}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            className="block h-auto w-full bg-surface"
            style={{ aspectRatio: String(project.ratio) }}
          />
        </div>
        {/* Toute la démo est cliquable */}
        <a
          href={project.demo}
          target="_blank"
          rel="noopener"
          data-cursor={t(projectsUi.openDemo)}
          className="absolute inset-0 rounded-[14px]"
          aria-label={`${t(projectsUi.openDemo)} : ${project.name} (${t(projectsUi.newTab)})`}
        />
      </div>
      <figcaption className="sr-only">{t(project.alt)}</figcaption>
      <div className="mt-3 flex items-center gap-4">
        <span className="relative block h-px flex-1 overflow-hidden bg-line">
          <span ref={bar} className="absolute inset-0 origin-left bg-accent" style={{ transform: 'scaleX(0)' }} />
        </span>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="label inline-flex items-center gap-2 py-1 text-[11px] text-muted transition-colors hover:text-fg"
        >
          <svg aria-hidden="true" viewBox="0 0 10 10" className="h-2.5 w-2.5 fill-current">
            {paused ? <path d="M2 1l7 4-7 4z" /> : <path d="M2 1h2v8H2zM6 1h2v8H6z" />}
          </svg>
          {paused ? t(projectsUi.play) : t(projectsUi.pause)}
          <span className="sr-only">
            {' '}
            ({t(projectsUi.demoOf)} {project.name})
          </span>
        </button>
      </div>
    </figure>
  )
}
