import * as THREE from 'three'
import { VIEW_H } from '../constants'

// The ring is built at unit size (outer line r = 1); layout.ts scales it to the view.
export const R_IN = 0.832 // inner border line
export const R_MID = (R_IN + 1) / 2 // the glyphs sit halfway between the lines
export const LINE = 0.0035 // border line width
export const GLYPH = 0.112 // one 24-unit rune cell
export const GLYPH_STROKE = 1.1 // in rune-grid units

export const TOP = VIEW_H / 2 // the centre sits on the top edge of the view, so only the lower half shows
export const Z = -0.1 // just behind the logo
export const MARGIN = 0.2 // world units between the inner line and what the ring encloses

export const IVORY = new THREE.Color('#efe6cf') // the logo's ivory
export const OPACITY = 0.015 // background, not foreground
export const FLARE = 16 // colour boost at anim.hot = 1: the cut's flash blooms the ring too
export const SPIN = (Math.PI * 2) / 240 // rad/s: one turn every 4 minutes
