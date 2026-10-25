import { useEffect, useRef } from 'react'
import { gsap, reducedMotion } from '../lib/motion'

// Fond du hero : une grille de plan technique, tracée trait par trait à
// l'arrivée, avec quelques repères bronze. Redessinée seulement au
// redimensionnement, au changement de thème et pendant le tracé.
export function Blueprint({ start }: { start: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const progress = useRef({ value: reducedMotion() ? 1 : 0 })

  useEffect(() => {
    const cvs = canvas.current
    if (!cvs) return
    const ctx = cvs.getContext('2d')
    if (!ctx) return

    // Couleurs lues une fois, puis seulement quand le thème ou la zone change :
    // relire le style à chaque image forcerait un recalcul de toute la page
    let line = '#22405c'
    let accent = '#b08d57'
    const readColors = () => {
      const cs = getComputedStyle(document.documentElement)
      line = cs.getPropertyValue('--line').trim() || line
      accent = cs.getPropertyValue('--accent').trim() || accent
    }
    readColors()
    // Taille mémorisée par le ResizeObserver : rien à mesurer pendant le tracé
    let w = cvs.clientWidth
    let h = cvs.clientHeight

    const draw = () => {
      const r = Math.min(window.devicePixelRatio || 1, 1.5)
      if (!w || !h) return
      if (cvs.width !== Math.round(w * r) || cvs.height !== Math.round(h * r)) {
        cvs.width = Math.round(w * r)
        cvs.height = Math.round(h * r)
      }
      ctx.setTransform(r, 0, 0, r, 0, 0)
      ctx.clearRect(0, 0, w, h)
      const p = progress.current.value
      const cell = w < 700 ? 28 : 36
      const major = 4
      const ox = Math.round((w % (cell * major)) / 2)
      const oy = Math.round((h % (cell * major)) / 2)

      ctx.strokeStyle = line
      // Deux familles de traits (fins et appuyés), chacune tracée en un seul chemin
      for (const majorPass of [false, true]) {
        ctx.globalAlpha = majorPass ? 0.9 : 0.38
        ctx.lineWidth = majorPass ? 1 : 0.6
        ctx.beginPath()
        // Lignes verticales : tracées de haut en bas, en décalé de gauche à droite
        let i = 0
        for (let x = ox; x <= w; x += cell, i++) {
          if ((i % major === 0) !== majorPass) continue
          const k = gsap.utils.clamp(0, 1, p * 1.6 - (x / w) * 0.6)
          if (k <= 0) continue
          ctx.moveTo(x + 0.5, 0)
          ctx.lineTo(x + 0.5, h * easeOut(k))
        }
        // Lignes horizontales : de gauche à droite, en décalé de haut en bas
        i = 0
        for (let y = oy; y <= h; y += cell, i++) {
          if ((i % major === 0) !== majorPass) continue
          const k = gsap.utils.clamp(0, 1, p * 1.6 - (y / h) * 0.6)
          if (k <= 0) continue
          ctx.moveTo(0, y + 0.5)
          ctx.lineTo(w * easeOut(k), y + 0.5)
        }
        ctx.stroke()
      }
      // Repères bronze sur quelques intersections majeures
      ctx.globalAlpha = gsap.utils.clamp(0, 1, (p - 0.55) / 0.45)
      ctx.strokeStyle = accent
      ctx.lineWidth = 1
      ctx.beginPath()
      const step = cell * major
      let n = 0
      for (let x = ox + step; x < w; x += step) {
        for (let y = oy + step; y < h; y += step) {
          n++
          if ((n * 7) % 5 !== 1) continue
          ctx.moveTo(x - 6, y + 0.5)
          ctx.lineTo(x + 7, y + 0.5)
          ctx.moveTo(x + 0.5, y - 6)
          ctx.lineTo(x + 0.5, y + 7)
        }
      }
      ctx.stroke()
      ctx.globalAlpha = 1
    }

    draw()
    const ro = new ResizeObserver(([entry]) => {
      w = entry.contentRect.width
      h = entry.contentRect.height
      draw()
    })
    ro.observe(cvs)
    // Les couleurs passent d'un thème ou d'une zone à l'autre en 0,9 s : on redessine à la fin
    let late = 0
    const mo = new MutationObserver(() => {
      clearTimeout(late)
      late = window.setTimeout(() => {
        readColors()
        draw()
      }, 950)
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-scheme', 'data-zone'] })
    const onDraw = () => draw()
    cvs.addEventListener('redraw', onDraw)
    return () => {
      ro.disconnect()
      mo.disconnect()
      clearTimeout(late)
      cvs.removeEventListener('redraw', onDraw)
    }
  }, [])

  useEffect(() => {
    if (!start || progress.current.value >= 1) return
    const cvs = canvas.current
    const tween = gsap.to(progress.current, {
      value: 1,
      duration: 2.2,
      ease: 'power2.inOut',
      onUpdate: () => cvs?.dispatchEvent(new Event('redraw')),
    })
    return () => {
      tween.kill()
    }
  }, [start])

  return (
    <canvas
      ref={canvas}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      style={{
        maskImage: 'radial-gradient(120% 90% at 78% 30%, #000 25%, transparent 78%)',
        WebkitMaskImage: 'radial-gradient(120% 90% at 78% 30%, #000 25%, transparent 78%)',
      }}
    />
  )
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
