import { FiArrowDown } from 'react-icons/fi'
import { goToSection } from '../navigation/goToSection'

export default function ScrollCue() {
  return (
    <button type="button" className="cue label" onClick={() => goToSection(1)}>
      Scroll <FiArrowDown aria-hidden />
    </button>
  )
}
