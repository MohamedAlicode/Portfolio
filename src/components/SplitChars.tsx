import { Fragment, useEffect, useRef, type CSSProperties } from 'react'

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
    document.fonts?.ready.then(() => {
      widths.clear()
      kern()
    })
  }, [plain])

  // Numéro de chaque lettre (--i), pour décaler leur entrée en CSS
  let n = 0

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
                  {text.split(/( +)/).map((word, wi) =>
                    /^ +$/.test(word) ? (
                      <Fragment key={wi}> </Fragment>
                    ) : (
                      <span key={wi} className={`inline-block whitespace-nowrap ${em ? emphasisClassName : ''}`}>
                        {Array.from(word).map((ch, ci) => (
                          <span key={ci} className="char-mask">
                            <span className="char" style={{ '--i': n++ } as CSSProperties}>
                              {ch}
                            </span>
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

// Mesure au canvas : aucune mise en page forcée, même avec beaucoup de lettres
let measurer: CanvasRenderingContext2D | null = null
const widths = new Map<string, number>()

function kernChars(root: HTMLElement) {
  const words = root.querySelectorAll<HTMLElement>('.whitespace-nowrap')
  if (!words.length) return
  measurer ??= document.createElement('canvas').getContext('2d')
  const ctx = measurer
  if (!ctx) return
  const fonts = new Map<HTMLElement, string>()
  words.forEach((word) => {
    // Une seule lecture de style par mot, aucune écriture entre deux lectures
    const cs = getComputedStyle(word)
    fonts.set(word, `${cs.fontStyle} ${cs.fontWeight} 100px ${cs.fontFamily}`)
  })
  const width = (font: string, t: string) => {
    const key = font + '|' + t
    let w = widths.get(key)
    if (w === undefined) {
      ctx.font = font
      w = ctx.measureText(t).width
      widths.set(key, w)
    }
    return w
  }
  words.forEach((word) => {
    const masks = Array.from(word.querySelectorAll<HTMLElement>('.char-mask'))
    const font = fonts.get(word)!
    for (let i = 0; i < masks.length - 1; i++) {
      const a = masks[i].textContent ?? ''
      const b = masks[i + 1].textContent ?? ''
      masks[i].style.marginRight = `${((width(font, a + b) - width(font, a) - width(font, b)) / 100).toFixed(4)}em`
    }
  })
}
