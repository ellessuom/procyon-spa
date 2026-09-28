import gsap from 'gsap'

// Every animated value lives here. GSAP writes, the scene reads each frame.
export const anim = {
  camZ: 10,
  star: 0,
  streak: 0,
  aberration: 0,
  field: 0,
  dots: 0, // particle opacity
  gather: 0, // particles: scattered stars → mark
  solid: 0, // 3D mark opacity
  hot: 0, // mark glow as it fuses
  light: 0,
  lightX: -2.4, // spotlight sweep during the intro
  handoff: 0, // 0 = intro drives the light, 1 = the visitor does
  letters: Array.from({ length: 14 }, () => ({ p: 0 })), // PROCYON + STUDIOS
}

export const tl = gsap
  .timeline({ paused: true })
  // camera: one slow continuous push across the whole intro
  .to(anim, { camZ: 8, duration: 6.5, ease: 'power2.out' }, 0)
  // 1 · ignition: the star swells, overshoots, then settles as the flare shoots out
  .to(anim, { star: 1.6, duration: 0.6, ease: 'power4.in' }, 0.3)
  .to(anim, { aberration: 1, duration: 0.15, ease: 'power2.in' }, 0.75)
  .to(anim, { star: 1, duration: 1.2, ease: 'expo.out' }, 0.9)
  .to(anim, { streak: 1, duration: 1.2, ease: 'expo.out' }, 0.9)
  .to(anim, { aberration: 0, duration: 1, ease: 'expo.out' }, 0.9)
  .to(anim, { field: 1, duration: 1.6, ease: 'power2.out' }, 1)
  // 2 · the stars are drawn in and shape the mark; the star collapses into it
  .to(anim, { dots: 1, duration: 1, ease: 'power2.out' }, 1)
  .to(anim, { gather: 1, duration: 2.1, ease: 'none' }, 1.6)
  .to(anim, { star: 0, duration: 0.8, ease: 'power2.in' }, 3)
  .to(anim, { streak: 0, duration: 0.6, ease: 'power3.in' }, 3)
  // 3 · the mark fuses white-hot, turns solid and cools; a light sweeps across it
  .to(anim, { hot: 1, duration: 0.3, ease: 'power2.in' }, 3.3)
  .to(anim, { solid: 1, duration: 0.5, ease: 'power2.out' }, 3.4)
  .to(anim, { dots: 0, duration: 0.6, ease: 'power2.in' }, 3.5)
  .to(anim, { hot: 0, duration: 1.4, ease: 'power2.out' }, 3.6)
  .to(anim, { light: 1, duration: 0.6, ease: 'power2.out' }, 3.8)
  .to(anim, { lightX: 2.4, duration: 1.6, ease: 'power2.inOut' }, 3.8)
  // 4 · title card
  .to(anim.letters.slice(0, 7), { p: 1, duration: 1.1, ease: 'expo.out', stagger: 0.07 }, 4.2)
  .to(anim.letters.slice(7), { p: 1, duration: 1.1, ease: 'expo.out', stagger: 0.05 }, 4.65)
  // 5 · the light is handed to the visitor (Overlay.tsx adds the page text at 5.1)
  .to(anim, { handoff: 1, duration: 1.4, ease: 'power2.inOut' }, 5.4)

const params = new URLSearchParams(location.search)
// ?t=2.4 freezes the intro on that second (for screenshots)
const frozenAt = params.get('t')
// Dev ignores the OS setting so the intro can be worked on; ?reduced tests that path.
const reducedMotion =
  params.has('reduced') || (!import.meta.env.DEV && matchMedia('(prefers-reduced-motion: reduce)').matches)

export function startIntro() {
  if (frozenAt !== null) return tl.pause(Number(frozenAt))
  if (reducedMotion) return tl.progress(1)
  tl.play(0)
}
