import { useLayoutEffect, useRef } from 'react'
import { pose } from '../../animation/state'
import { VIEW_H } from '../../scene/constants'
import { MARK } from '../../scene/logo/constants'

/** Section B's logo position comes from the DOM: the skull alone is centred in the returned element. */
export function useLogoSlot() {
  const slot = useRef<HTMLDivElement>(null!)

  useLayoutEffect(() => {
    // px → world units (camera z = 8)
    const measure = () => {
      const r = slot.current.getBoundingClientRect()
      const k = VIEW_H / innerHeight
      pose.scale = Math.min((r.height * k) / MARK.h, (r.width * k) / MARK.w)
      pose.y = (innerHeight / 2 - (r.top + r.height / 2)) * k - MARK.cy * pose.scale
    }
    measure()
    addEventListener('resize', measure)
    document.fonts.ready.then(measure)
    return () => removeEventListener('resize', measure)
  }, [])

  return slot
}
