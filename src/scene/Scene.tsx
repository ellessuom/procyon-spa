import { useEffect } from 'react'
import { startIntro } from '../animation/introTimeline'
import Effects from './effects/Effects'
import Lighting from './Lighting'
import Logo from './logo/Logo'
import Sigil from './sigil/Sigil'

export default function Scene() {
  useEffect(() => startIntro(), [])
  return (
    <>
      <Lighting />
      <Sigil />
      <Logo />
      <Effects />
    </>
  )
}
