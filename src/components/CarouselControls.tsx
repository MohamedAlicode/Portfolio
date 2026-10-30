import type { RefObject } from 'react'
import { projectsUi } from '../data/content'
import { useLang } from '../lib/i18n'

type Props = {
  /** Nom de chaque carte, pour les points (« Afficher Altaïr ») */
  names: string[]
  active: number
  onGo: (i: number) => void
  onStep: (d: number) => void
  stopped: boolean
  onToggle: () => void
  fillRef: RefObject<HTMLSpanElement | null>
  prevLabel: string
  nextLabel: string
}

// Sous un carrousel : flèches et points au milieu, Pause / Lecture à droite.
// Le point actif s'allonge et se remplit au fil du minuteur.
export function CarouselControls({ names, active, onGo, onStep, stopped, onToggle, fillRef, prevLabel, nextLabel }: Props) {
  const { t } = useLang()
  return (
    <div className="wrap mt-6 grid grid-cols-[1fr_auto_1fr] items-center lg:mt-8">
      <div className="col-start-2 flex items-center gap-3 sm:gap-5">
        <button type="button" onClick={() => onStep(-1)} className="carousel-btn" aria-label={prevLabel}>
          <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4">
            <path d="M10 3L5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </button>
        <ul className="flex items-center">
          {names.map((name, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => onGo(i)}
                aria-label={`${t(projectsUi.show)} ${name}`}
                aria-current={i === active ? 'true' : undefined}
                className="carousel-dot"
              >
                <span ref={i === active ? fillRef : undefined} />
              </button>
            </li>
          ))}
        </ul>
        <button type="button" onClick={() => onStep(1)} className="carousel-btn" aria-label={nextLabel}>
          <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4">
            <path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </button>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className="carousel-btn justify-self-end"
        aria-label={stopped ? t(projectsUi.autoPlay) : t(projectsUi.autoPause)}
      >
        <svg aria-hidden="true" viewBox="0 0 10 10" className="h-2.5 w-2.5 fill-current">
          {stopped ? <path d="M2 1l7 4-7 4z" /> : <path d="M2 1h2v8H2zM6 1h2v8H6z" />}
        </svg>
      </button>
    </div>
  )
}
