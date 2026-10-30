import { useRef } from 'react'
import type { Project } from '../data/projects'
import { projectsUi } from '../data/content'
import { useLang } from '../lib/i18n'
import { useMagnetic } from '../hooks/useMagnetic'
import { Counter } from './Counter'

type Props = { project: Project; index: number; total: number; motion: boolean }

// Sous le carrousel : la fiche du projet affiché (accroche, chiffres, stack,
// liens). Elle change avec la carte, en fondu.
export function ProjectDetails({ project, index, total, motion }: Props) {
  const { t } = useLang()
  const demoBtn = useRef<HTMLAnchorElement>(null)
  const codeBtn = useRef<HTMLAnchorElement>(null)
  useMagnetic(demoBtn)
  useMagnetic(codeBtn)
  const titleId = `${project.slug}-title`

  return (
    <article aria-labelledby={titleId} className="wrap grid gap-10 pt-10 lg:grid-cols-12 lg:gap-14 lg:pt-14">
      <div className="min-w-0 lg:col-span-6">
        <p className="label flex gap-3 text-muted">
          <span className="tabular-nums text-accent-ink">
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          <span>{t(project.kind)}</span>
        </p>
        <h3 id={titleId} className="mt-3 font-display text-[clamp(40px,5vw,76px)] leading-[0.95] font-normal tracking-[-0.02em]">
          {project.name}
        </h3>
        <p className="mt-5 max-w-[40ch] text-[clamp(17px,1.5vw,21px)] leading-[1.45]">{t(project.hook)}</p>
        {project.notice && (
          <p className="mt-4 flex items-start gap-2 text-[13.5px] text-muted">
            <span className="label mt-[3px] shrink-0 rounded-[4px] border border-accent-ink px-1.5 py-0.5 text-[10px] text-accent-ink">
              {t(projectsUi.honest)}
            </span>
            <span>{t(project.notice)}</span>
          </p>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          <a ref={demoBtn} href={project.demo} target="_blank" rel="noopener" className="btn btn-primary">
            {t(projectsUi.demo)} <span className="arrow" aria-hidden="true">↗</span>
            <span className="sr-only">({t(projectsUi.newTab)})</span>
          </a>
          <a ref={codeBtn} href={project.code} target="_blank" rel="noopener" className="btn">
            {t(projectsUi.code)}
            <span className="sr-only">({t(projectsUi.newTab)})</span>
          </a>
        </div>
        {project.demoNote && <p className="mt-4 text-[13.5px] text-muted">{t(project.demoNote)}</p>}
      </div>

      <div className="min-w-0 lg:col-span-6">
        <dl className="grid grid-cols-3 gap-4">
          {project.facts.map((f, i) => (
            <div key={i} className="min-w-0 border-t border-line pt-5">
              <dt className="sr-only">{t(f.label)}</dt>
              <dd className="m-0">
                <span className="block font-display text-[clamp(36px,4vw,64px)] leading-none">
                  <Counter value={f.value} suffix={f.suffix ? t(f.suffix) : ''} motion={motion} />
                </span>
                <span aria-hidden="true" className="mt-3 block text-[14px] leading-[1.4] text-muted">
                  {t(f.label)}
                </span>
              </dd>
            </div>
          ))}
        </dl>
        <p className="label mt-8 text-muted">{t(projectsUi.role)}</p>
        <p className="mt-2">{t(project.role)}</p>
        <p className="label mt-6 text-muted">{t(projectsUi.stack)}</p>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <li key={s} className="rounded-[4px] border border-line px-2.5 py-1 text-[13px] text-muted">
              {s}
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
