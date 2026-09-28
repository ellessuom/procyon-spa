import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { GlitchMode, type ChromaticAberrationEffect, type GlitchEffect } from 'postprocessing'
import { anim } from '../../animation/state'

// Permanent thin RGB split (the blue/red edge), plus the intro's flares on top.
const CA_REST = 0.0008

/** Drives the post effects from `anim`: RGB split strength and the A ↔ B tearing. */
export function useEffectsAnimation() {
  const chromaticAberration = useRef<ChromaticAberrationEffect>(null)
  const glitch = useRef<GlitchEffect>(null)

  // effects mount a frame after the composer, hence the ?.
  useFrame(() => {
    const o = CA_REST + anim.aberration * 0.006
    chromaticAberration.current?.offset.set(o, o * 0.25)
    if (glitch.current) glitch.current.mode = anim.glitchFx ? GlitchMode.CONSTANT_WILD : GlitchMode.DISABLED
  })

  return { chromaticAberration, glitch }
}
