import { H, LIFT, LOCKUP_W, S } from '../logo/constants'
import { MARGIN, R_IN, TOP } from './constants'

/**
 * Scale for the unit ring (centred on TOP) whose inner line clears the section-A lockup's bottom corners, plus MARGIN,
 * so it never crosses the wordmark. The ring keeps this size in section B too.
 */
export const ringScale = (fit: number) =>
  (Math.hypot((LOCKUP_W / 2) * fit, TOP - (LIFT - (H / 2) * S * fit)) + MARGIN) / R_IN
