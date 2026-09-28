import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { anim } from '../../animation/state'
import { skullField } from './skullField'

/** Shader uniforms for the circle → skull morph, fed from `anim` every frame. */
export function useMorphAnimation() {
  const mesh = useRef<THREE.Mesh>(null!)
  const material = useRef<THREE.ShaderMaterial>(null!)
  const uniforms = useMemo(
    () => ({
      uField: { value: skullField() },
      uTime: { value: 0 },
      uVis: { value: 0 },
      uMorph: { value: 0 },
      uSpin: { value: 0 },
      uDistort: { value: 0 },
      uFill: { value: 0 },
      uGlitch: { value: 0 },
    }),
    [],
  )

  // Write through the material: R3F clones the uniforms prop, so the memo'd object isn't the live one.
  useFrame(({ clock }) => {
    const u = material.current.uniforms
    u.uTime.value = clock.elapsedTime
    u.uVis.value = anim.vis
    u.uMorph.value = anim.morph
    u.uSpin.value = anim.spin
    u.uDistort.value = anim.distort
    u.uFill.value = anim.fill
    u.uGlitch.value = anim.glitch
    mesh.current.visible = anim.vis > 0
  })

  return { mesh, material, uniforms }
}
