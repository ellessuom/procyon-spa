// R3F's model: three.js materials are mutated every frame inside useFrame; they aren't React state.
/* eslint-disable react-hooks/immutability */
import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { anim, pose } from '../../animation/state'
import { VIEW_H } from '../constants'
import { LIFT, LOCKUP_W } from './constants'
import { letterState } from './letters'
import type { LogoParts } from './useLogoParts'

/** Per-frame logo pose (A centred ↔ B in #logo-slot), fade-in, glow and the letters' glitch. */
export function useLogoAnimation({ letters, material, letterMaterials, wordThresholds }: LogoParts) {
  const group = useRef<THREE.Group>(null!)
  const letterMeshes = useRef<THREE.Mesh[]>([])
  const size = useThree((s) => s.size)

  useFrame(() => {
    // Section A: centred, shrunk to fit narrow (portrait) screens. Section B: fitted into #logo-slot.
    // anim.section moves in steps() during the jump, so the logo teleports frame by frame (with jitter).
    const fit = Math.min(1, (VIEW_H * (size.width / size.height) * 0.82) / LOCKUP_W)
    const s = anim.section
    group.current.scale.setScalar(THREE.MathUtils.lerp(fit, pose.scale, s))
    group.current.position.y = THREE.MathUtils.lerp(LIFT, pose.y, s)
    group.current.position.x = anim.glitchFx ? (Math.random() - 0.5) * 0.12 : 0

    material.opacity = anim.solid
    material.emissiveIntensity = anim.hot * 3

    letters.forEach((_, i) => {
      const letter = letterState(i, anim.letters[i].p, anim.word, wordThresholds[i])
      letterMeshes.current[i].visible = letter.visible
      letterMeshes.current[i].position.x = letter.x
      letterMaterials[i].opacity = letter.opacity
      letterMaterials[i].emissiveIntensity = letter.emissive
    })
  })

  return { group, letterMeshes }
}
