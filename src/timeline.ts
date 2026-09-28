import gsap from 'gsap'
import { RoughEase } from 'gsap/EasePack'

gsap.registerPlugin(RoughEase)

/** Jittery on/off flicker that settles on its end value (GSAP RoughEase). */
export const FLICKER = 'rough({ strength: 3, points: 14, template: none, taper: out, randomize: true, clamp: true })'

// Every animated value lives here. GSAP writes, the scene reads each frame.
export const anim = {
  vis: 0, // glitch shape visibility
  morph: 0, // 0 = circle, 1 = skull
  spin: Math.PI * 2.5, // radians left to spin (1.25 turns → 0)
  distort: 1, // noise wobble on the circle
  fill: 0, // 0 = ring outline, 1 = filled
  glitch: 0, // slice jitter + RGB split on the shape
  solid: 0, // 3D mark
  hot: 0, // warm glow on the 3D mark right after the cut
  aberration: 0, // extra full-screen RGB split on top of the permanent thin one
  letters: Array.from({ length: 14 }, () => ({ p: 0 })), // PROCYON + STUDIOS
  section: 0, // 0 = A (logo centred), 1 = B (skull only, small, top-centre)
  word: 1, // wordmark shown; drops to 0 (letters glitch out) on the way to B
  glitchFx: 0, // 1 = full-canvas glitch tearing (during the A ↔ B jump)
}

/** Where the logo sits in section B, in world units — measured from the DOM (#logo-slot) by Overlay.tsx. */
export const pose = { y: 1.5, scale: 0.5 }

export const tl = gsap.timeline({ paused: true })

// short glitch spike on the shape
const pulse = (at: number, amount: number, len = 0.1) =>
  tl.set(anim, { glitch: amount }, at).to(anim, { glitch: 0.12, duration: len, ease: 'power2.out' }, at + 0.02)

// 1 · a circle hacks its way in
tl.to(anim, { vis: 1, duration: 0.25, ease: FLICKER }, 0.15)
pulse(0.15, 1, 0.2)

// 2 · it spins, wobbles and morphs into the skull, filling in as it lands
tl.to(anim, { spin: 0, duration: 0.8, ease: 'expo.out' }, 0.3)
  .to(anim, { distort: 0, duration: 0.7, ease: 'power2.in' }, 0.35)
  .to(anim, { morph: 1, duration: 0.7, ease: 'power3.inOut' }, 0.35)
  .to(anim, { fill: 1, duration: 0.35, ease: 'power2.in' }, 0.75)
pulse(0.55, 0.8)
pulse(0.8, 0.6)

// 3 · hack burst, then a hard cut to the solid 3D mark
tl.set(anim, { glitch: 1 }, 1.0)
  .to(anim, { aberration: 1, duration: 0.08, ease: 'power2.in' }, 1.0)
  .set(anim, { vis: 0, glitch: 0, solid: 1, hot: 1 }, 1.12)
  .to(anim, { aberration: 0.3, duration: 0.08, ease: 'power2.out' }, 1.12)
  .to(anim, { hot: 0, duration: 0.6, ease: 'power2.out' }, 1.12)

// 4 · the wordmark glitches in letter by letter under a second RGB flare
  .to(anim.letters, { p: 1, duration: 0.14, ease: 'steps(3)', stagger: 0.035 }, 1.2)
  .to(anim, { aberration: 0.7, duration: 0.05, ease: 'none' }, 1.2)
  .to(anim, { aberration: 0, duration: 0.45, ease: FLICKER }, 1.25)
// (Overlay.tsx flickers the corners and the SCROLL cue in at 1.45)

const params = new URLSearchParams(location.search)
// ?t=0.8 freezes the intro on that second (for screenshots)
const frozenAt = params.get('t')
// Dev ignores the OS setting so the intro can be worked on; ?reduced tests that path.
export const reducedMotion =
  params.has('reduced') || (!import.meta.env.DEV && matchMedia('(prefers-reduced-motion: reduce)').matches)

export function startIntro() {
  if (frozenAt !== null) return tl.pause(Number(frozenAt))
  if (reducedMotion) return tl.progress(1)
  tl.play(0)
}
