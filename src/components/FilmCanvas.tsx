import { useEffect, useRef } from 'react'
import { gsap } from '../lib/motion'
import { focus, getSequence, nearest, startLoading } from '../lib/frames'
import type { Project } from '../data/projects'

type Props = {
  project: Project
  /** Progression du film entre 0 et 1, écrite par le ScrollTrigger du chapitre */
  progress: { current: number }
  /** Appelé quand l'image affichée change (pour allumer les « temps ») */
  onFrame?: (index: number) => void
  label: string
}

// La démo du projet, rejouée image par image au rythme du scroll.
// L'image affichée rattrape la position du scroll en douceur et ne saute
// jamais : si l'image visée n'est pas encore décodée, on garde la plus proche.
export function FilmCanvas({ project, progress, onFrame, label }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const onFrameRef = useRef(onFrame)
  onFrameRef.current = onFrame

  useEffect(() => {
    const cvs = canvas.current
    const ctx = cvs?.getContext('2d')
    if (!cvs || !ctx) return
    const seq = getSequence(project.slug, project.frames)
    let visible = false
    let shown = progress.current * (project.frames - 1)
    let drawnIndex = -1
    let drawnImage: CanvasImageSource | null = null
    let dirty = true

    const size = () => {
      const r = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.round(cvs.clientWidth * r)
      const h = Math.round(cvs.clientHeight * r)
      if (w && h && (cvs.width !== w || cvs.height !== h)) {
        cvs.width = w
        cvs.height = h
        dirty = true
      }
    }

    const listener = () => {
      dirty = true
    }
    seq.listeners.add(listener)

    const tick = () => {
      if (!visible) return
      const target = progress.current * (project.frames - 1)
      shown += (target - shown) * 0.22
      if (Math.abs(target - shown) < 0.01) shown = target
      const index = Math.round(shown)
      focus(seq, index)
      const img = nearest(seq, index)
      if (img && (dirty || index !== drawnIndex || img !== drawnImage)) {
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, cvs.width, cvs.height)
        drawnImage = img
        dirty = false
      }
      if (index !== drawnIndex) {
        drawnIndex = index
        onFrameRef.current?.(index)
      }
    }

    // On ne charge et ne dessine que si le film est proche de l'écran
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) startLoading(seq)
      },
      { rootMargin: '150% 0px' },
    )
    const ioVisible = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) dirty = true
    })
    io.observe(cvs)
    ioVisible.observe(cvs)
    const ro = new ResizeObserver(size)
    ro.observe(cvs)
    size()
    gsap.ticker.add(tick)

    return () => {
      gsap.ticker.remove(tick)
      io.disconnect()
      ioVisible.disconnect()
      ro.disconnect()
      seq.listeners.delete(listener)
    }
  }, [project, progress])

  return (
    <canvas
      ref={canvas}
      role="img"
      aria-label={label}
      className="block h-full w-full bg-surface"
      style={{ aspectRatio: String(project.ratio) }}
    />
  )
}
