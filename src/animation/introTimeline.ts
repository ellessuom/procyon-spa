import gsap from 'gsap'
import { FLICKER } from './eases'
import { startSigilIdle } from './sigilIdle'
import { anim } from './state'

// ?t=0.8 freezes the intro on that second (for screenshots)
const frozenAt = new URLSearchParams(location.search).get('t')

export const introTimeline = gsap.timeline({ paused: true })

// short glitch spike on the shape
const pulse = (at: number, amount: number, len = 0.1) =>
  introTimeline
    .set(anim, { glitch: amount }, at)
    .to(anim, { glitch: 0.12, duration: len, ease: 'power2.out' }, at + 0.02)

// 1 · a circle hacks its way in
introTimeline.to(anim, { vis: 1, duration: 0.25, ease: FLICKER }, 0.15)
pulse(0.15, 1, 0.2)

// 2 · it spins, wobbles and morphs into the skull, filling in as it lands
introTimeline
  .to(anim, { spin: 0, duration: 0.8, ease: 'expo.out' }, 0.3)
  .to(anim, { distort: 0, duration: 0.7, ease: 'power2.in' }, 0.35)
  .to(anim, { morph: 1, duration: 0.7, ease: 'power3.inOut' }, 0.35)
  .to(anim, { fill: 1, duration: 0.35, ease: 'power2.in' }, 0.75)
pulse(0.55, 0.8)
pulse(0.8, 0.6)

// 3 · hack burst, then a hard cut to the solid 3D mark
introTimeline
  .set(anim, { glitch: 1 }, 1.0)
  .to(anim, { aberration: 1, duration: 0.08, ease: 'power2.in' }, 1.0)
  .set(anim, { vis: 0, glitch: 0, solid: 1, hot: 1 }, 1.12)
  .to(anim, { aberration: 0.3, duration: 0.08, ease: 'power2.out' }, 1.12)
  .to(anim, { hot: 0, duration: 0.6, ease: 'power2.out' }, 1.12)

// 4 · the wordmark glitches in letter by letter under a second RGB flare
introTimeline
  .to(anim.letters, { p: 1, duration: 0.14, ease: 'steps(3)', stagger: 0.035 }, 1.2)
  .to(anim, { aberration: 0.7, duration: 0.05, ease: 'none' }, 1.2)
  .to(anim, { aberration: 0, duration: 0.45, ease: FLICKER }, 1.25)

// 4b · the sigil ring behind it lights up on the cut (anim.hot flares it), then its glyphs glitch in at random
introTimeline
  .to(anim, { sigil: 1, duration: 0.35, ease: FLICKER }, 1.12)
  .to(anim.glyphs, { p: 1, duration: 0.25, ease: FLICKER, stagger: { each: 0.015, from: 'random' } }, 1.25)
  .call(startSigilIdle)

/** 5 · the corners and the scroll cue flicker in right after the wordmark. Returns a cleanup. */
export function addOverlayIntro(root: HTMLElement) {
  const q = gsap.utils.selector(root)
  const overlay = gsap
    .timeline()
    .from(q('.corner'), { autoAlpha: 0, duration: 0.4, ease: FLICKER }, 0)
    .from(q('.cue'), { autoAlpha: 0, duration: 0.4, ease: FLICKER }, 0.25)
  introTimeline.add(overlay, 1.45)
  return () => void introTimeline.remove(overlay)
}

export function startIntro() {
  if (frozenAt !== null) introTimeline.pause(Number(frozenAt))
  else introTimeline.play(0)
}
