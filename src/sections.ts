import gsap from 'gsap'
import { Observer } from 'gsap/Observer'
import { SplitText } from 'gsap/SplitText'
import { anim, FLICKER, reducedMotion, tl } from './timeline'

gsap.registerPlugin(Observer, SplitText)

/** A → B: played forward. B → A: the same timeline reversed, so the way back mirrors the way in. */
export const sections = gsap.timeline({ paused: true })

const RGB_SPLIT = '-3px 0px 0px rgba(0, 229, 255, 0.85), 3px 0px 0px rgba(255, 40, 90, 0.85)'
const RGB_NONE = '0px 0px 0px rgba(0, 229, 255, 0), 0px 0px 0px rgba(255, 40, 90, 0)'
const B_ITEMS = '.date, .heading, .cursor, .description, .notify > *, .socials li'

let current: 0 | 1 = 0

/** Controlled scroll: one gesture = one full jump. Ignored mid-intro and mid-jump. */
export function go(target: 0 | 1) {
  if (target === current || tl.progress() < 1 || sections.isActive()) return
  current = target
  if (reducedMotion) sections.progress(target)
  else if (target) sections.play()
  else sections.reverse()
}

/** Builds the jump from the page's DOM and wires wheel / touch / keys. Returns a cleanup. */
export function setupSections(root: HTMLElement) {
  const q = gsap.utils.selector(root)
  const split = SplitText.create(q('.heading-text'), { type: 'words,chars' })
  gsap.set([...q(B_ITEMS), ...split.chars], { autoAlpha: 0 }) // hidden in A, so also unfocusable

  sections
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
    .to(q('.description, .notify > *, .socials li'), { autoAlpha: 1, duration: 0.25, ease: FLICKER, stagger: 0.04 }, 0.5)
    .set(q('.cursor'), { autoAlpha: 1 }, 0.75)
  sections.timeScale(1.8) // overall speed of the jump, both ways (the choreography above stays in proportion)

  const observer = Observer.create({
    type: 'wheel,touch',
    wheelSpeed: -1, // so a wheel-down and a finger swipe up both mean "next"
    tolerance: 10,
    preventDefault: true,
    onUp: () => go(1),
    onDown: () => go(0),
  })

  const onKey = (e: KeyboardEvent) => {
    const el = e.target as HTMLElement
    if (el.closest('input, textarea')) return
    if (e.key === ' ' && el.closest('button, a')) return // let Space press the focused control
    if (['ArrowDown', 'PageDown', 'End', ' '].includes(e.key)) go(1)
    else if (['ArrowUp', 'PageUp', 'Home'].includes(e.key)) go(0)
    else return
    e.preventDefault()
  }
  addEventListener('keydown', onKey)

  return () => {
    observer.kill()
    removeEventListener('keydown', onKey)
    sections.clear()
    split.revert()
  }
}
