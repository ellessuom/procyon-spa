import { VIEW_H } from '../constants'

// Both SVGs share logo.svg's coordinate space (330 × 488, y down). S maps it to world units.
export const W = 330
export const H = 488
export const S = 2.9 / H
export const LOCKUP_W = W * S
export const LIFT = 0.3 // section A: the lockup sits a touch above centre
export const MARK_DEPTH = 16
export const WORD_DEPTH = 10

/** The skull alone (mark viewBox 205 × 294), world units at scale 1, and its centre's offset from the group origin. */
export const MARK = { w: 205 * S, h: 294 * S, cy: (H / 2 - 146) * S }

/** Section A: the lockup's scale, shrunk to fit narrow (portrait) screens. */
export const lockupFit = (aspect: number) => Math.min(1, (VIEW_H * aspect * 0.82) / LOCKUP_W)
