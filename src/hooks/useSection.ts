import type { RefObject } from 'react'
import { ScrollTrigger, useGSAP } from '../lib/motion'
import { setChapter, setZone, type Chapter, type Zone } from '../lib/chapters'

// Quand le milieu de l'écran entre dans la section : on passe à sa zone
// de couleur et à son chapitre (affiché en bas à gauche).
export function useSection(ref: RefObject<HTMLElement | null>, zone: Zone, chapter: Chapter) {
  useGSAP(
    () => {
      if (!ref.current) return
      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: (self) => {
          if (!self.isActive) return
          setZone(zone)
          setChapter(chapter)
        },
      })
    },
    { scope: ref, dependencies: [zone, chapter?.id] },
  )
}
