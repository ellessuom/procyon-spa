import { useEffect } from 'react'
import { startIntro } from '../animation/introTimeline'
import Effects from './effects/Effects'
import Lighting from './Lighting'
import Logo from './logo/Logo'

export default function Scene() {
  useEffect(() => startIntro(), [])
  return (
    <>
      <Lighting />
      <Logo />
      <Effects />
    </>
  )
}
