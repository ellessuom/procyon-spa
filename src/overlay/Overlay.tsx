import { useSectionNavigation } from '../navigation/useSectionNavigation'
import Corners from './Corners'
import ScrollCue from './ScrollCue'
import StayTuned from './StayTuned'
import { useOverlayAnimations } from './hooks/useOverlayAnimations'

/** The DOM layer over the canvas: section A's corners + scroll cue, and section B. */
export default function Overlay() {
  const root = useOverlayAnimations()
  useSectionNavigation()

  return (
    <main ref={root} className="overlay">
      <h1 className="sr-only">Procyon Studios</h1>
      <Corners />
      <ScrollCue />
      <StayTuned />
    </main>
  )
}
