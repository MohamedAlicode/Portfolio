import { useRef, type CSSProperties, type MouseEvent } from 'react'
import { proofs, skills, type SkillGroup } from '../data/content'
import { useLang } from '../lib/i18n'
import { scrollToHash } from '../lib/scroll'
import { showProject } from '../lib/showcase'
import { useSection } from '../hooks/useSection'
import { useReveal } from '../hooks/useReveal'
import { useCarousel } from '../hooks/useCarousel'
import { Marquee } from './Marquee'
import { SplitChars } from './SplitChars'
import { CarouselControls } from './CarouselControls'

const groups = skills.groups as SkillGroup[]
const n = groups.length

// Compétences groupées par domaine, une carte par domaine, en carrousel
// comme les projets (voir useCarousel) : plusieurs cartes visibles à la fois,
// celle du milieu mise en avant. Chacune renvoie au projet ou au poste où
// la compétence a servi.
export function Skills({ motion }: { motion: boolean }) {
  const { t, lang } = useLang()
  const root = useRef<HTMLElement>(null)
  useSection(root, 'base', { id: 'competences', num: 4 })
  useReveal(root, motion, [lang])
  const c = useCarousel({ count: n, delay: 4 })
  const { pos, active, mod, step } = c

  const slots = [-3, -2, -1, 0, 1, 2, 3].map((o) => pos + o)

  return (
    <section id="competences" ref={root} aria-labelledby="competences-title" className="relative overflow-hidden pb-20 lg:pb-28">
      <Marquee motion={motion} />
      <header className="wrap grid gap-6 pt-20 lg:grid-cols-12 lg:items-end lg:gap-14 lg:pt-24">
        <div className="lg:col-span-7">
          <p data-up className="label text-accent-ink">
            {t(skills.kicker)}
          </p>
          <h2
            id="competences-title"
            data-chars
            className="mt-6 font-display text-[clamp(44px,5.2vw,84px)] leading-[0.95] font-normal tracking-[-0.01em]"
          >
            <SplitChars lines={t(skills.title)} />
          </h2>
        </div>
        <p data-up className="max-w-[40ch] text-muted lg:col-span-5">
          {t(skills.intro)}
        </p>
      </header>

      <div role="region" aria-roledescription={t(skills.carousel)} aria-label={t(skills.kicker)} data-up className="mt-12 lg:mt-16" {...c.regionProps}>
        <p className="sr-only" aria-live={c.running ? 'off' : 'polite'} aria-atomic="true">
          {`${t(skills.slide)} ${active + 1} / ${n} : ${t(groups[active].name)}`}
        </p>
        <div className="carousel carousel-cards relative touch-pan-y select-none" {...c.trackProps}>
          {/* Les cartes empilées, invisibles, donnent à la piste la hauteur de la plus haute */}
          <div aria-hidden="true" className="invisible mx-auto grid w-[var(--w)]">
            {groups.map((g, i) => (
              <div key={i} className="[grid-area:1/1]">
                <SkillCard group={g} index={i} />
              </div>
            ))}
          </div>
          {slots.map((k) => {
            const offset = k - pos
            const i = mod(k)
            return (
              <div
                key={k}
                role="group"
                aria-roledescription={t(skills.slide)}
                aria-label={`${i + 1} / ${n} : ${t(groups[i].name)}`}
                aria-hidden={offset ? true : undefined}
                data-center={offset === 0 || undefined}
                tabIndex={offset === 0 ? -1 : undefined}
                className="carousel-slide skill-slide"
                style={{ '--o': offset } as CSSProperties}
                onClick={offset ? () => step(offset) : undefined}
              >
                <SkillCard group={groups[i]} index={i} live={offset === 0} />
              </div>
            )
          })}
        </div>
        <CarouselControls
          names={groups.map((g) => t(g.name))}
          active={active}
          onGo={c.go}
          onStep={step}
          stopped={c.stopped}
          onToggle={c.toggle}
          fillRef={c.fillRef}
          prevLabel={t(skills.prev)}
          nextLabel={t(skills.next)}
        />
      </div>
    </section>
  )
}

// Une carte : numéro, domaine, outils, et où ils ont servi. Seule la carte
// du milieu (live) a des liens actifs.
function SkillCard({ group, index, live }: { group: SkillGroup; index: number; live?: boolean }) {
  const { t } = useLang()
  const go = (e: MouseEvent<HTMLAnchorElement>, hash: string, project?: string) => {
    e.preventDefault()
    if (project) showProject(project)
    scrollToHash(hash)
  }
  return (
    <div className="skill-card flex h-full flex-col rounded-[14px] border border-line bg-surface p-6 lg:p-8">
      <span className="label tabular-nums text-accent-ink">{String(index + 1).padStart(2, '0')}</span>
      <h3 className="mt-3 font-display text-[clamp(30px,2.8vw,42px)] leading-[1.02] font-normal">{t(group.name)}</h3>
      <ul className="mt-5 flex flex-wrap gap-1.5">
        {group.items.map((item, j) => (
          <li key={j} className="rounded-[4px] border border-line px-2.5 py-1 text-[14px]">
            {typeof item === 'string' ? item : t(item)}
          </li>
        ))}
      </ul>
      {group.proof.length > 0 && (
        <p className="mt-auto flex flex-wrap items-center gap-1.5 pt-6 text-[13px] text-muted">
          <span className="label mr-1 text-[11px]">{t(skills.proofLabel)}</span>
          {group.proof.map((p) =>
            live ? (
              <a
                key={p}
                href={proofs[p].href}
                draggable={false}
                onClick={(e) => go(e, proofs[p].href, proofs[p].project)}
                className="rounded-[4px] border border-line px-2 py-0.5 transition-colors hover:border-accent hover:text-fg"
              >
                {proofs[p].name}
              </a>
            ) : (
              <span key={p} className="rounded-[4px] border border-line px-2 py-0.5">
                {proofs[p].name}
              </span>
            ),
          )}
        </p>
      )}
    </div>
  )
}
