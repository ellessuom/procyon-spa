/** Each letter drops out (and back in) at its own point as anim.word falls, so the order looks random. */
export const randomWordThresholds = (count: number) => Array.from({ length: count }, () => 0.08 + Math.random() * 0.8)

/**
 * One letter's look for this frame.
 * Glitch in: p steps 0 → ⅓ → ⅔ → 1 — a bright jittered frame, a dim one, then settled.
 * On the way to B they glitch out the same way (one bright jittered frame, then gone).
 */
export function letterState(index: number, p: number, word: number, threshold: number) {
  const gone = word <= threshold
  const leaving = !gone && word < threshold + 0.1
  const settling = (p > 0 && p < 1) || leaving
  const side = index % 2 ? 1 : -1
  return {
    visible: p > 0 && !gone,
    x: leaving ? side * 8 : settling ? side * (1 - p) * 14 : 0,
    opacity: settling && !leaving && p > 0.5 ? 0.45 : 1,
    emissive: settling ? 2.5 : 0,
  }
}
