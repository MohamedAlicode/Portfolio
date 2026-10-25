import { useEffect, useState } from 'react'
import { ui } from './data/content'
import { useLang } from './lib/i18n'
import { reducedMotion } from './lib/motion'
import { lockScroll, scrollToHash, startSmoothScroll } from './lib/scroll'
import { Intro } from './components/Intro'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { ChapterIndicator } from './components/ChapterIndicator'
import { Projects } from './components/Projects'
import { Cursor } from './components/Cursor'

export default function App() {
  const { t } = useLang()
  // Animations complètes, sauf si le système demande moins d'animations
  const [motion] = useState(() => !reducedMotion())
  const [introDone, setIntroDone] = useState(() => !motion)

  useEffect(() => startSmoothScroll(), [])
  useEffect(() => {
    document.documentElement.toggleAttribute('data-motion', motion)
  }, [motion])
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  }, [])
  useEffect(() => {
    lockScroll(!introDone)
  }, [introDone])

  return (
    <>
      <a
        href="#contenu"
        onClick={(e) => {
          e.preventDefault()
          scrollToHash('#contenu')
        }}
        className="label fixed top-3 left-3 z-[70] -translate-y-24 rounded bg-accent px-4 py-3 text-on-accent transition-transform focus:translate-y-0"
      >
        {t(ui.skip)}
      </a>
      {!introDone && <Intro onDone={() => setIntroDone(true)} />}
      <Header ready={introDone} />
      <main id="contenu">
        <Hero ready={introDone} motion={motion} />
        <Projects motion={motion} />
      </main>
      <ChapterIndicator />
      <Cursor />
    </>
  )
}
