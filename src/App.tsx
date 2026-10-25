import { useEffect, useState } from 'react'
import { seo, ui } from './data/content'
import { useLang } from './lib/i18n'
import { reducedMotion, ScrollTrigger } from './lib/motion'
import { lockScroll, scrollToHash, startSmoothScroll } from './lib/scroll'
import { Intro } from './components/Intro'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { ChapterIndicator } from './components/ChapterIndicator'
import { Projects } from './components/Projects'
import { Skills } from './components/Skills'
import { Path } from './components/Path'
import { About } from './components/About'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { Cursor } from './components/Cursor'

export default function App() {
  const { t, lang } = useLang()
  // Animations complètes, sauf si le système demande moins d'animations
  const [motion] = useState(() => !reducedMotion())
  const [introDone, setIntroDone] = useState(() => !motion)

  useEffect(() => startSmoothScroll(), [])
  useEffect(() => {
    document.title = t(seo.title)
    document.querySelector('meta[name="description"]')?.setAttribute('content', t(seo.description))
  }, [t, lang])
  useEffect(() => {
    document.documentElement.toggleAttribute('data-motion', motion)
  }, [motion])
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  }, [])
  useEffect(() => {
    lockScroll(!introDone)
  }, [introDone])
  // Une seule mise à jour des positions quand tout est en place : polices
  // chargées (l'intro les attend), crénage et textes posés
  useEffect(() => {
    if (!introDone) return
    let alive = true
    document.fonts.ready.then(() => alive && ScrollTrigger.refresh())
    return () => {
      alive = false
    }
  }, [introDone])
  // Quand la hauteur de la page change (polices chargées, changement de
  // langue…), on recalcule les positions des animations au scroll
  useEffect(() => {
    let last = document.body.scrollHeight
    let timer = 0
    const ro = new ResizeObserver(() => {
      const h = document.body.scrollHeight
      if (h === last) return
      last = h
      clearTimeout(timer)
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 200)
    })
    ro.observe(document.body)
    return () => {
      ro.disconnect()
      clearTimeout(timer)
    }
  }, [])

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
        <Skills motion={motion} />
        <Path motion={motion} />
        <About motion={motion} />
        <Contact motion={motion} />
      </main>
      <Footer motion={motion} />
      <ChapterIndicator />
      <Cursor />
    </>
  )
}
