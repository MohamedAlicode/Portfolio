import { useRef, useState } from 'react'
import { contact, projectsUi, site } from '../data/content'
import { useLang } from '../lib/i18n'
import { ScrollTrigger, useGSAP } from '../lib/motion'
import { useSection } from '../hooks/useSection'
import { useReveal } from '../hooks/useReveal'
import { useMagnetic } from '../hooks/useMagnetic'
import { Blueprint } from './Blueprint'
import { SplitChars } from './SplitChars'

// Le dernier écran : l'e-mail en grand (copiable), le CV et les profils.
// La grille de plan du hero revient en écho.
export function Contact({ motion }: { motion: boolean }) {
  const { t, lang } = useLang()
  const root = useRef<HTMLElement>(null)
  const cvBtn = useRef<HTMLAnchorElement>(null)
  const [drawn, setDrawn] = useState(!motion)
  const [copied, setCopied] = useState(false)
  const timer = useRef(0)
  useMagnetic(cvBtn)
  useSection(root, 'base', { id: 'contact', num: 7 })
  useReveal(root, motion, [lang])

  useGSAP(
    () => {
      if (!motion) return
      ScrollTrigger.create({ trigger: root.current, start: 'top 70%', once: true, onEnter: () => setDrawn(true) })
    },
    { scope: root, dependencies: [motion] },
  )

  const copy = async () => {
    const ok = await copyText(site.email)
    if (!ok) return
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 2400)
  }

  return (
    <section id="contact" ref={root} aria-labelledby="contact-title" className="relative overflow-hidden pt-28 pb-24 lg:pt-40 lg:pb-32">
      <Blueprint start={drawn} />
      <div className="wrap relative">
        <p data-up className="label text-accent-ink">
          {t(contact.kicker)}
        </p>
        <h2
          id="contact-title"
          data-chars
          className="mt-6 font-display text-[clamp(60px,10.5vw,176px)] leading-[0.9] font-normal tracking-[-0.02em]"
        >
          <SplitChars lines={t(contact.title)} />
        </h2>

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-14">
          <p data-up className="max-w-[34ch] text-[clamp(17px,1.5vw,21px)] leading-[1.45] lg:col-span-4">
            {t(contact.text)}
          </p>

          <div className="min-w-0 lg:col-span-8">
            <p data-up className="label text-muted">
              {t(contact.emailLabel)}
            </p>
            <div data-up className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-4">
              <a
                href={`mailto:${site.email}`}
                data-cursor={t(contact.write)}
                className="mail-link font-display text-[clamp(32px,4.4vw,68px)] leading-[1.05] break-all"
              >
                {site.email}
              </a>
              <button type="button" onClick={copy} className="btn py-2.5 text-[14px]" aria-label={t(contact.copyLabel)}>
                <span aria-hidden="true">{copied ? t(contact.copied) : t(contact.copy)}</span>
              </button>
              <span aria-live="polite" className="sr-only">
                {copied ? t(contact.copiedLive) : ''}
              </span>
            </div>

            <div data-up className="mt-12 flex flex-wrap items-center gap-3">
              <a ref={cvBtn} href={site.cv} download className="btn btn-primary">
                {t(contact.cv)} <span className="arrow" aria-hidden="true">↓</span>
              </a>
              <a href={site.github} target="_blank" rel="noopener" className="btn">
                GitHub <span className="arrow" aria-hidden="true">↗</span>
                <span className="sr-only">({t(projectsUi.newTab)})</span>
              </a>
              <a href={site.linkedin} target="_blank" rel="noopener" className="btn">
                LinkedIn <span className="arrow" aria-hidden="true">↗</span>
                <span className="sr-only">({t(projectsUi.newTab)})</span>
              </a>
            </div>
            <p data-up className="mt-3 text-[13.5px] text-muted">
              {t(contact.cvMeta)}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// Presse-papiers, avec un repli pour les navigateurs ou cadres qui le bloquent
async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.cssText = 'position:fixed;opacity:0;pointer-events:none'
    document.body.appendChild(area)
    area.select()
    let ok = false
    try {
      ok = document.execCommand('copy')
    } catch {
      ok = false
    }
    area.remove()
    return ok
  }
}
