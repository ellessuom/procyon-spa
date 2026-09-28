import type { Section } from './goToSection'

const NEXT_KEYS = ['ArrowDown', 'PageDown', 'End', ' ']
const PREV_KEYS = ['ArrowUp', 'PageUp', 'Home']

/** The section a key press asks for, or null when the key should keep its default behaviour. */
export function sectionForKey(e: KeyboardEvent): Section | null {
  const el = e.target as HTMLElement
  if (el.closest('input, textarea')) return null
  if (e.key === ' ' && el.closest('button, a')) return null // let Space press the focused control
  if (NEXT_KEYS.includes(e.key)) return 1
  if (PREV_KEYS.includes(e.key)) return 0
  return null
}
