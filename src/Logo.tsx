import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js'
import markSvg from '../assets/mark.svg?raw'
import wordSvg from '../assets/wordmark.svg?raw'
import Morph, { SPAN } from './Morph'
import { anim } from './timeline'
import { focus } from './pointer'

// Both SVGs share logo.svg's coordinate space (330 × 488, y down). S maps it to world units.
const W = 330
const H = 488
const S = 2.9 / H
const LIFT = 0.3 // lockup sits a bit above centre, leaving room for the page text
export const VIEW_H = 2 * 8 * Math.tan(THREE.MathUtils.degToRad(35 / 2)) // visible height at the camera distance
const MARK_DEPTH = 16
const WORD_DEPTH = 10
const MARK_CENTER = new THREE.Vector3(0, (H / 2 - 146) * S, 0)
/** Where the spotlight rests (on the skull) before it's handed to the visitor. */
export const LIGHT_REST = { x: 0, y: LIFT + MARK_CENTER.y }

function build() {
  const loader = new SVGLoader()
  const shapesOf = (svg: string) =>
    loader.parse(svg.replaceAll('currentColor', '#fff')).paths.map((p) => SVGLoader.createShapes(p))
  // bevelOffset = -bevelSize keeps the outline true, so the cut-outs in the bones and the Y stay open
  const extrude = (shapes: THREE.Shape[], depth: number) =>
    new THREE.ExtrudeGeometry(shapes, {
      depth,
      curveSegments: 16,
      bevelEnabled: true,
      bevelThickness: 1.5,
      bevelSize: 0.7,
      bevelOffset: -0.7,
      bevelSegments: 4,
    }).translate(0, 0, -depth / 2)

  const mark = shapesOf(markSvg).map((s) => extrude(s, MARK_DEPTH))
  const wordShapes = shapesOf(wordSvg)
  wordShapes.splice(4, 2, [...wordShapes[4], ...wordShapes[5]]) // the Y is two pieces (its cut)
  const letters = wordShapes.map((s) => extrude(s, WORD_DEPTH))
  return { mark, letters }
}

export default function Logo() {
  const { mark, letters } = useMemo(build, [])
  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#efe6cf',
        roughness: 0.38,
        metalness: 0.05,
        clearcoat: 0.8,
        clearcoatRoughness: 0.25,
        emissive: '#ffd9a0',
        emissiveIntensity: 0,
        transparent: true,
        opacity: 0,
      }),
    [],
  )
  const letterMats = useMemo(() => letters.map(() => material.clone()), [letters, material])
  const letterMeshes = useRef<THREE.Mesh[]>([])
  const group = useRef<THREE.Group>(null!)
  const size = useThree((s) => s.size)

  useFrame(({ clock }, dt) => {
    // shrink to fit narrow (portrait) screens
    const fit = Math.min(1, (VIEW_H * (size.width / size.height) * 0.82) / (W * S))
    group.current.scale.setScalar(fit)

    material.opacity = anim.solid
    material.emissiveIntensity = anim.hot * 3

    // letters glitch in: p steps 0 → ⅓ → ⅔ → 1 — a bright jittered frame, a dim one, then settled
    letters.forEach((_, i) => {
      const p = anim.letters[i].p
      const settling = p > 0 && p < 1
      letterMeshes.current[i].visible = p > 0
      letterMeshes.current[i].position.x = settling ? (i % 2 ? 1 : -1) * (1 - p) * 14 : 0
      letterMats[i].opacity = settling && p > 0.5 ? 0.45 : 1
      letterMats[i].emissiveIntensity = settling ? 2.5 : 0
    })

    // once handed over: a slow float, and a slight tilt toward the light
    const h = anim.handoff
    group.current.position.y = LIFT + Math.sin(clock.elapsedTime * 0.8) * 0.025 * h
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, focus.x * 0.07 * h, 2.5, dt)
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -(focus.y - LIFT) * 0.07 * h, 2.5, dt)
  })

  return (
    <group ref={group} position-y={LIFT}>
      <Morph position={[0, MARK_CENTER.y, (MARK_DEPTH / 2 + 2) * S]} size={SPAN * S} />
      <group position={[(-W / 2) * S, (H / 2) * S, 0]} scale={[S, -S, S]}>
        {mark.map((geometry, i) => (
          // the "over" bone sits a hair in front of the one it crosses
          <mesh key={i} geometry={geometry} material={material} position-z={i === 1 ? 1 : 0} />
        ))}
        {letters.map((geometry, i) => (
          <mesh
            key={`l${i}`}
            ref={(m) => void (m && (letterMeshes.current[i] = m))}
            geometry={geometry}
            material={letterMats[i]}
            visible={false}
          />
        ))}
      </group>
    </group>
  )
}
