import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Glitch,
  Noise,
  ToneMapping,
  Vignette,
} from '@react-three/postprocessing'
import { GlitchMode, ToneMappingMode, type ChromaticAberrationEffect, type GlitchEffect } from 'postprocessing'
import Logo from './Logo'
import { anim, startIntro } from './timeline'

// Permanent thin RGB split (the blue/red edge), plus the intro's flares on top.
const CA_REST = 0.0008

function Effects() {
  const ca = useRef<ChromaticAberrationEffect>(null)
  const glitch = useRef<GlitchEffect>(null)
  // effects mount a frame after the composer, hence the ?.
  useFrame(() => {
    const o = CA_REST + anim.aberration * 0.006
    ca.current?.offset.set(o, o * 0.25)
    if (glitch.current) glitch.current.mode = anim.glitchFx ? GlitchMode.CONSTANT_WILD : GlitchMode.DISABLED
  })
  return (
    <EffectComposer multisampling={4}>
      <Bloom mipmapBlur intensity={1.2} luminanceThreshold={1} radius={0.75} />
      <ToneMapping mode={ToneMappingMode.AGX} />
      {/* tearing during the A ↔ B jump; driven by anim.glitchFx above */}
      <Glitch ref={glitch} active={false} strength={[0.2, 0.5]} ratio={0.6} />
      <ChromaticAberration ref={ca} />
      <Vignette offset={0.25} darkness={0.75} />
      <Noise opacity={0.045} />
    </EffectComposer>
  )
}

export default function Scene() {
  useEffect(() => void startIntro(), [])
  return (
    <>
      <color attach="background" args={['#07070a']} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[-3, 4, 5]} intensity={1.6} color="#fff1dc" />
      <Environment resolution={256} environmentIntensity={0.9}>
        <Lightformer form="rect" intensity={3} position={[0, 4, 3]} scale={[8, 1.5, 1]} />
        <Lightformer form="rect" intensity={1.5} color="#c8a15a" position={[-5, 0, 2]} scale={[1.5, 6, 1]} />
      </Environment>
      <Logo />
      <Effects />
    </>
  )
}
