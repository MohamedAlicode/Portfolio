import { useRef, type MouseEvent } from 'react'
import { proofs, skills } from '../data/content'
import { useLang } from '../lib/i18n'
import { scrollToHash } from '../lib/scroll'
import { useSection } from '../hooks/useSection'
import { useReveal } from '../hooks/useReveal'
import { Marquee } from './Marquee'
import { SplitChars } from './SplitChars'

// Compétences groupées par domaine, chacune reliée au projet ou au poste où
// elle a servi. Un tableau de spécifications plutôt que des cartes.
export function Skills({ motion }: { motion: boolean }) {
  const { t, lang } = useLang()
  const root = useRef<HTMLElement>(null)
  useSection(root, 'base', { id: 'competences', num: 4 })
  useReveal(root, motion, [lang])

  const go = (e: MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault()
    scrollToHash(hash)
  }

  return (
    <section id="competences" ref={root} aria-labelledby="competences-title" className="relative pb-28 lg:pb-40">
      <Marquee motion={motion} />
      <div className="wrap grid gap-12 pt-24 lg:grid-cols-12 lg:gap-14 lg:pt-32">
        <header className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
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
            <p data-up className="mt-6 max-w-[34ch] text-muted">
              {t(skills.intro)}
            </p>
          </div>
        </header>

        <ol className="lg:col-span-8">
          {skills.groups.map((g, i) => (
            <li key={i} className="skill group relative grid gap-3 py-7 md:grid-cols-[2.6rem_13rem_1fr] md:gap-6 lg:py-9">
              <span data-draw aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-line" />
              <span aria-hidden="true" className="skill-fill absolute inset-x-0 top-0 h-px origin-left bg-accent" />
              <span data-up className="label pt-1 tabular-nums text-accent-ink md:pt-3">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 data-up className="font-display text-[clamp(30px,2.8vw,40px)] leading-[1.02] font-normal">
                <span className="skill-name inline-block">{t(g.name)}</span>
              </h3>
              <div className="min-w-0 md:pt-2">
                <ul data-stagger className="flex flex-wrap gap-x-1 gap-y-1 text-[17px] leading-[1.5]">
                  {g.items.map((item, j) => (
                    <li key={j} className="after:ml-1 after:text-line after:content-['/'] last:after:content-none">
                      {typeof item === 'string' ? item : t(item)}
                    </li>
                  ))}
                </ul>
                {g.proof.length > 0 && (
                  <p data-up className="mt-4 flex flex-wrap items-center gap-1.5 text-[13px] text-muted">
                    <span className="label mr-1 text-[11px]">{t(skills.proofLabel)}</span>
                    {g.proof.map((p) => (
                      <a
                        key={p}
                        href={proofs[p].href}
                        onClick={(e) => go(e, proofs[p].href)}
                        className="rounded-[4px] border border-line px-2 py-0.5 transition-colors hover:border-accent hover:text-fg"
                      >
                        {proofs[p].name}
                      </a>
                    ))}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
