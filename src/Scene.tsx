import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, PointMaterial, Points } from '@react-three/drei'
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
  ToneMapping,
  Vignette,
} from '@react-three/postprocessing'
import { ToneMappingMode, type ChromaticAberrationEffect } from 'postprocessing'
import Logo, { VIEW_H } from './Logo'
import { anim, startIntro } from './timeline'
import { focus, pointer } from './pointer'

function Starfield({ count = 3000 }) {
  const mat = useRef<THREE.PointsMaterial>(null!)
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const v = new THREE.Vector3()
    for (let i = 0; i < count; i++) {
      v.randomDirection().multiplyScalar(30 + Math.random() * 50).toArray(pos, i * 3)
      col.fill(0.15 + Math.random() ** 3 * 0.85, i * 3, i * 3 + 3) // mostly dim, a few bright
    }
    return [pos, col]
  }, [count])
  useFrame(() => (mat.current.opacity = anim.field))
  return (
    <Points positions={positions} colors={colors}>
      <PointMaterial ref={mat} vertexColors size={0.12} sizeAttenuation transparent depthWrite={false} />
    </Points>
  )
}

// Sweeps across the mark during the intro, then follows the pointer (mouse or touch).
// With no recent input it drifts on its own, so phones get the effect without asking for anything.
function Spotlight() {
  const light = useRef<THREE.SpotLight>(null!)
  const size = useThree((s) => s.size)
  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime
    const active = performance.now() - pointer.at < 2500
    const tx = active ? (pointer.x * VIEW_H * size.width) / size.height / 2 : Math.sin(t * 0.37) * 1.1
    const ty = active ? (pointer.y * VIEW_H) / 2 : 0.7 + Math.cos(t * 0.29) * 0.7
    const x = THREE.MathUtils.lerp(anim.lightX, tx, anim.handoff)
    const y = THREE.MathUtils.lerp(0.9, ty, anim.handoff)
    focus.x = THREE.MathUtils.damp(focus.x, x, 4, dt)
    focus.y = THREE.MathUtils.damp(focus.y, y, 4, dt)
    light.current.position.set(focus.x, focus.y, 2.4)
    light.current.target.position.set(focus.x * 0.8, focus.y * 0.8, 0)
    light.current.target.updateMatrixWorld()
    light.current.intensity = anim.light * 25
  })
  return <spotLight ref={light} angle={0.38} penumbra={0.85} decay={2} color="#ffe6bf" />
}

function Effects() {
  const ca = useRef<ChromaticAberrationEffect>(null)
  useFrame(() => {
    const o = 0.0004 + anim.aberration * 0.004
    ca.current?.offset.set(o, o * 0.3) // effects mount a frame after the composer
  })
  return (
    <EffectComposer multisampling={4}>
      <Bloom mipmapBlur intensity={1.2} luminanceThreshold={1} radius={0.75} />
      <ToneMapping mode={ToneMappingMode.AGX} />
      <ChromaticAberration ref={ca} radialModulation modulationOffset={0.2} />
      <Vignette offset={0.25} darkness={0.75} />
      <Noise opacity={0.045} />
    </EffectComposer>
  )
}

export default function Scene() {
  useEffect(() => void startIntro(), [])
  useFrame(({ camera }) => (camera.position.z = anim.camZ))
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
      <Starfield />
      <Logo />
      <Effects />
    </>
  )
}
