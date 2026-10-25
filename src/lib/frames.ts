// Séquences d'images rejouées au scroll (même principe que le film d'Altaïr).
// Les images restent compressées en mémoire ; seules celles autour de la
// position courante sont décodées (fenêtre glissante), hors du fil principal.

export type Sequence = {
  slug: string
  count: number
  blobs: (Blob | null)[]
  bitmaps: Map<number, ImageBitmap | HTMLImageElement>
  pending: Set<number>
  started: boolean
  listeners: Set<(index: number) => void>
}

const sequences = new Map<string, Sequence>()
const WINDOW = 14

export function frameUrl(slug: string, index: number) {
  return `${import.meta.env.BASE_URL}frames/${slug}/${String(index + 1).padStart(3, '0')}.webp`
}

export function getSequence(slug: string, count: number): Sequence {
  let seq = sequences.get(slug)
  if (!seq) {
    seq = {
      slug,
      count,
      blobs: new Array(count).fill(null),
      bitmaps: new Map(),
      pending: new Set(),
      started: false,
      listeners: new Set(),
    }
    sequences.set(slug, seq)
  }
  return seq
}

async function fetchFrame(seq: Sequence, i: number) {
  if (seq.blobs[i]) return
  try {
    const res = await fetch(frameUrl(seq.slug, i))
    if (res.ok) seq.blobs[i] = await res.blob()
  } catch {
    // image manquante : on garde la plus proche
  }
}

// Télécharge les `first` premières images, ou toutes, dans l'ordre, 6 à la fois
export async function preload(seq: Sequence, first = seq.count, onProgress?: (done: number) => void) {
  let next = 0
  let done = 0
  const total = Math.min(first, seq.count)
  const worker = async () => {
    while (next < total) {
      const i = next++
      await fetchFrame(seq, i)
      done++
      onProgress?.(done)
      if (seq.bitmaps.size === 0 || Math.abs(i) < WINDOW) decode(seq, i)
    }
  }
  await Promise.all(Array.from({ length: 6 }, worker))
}

export function startLoading(seq: Sequence) {
  if (seq.started) return
  seq.started = true
  void preload(seq)
}

function decode(seq: Sequence, i: number) {
  const blob = seq.blobs[i]
  if (!blob || seq.bitmaps.has(i) || seq.pending.has(i)) return
  seq.pending.add(i)
  const done = (img: ImageBitmap | HTMLImageElement) => {
    seq.pending.delete(i)
    seq.bitmaps.set(i, img)
    seq.listeners.forEach((l) => l(i))
  }
  if ('createImageBitmap' in window) {
    createImageBitmap(blob)
      .then(done)
      .catch(() => seq.pending.delete(i))
  } else {
    const img = new Image()
    img.onload = () => done(img)
    img.onerror = () => seq.pending.delete(i)
    img.src = URL.createObjectURL(blob)
  }
}

// Garde décodées les images autour de `center`, libère les autres
export function focus(seq: Sequence, center: number) {
  for (let d = 0; d <= WINDOW; d++) {
    if (center + d < seq.count) decode(seq, center + d)
    if (d && center - d >= 0) decode(seq, center - d)
  }
  for (const [i, bmp] of seq.bitmaps) {
    if (Math.abs(i - center) > WINDOW + 6) {
      if ('close' in bmp) bmp.close()
      seq.bitmaps.delete(i)
    }
  }
}

// L'image demandée si elle est prête, sinon la plus proche déjà décodée
export function nearest(seq: Sequence, i: number) {
  if (seq.bitmaps.has(i)) return seq.bitmaps.get(i)!
  for (let d = 1; d < seq.count; d++) {
    const a = seq.bitmaps.get(i - d)
    if (a) return a
    const b = seq.bitmaps.get(i + d)
    if (b) return b
  }
  return null
}
