import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { FLICKER } from './eases'
import { anim } from './state'

gsap.registerPlugin(SplitText)

/** A → B: played forward. B → A: the same timeline reversed, so the way back mirrors the way in. */
export const sectionsTimeline = gsap.timeline({ paused: true })

const RGB_SPLIT = '-3px 0px 0px rgba(0, 229, 255, 0.85), 3px 0px 0px rgba(255, 40, 90, 0.85)'
const RGB_NONE = '0px 0px 0px rgba(0, 229, 255, 0), 0px 0px 0px rgba(255, 40, 90, 0)'
const B_ITEMS = '.date, .heading, .cursor, .description, .notify > *, .socials li'

/** Builds the jump from the page's DOM, with section B starting hidden. Returns a cleanup. */
export function buildSectionsTimeline(root: HTMLElement) {
  const q = gsap.utils.selector(root)
  const split = SplitText.create(q('.heading-text'), { type: 'words,chars' })
  gsap.set([...q(B_ITEMS), ...split.chars], { autoAlpha: 0 }) // hidden in A, so also unfocusable

  sectionsTimeline
    // the logo glitch-jumps to top-centre: six stepped frames under full-canvas tearing
    .set(anim, { glitchFx: 1 }, 0.001)
    .to(anim, { aberration: 0.8, duration: 0.06, ease: 'none' }, 0)
    .to(q('.cue'), { autoAlpha: 0, duration: 0.2, ease: FLICKER }, 0)
    .to(anim, { word: 0, duration: 0.2, ease: 'none' }, 0) // PROCYON STUDIOS drops out; only the skull goes to B
    .to(anim, { section: 1, duration: 0.36, ease: 'steps(6)' }, 0)
    .set(anim, { glitchFx: 0 }, 0.36)
    .to(anim, { aberration: 0, duration: 0.3, ease: FLICKER }, 0.36)
    // section B hacks in
    .to(q('.date'), { autoAlpha: 1, duration: 0.25, ease: FLICKER }, 0.3)
    .set(q('.heading'), { autoAlpha: 1 }, 0.32)
    .to(split.chars, { autoAlpha: 1, duration: 0.01, stagger: { each: 0.015, from: 'random' } }, 0.34)
    .fromTo(q('.heading'), { textShadow: RGB_SPLIT }, { textShadow: RGB_NONE, duration: 0.5, ease: FLICKER }, 0.34)
    .to(
      q('.description, .notify > *, .socials li'),
      { autoAlpha: 1, duration: 0.25, ease: FLICKER, stagger: 0.04 },
      0.5,
    )
    .set(q('.cursor'), { autoAlpha: 1 }, 0.75)
  sectionsTimeline.timeScale(1.8) // overall speed of the jump, both ways (the choreography above stays in proportion)

  return () => {
    sectionsTimeline.clear()
    split.revert()
  }
}
