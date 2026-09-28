import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
  ToneMapping,
  Vignette,
} from '@react-three/postprocessing'
import { ToneMappingMode, type ChromaticAberrationEffect } from 'postprocessing'
import Logo, { LIGHT_REST, VIEW_H } from './Logo'
import { anim, startIntro } from './timeline'
import { focus, pointer } from './pointer'

// Rests on the skull as the mark lands, then follows the pointer (mouse or touch).
// With no recent input it drifts on its own, so phones get the effect without asking for anything.
function Spotlight() {
  const light = useRef<THREE.SpotLight>(null!)
  const size = useThree((s) => s.size)
  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime
    const active = performance.now() - pointer.at < 2500
    const tx = active ? (pointer.x * VIEW_H * size.width) / size.height / 2 : Math.sin(t * 0.37) * 1.1
    const ty = active ? (pointer.y * VIEW_H) / 2 : 0.7 + Math.cos(t * 0.29) * 0.7
    const x = THREE.MathUtils.lerp(LIGHT_REST.x, tx, anim.handoff)
    const y = THREE.MathUtils.lerp(LIGHT_REST.y, ty, anim.handoff)
    focus.x = THREE.MathUtils.damp(focus.x, x, 4, dt)
    focus.y = THREE.MathUtils.damp(focus.y, y, 4, dt)
    light.current.position.set(focus.x, focus.y, 2.4)
    light.current.target.position.set(focus.x * 0.8, focus.y * 0.8, 0)
    light.current.target.updateMatrixWorld()
    light.current.intensity = anim.light * 25
  })
  return <spotLight ref={light} angle={0.38} penumbra={0.85} decay={2} color="#ffe6bf" />
}

// Permanent thin RGB split (the blue/red edge), plus the intro's flares on top.
const CA_REST = 0.0008

function Effects() {
  const ca = useRef<ChromaticAberrationEffect>(null)
  useFrame(() => {
    const o = CA_REST + anim.aberration * 0.006
    ca.current?.offset.set(o, o * 0.25) // effects mount a frame after the composer
  })
  return (
    <EffectComposer multisampling={4}>
      <Bloom mipmapBlur intensity={1.2} luminanceThreshold={1} radius={0.75} />
      <ToneMapping mode={ToneMappingMode.AGX} />
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
      <Spotlight />
      <Environment resolution={256} environmentIntensity={0.9}>
        <Lightformer form="rect" intensity={3} position={[0, 4, 3]} scale={[8, 1.5, 1]} />
        <Lightformer form="rect" intensity={1.5} color="#c8a15a" position={[-5, 0, 2]} scale={[1.5, 6, 1]} />
      </Environment>
      <Logo />
      <Effects />
    </>
  )
}
