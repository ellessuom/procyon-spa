import { useEffect } from 'react'
import gsap from 'gsap'
import { Observer } from 'gsap/Observer'
import { goToSection } from './goToSection'
import { sectionForKey } from './sectionForKey'

gsap.registerPlugin(Observer)

/** Wheel, touch and keyboard input → A ↔ B jumps (there is no native scroll). */
export function useSectionNavigation() {
  useEffect(() => {
    const observer = Observer.create({
      type: 'wheel,touch',
      wheelSpeed: -1, // so a wheel-down and a finger swipe up both mean "next"
      tolerance: 10,
      preventDefault: true,
      onUp: () => goToSection(1),
      onDown: () => goToSection(0),
    })

    const onKey = (e: KeyboardEvent) => {
      const target = sectionForKey(e)
      if (target === null) return
      e.preventDefault()
      goToSection(target)
    }
    addEventListener('keydown', onKey)

    return () => {
      observer.kill()
      removeEventListener('keydown', onKey)
    }
  }, [])
}
