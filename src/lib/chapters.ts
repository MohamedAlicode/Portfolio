import { useSyncExternalStore } from 'react'

// Zone de couleur et chapitre en cours, partagés entre les sections,
// l'indicateur de chapitre en bas à gauche et la barre de progression.
export type Zone = 'base' | 'paper' | 'deep'
export type Chapter = { id: string; num: number } | null

let chapter: Chapter = null
const listeners = new Set<() => void>()

export function setZone(zone: Zone) {
  const root = document.documentElement
  if (root.dataset.zone !== zone) root.dataset.zone = zone
}

export function setChapter(next: Chapter) {
  if (next?.id === chapter?.id) return
  chapter = next
  listeners.forEach((l) => l())
}

export function useChapter() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => chapter,
    () => null,
  )
}
