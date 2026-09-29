import gsap from 'gsap'
import { FLICKER } from './eases'
import { anim } from './state'

/** Once the intro is done, a random sigil glyph stutters every 6–10 s, so the ring never looks frozen. */
export function startSigilIdle() {
  gsap.delayedCall(gsap.utils.random(6, 10), () => {
    gsap.fromTo(gsap.utils.random(anim.glyphs), { p: 0 }, { p: 1, duration: 0.4, ease: FLICKER })
    startSigilIdle()
  })
}
