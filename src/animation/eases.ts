import gsap from 'gsap'
import { RoughEase } from 'gsap/EasePack'

gsap.registerPlugin(RoughEase)

/** Jittery on/off flicker that settles on its end value (GSAP RoughEase). */
export const FLICKER = 'rough({ strength: 3, points: 14, template: none, taper: out, randomize: true, clamp: true })'
