// Permet à un lien ailleurs dans la page (« Vu dans Maison Cadran »…)
// d'amener le carrousel des projets sur le bon projet.
type Listener = (slug: string) => void
const listeners = new Set<Listener>()

export function showProject(slug: string) {
  listeners.forEach((l) => l(slug))
}

export function onShowProject(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
