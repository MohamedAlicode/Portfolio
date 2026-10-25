import { Fragment, useEffect, useRef } from 'react'

type Props = {
  /** Lignes du texte ; un mot entre *astérisques* passe en italique bronze */
  lines: string[]
  className?: string
  emphasisClassName?: string
}

// Texte découpé en lettres (chacune dans un masque) pour les faire monter,
// comme le titre d'Altaïr. Les lecteurs d'écran lisent le texte entier.
export function SplitChars({ lines, className, emphasisClassName = 'italic text-accent-ink' }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const plain = lines.map((l) => l.replace(/\*/g, '')).join(' ')

  // Découper casse le crénage de la police : on le rétablit lettre par lettre
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const kern = () => kernChars(el)
    kern()
    document.fonts?.ready.then(kern)
  }, [plain])

  return (
    <span className={className}>
      <span className="sr-only">{plain}</span>
      <span aria-hidden="true" ref={ref}>
        {lines.map((line, li) => (
          <span key={li} className="split-line">
            {line.split(/(\*[^*]+\*)/).filter(Boolean).map((part, pi) => {
              const em = part.startsWith('*')
              const text = em ? part.slice(1, -1) : part
              return (
                <Fragment key={pi}>
                  {text.split(/(\s+)/).map((word, wi) =>
                    /^\s+$/.test(word) ? (
                      <Fragment key={wi}> </Fragment>
                    ) : (
                      <span key={wi} className={`inline-block whitespace-nowrap ${em ? emphasisClassName : ''}`}>
                        {Array.from(word).map((ch, ci) => (
                          <span key={ci} className="char-mask">
                            <span className="char">{ch}</span>
                          </span>
                        ))}
                      </span>
                    ),
                  )}
                </Fragment>
              )
            })}
          </span>
        ))}
      </span>
    </span>
  )
}

function kernChars(root: HTMLElement) {
  const words = root.querySelectorAll<HTMLElement>('.whitespace-nowrap')
  if (!words.length) return
  const probe = document.createElement('span')
  document.body.appendChild(probe)
  words.forEach((word) => {
    const masks = Array.from(word.querySelectorAll<HTMLElement>('.char-mask'))
    if (masks.length < 2) return
    const cs = getComputedStyle(word)
    probe.style.cssText = `position:absolute;visibility:hidden;white-space:pre;letter-spacing:0;font:${cs.fontStyle} ${cs.fontWeight} 100px ${cs.fontFamily}`
    const width = (t: string) => {
      probe.textContent = t
      return probe.getBoundingClientRect().width
    }
    for (let i = 0; i < masks.length - 1; i++) {
      const a = masks[i].textContent ?? ''
      const b = masks[i + 1].textContent ?? ''
      masks[i].style.marginRight = `${((width(a + b) - width(a) - width(b)) / 100).toFixed(4)}em`
    }
  })
  probe.remove()
}
