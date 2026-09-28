import { useLayoutEffect, useRef } from 'react'
import { addOverlayIntro } from '../../animation/introTimeline'
import { buildSectionsTimeline } from '../../animation/sectionsTimeline'

/** Wires the overlay's DOM into the intro and the A ↔ B timelines. Returns the ref for the overlay root. */
export function useOverlayAnimations() {
  const root = useRef<HTMLElement>(null!)

  useLayoutEffect(() => {
    const removeIntro = addOverlayIntro(root.current)
    const clearSections = buildSectionsTimeline(root.current)
    return () => {
      removeIntro()
      clearSections()
    }
  }, [])

  return root
}
