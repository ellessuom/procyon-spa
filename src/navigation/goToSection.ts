import { introTimeline } from '../animation/introTimeline'
import { sectionsTimeline } from '../animation/sectionsTimeline'

/** 0 = A (logo centred), 1 = B (stay tuned). */
export type Section = 0 | 1

let current: Section = 0

/** Controlled scroll: one gesture = one full jump. Ignored mid-intro and mid-jump. */
export function goToSection(target: Section) {
  if (target === current || introTimeline.progress() < 1 || sectionsTimeline.isActive()) return
  current = target
  if (target) sectionsTimeline.play()
  else sectionsTimeline.reverse()
}
