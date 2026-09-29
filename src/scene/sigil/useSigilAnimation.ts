// R3F's model: three.js objects and materials are mutated every frame inside useFrame; they aren't React state.
/* eslint-disable react-hooks/immutability */
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { anim } from '../../animation/state'
import { lockupFit } from '../logo/constants'
import { FLARE, IVORY, OPACITY, R_IN, SPIN, TOP } from './constants'
import { buildGlyphs } from './geometry'
import { ringScale } from './layout'

const createMaterial = () =>
  new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide })

/** Per-frame sigil ring: size, A / B height, slow spin, the jump's jitter, fade-ins and the cut's flare. */
export function useSigilAnimation() {
  const group = useRef<THREE.Group>(null!)
  const spin = useRef(0)
  const size = useThree((s) => s.size)
  const glyphs = useMemo(() => buildGlyphs(), [])
  const lineMaterial = useMemo(() => createMaterial(), [])
  // each glyph gets its own material so it can glitch on its own
  const glyphMaterials = useMemo(() => glyphs.map(() => createMaterial()), [glyphs])

  useFrame((_, delta) => {
    // Same size in A and B. A: centred on the top edge. B: raised until its inner line's lowest point is mid-screen.
    // anim.section moves in steps() during the jump, so the ring rises frame by frame with the logo (plus jitter).
    const scale = ringScale(lockupFit(size.width / size.height))
    group.current.scale.setScalar(scale)
    group.current.position.y = THREE.MathUtils.lerp(TOP, R_IN * scale, anim.section)
    group.current.position.x = anim.glitchFx ? (Math.random() - 0.5) * 0.12 : 0
    spin.current += delta * SPIN
    group.current.rotation.z = spin.current + (anim.glitchFx ? (Math.random() - 0.5) * 0.03 : 0)

    const flare = 1 + anim.hot * FLARE
    lineMaterial.opacity = OPACITY * anim.sigil
    lineMaterial.color.copy(IVORY).multiplyScalar(flare)
    glyphMaterials.forEach((material, i) => {
      material.opacity = OPACITY * anim.glyphs[i].p
      material.color.copy(IVORY).multiplyScalar(flare)
    })
  })

  return { group, glyphs, lineMaterial, glyphMaterials }
}
