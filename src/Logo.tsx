import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { PointMaterial, Points } from '@react-three/drei'
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js'
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js'
import gsap from 'gsap'
import markSvg from '../assets/mark.svg?raw'
import wordSvg from '../assets/wordmark.svg?raw'
import Star from './Star'
import { anim } from './timeline'
import { focus } from './pointer'

// Both SVGs share logo.svg's coordinate space (330 × 488, y down). S maps it to world units.
const W = 330
const H = 488
const S = 2.9 / H
const LIFT = 0.3 // lockup sits a bit above centre, leaving room for the page text
export const VIEW_H = 2 * 8 * Math.tan(THREE.MathUtils.degToRad(35 / 2)) // visible height at the final camera distance
const MARK_DEPTH = 16
const WORD_DEPTH = 10
const MARK_CENTER = new THREE.Vector3(0, (H / 2 - 146) * S, 0)
const SPREAD = 0.4 // share of the gather each particle may wait before leaving
const ease = gsap.parseEase('power3.inOut')

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

  const markShapes = shapesOf(markSvg)
  const mark = markShapes.map((s) => extrude(s, MARK_DEPTH))

  const wordShapes = shapesOf(wordSvg)
  wordShapes.splice(4, 2, [...wordShapes[4], ...wordShapes[5]]) // the Y is two pieces (its cut)
  const letters = wordShapes.map((s) => {
    const geometry = extrude(s, WORD_DEPTH)
    geometry.computeBoundingBox()
    return { geometry, cx: geometry.boundingBox!.getCenter(new THREE.Vector3()).x }
  })

  // Particle targets: points spread evenly over the flat mark, in world units.
  const flat = new THREE.Mesh(new THREE.ShapeGeometry(markShapes.flat()))
  const sampler = new MeshSurfaceSampler(flat).build()
  const count = innerWidth < 768 ? 3000 : 7000
  const targets = new Float32Array(count * 3)
  const p = new THREE.Vector3()
  for (let i = 0; i < count; i++) {
    sampler.sample(p)
    targets.set([(p.x - W / 2) * S, (H / 2 - p.y) * S, (MARK_DEPTH / 2 + 1.5) * S], i * 3)
  }
  return { mark, letters, targets }
}

function Particles({ targets }: { targets: Float32Array }) {
  const ref = useRef<THREE.Points>(null!)
  const mat = useRef<THREE.PointsMaterial>(null!)
  const last = useRef(-1)
  const { start, delay, spin } = useMemo(() => {
    const n = targets.length / 3
    const start = new Float32Array(n * 3)
    for (let i = 0; i < n; i++)
      start.set(
        [THREE.MathUtils.randFloatSpread(14), THREE.MathUtils.randFloatSpread(8), THREE.MathUtils.randFloat(-12, 3)],
        i * 3,
      )
    return {
      start,
      delay: Float32Array.from({ length: n }, Math.random),
      spin: Float32Array.from({ length: n }, () => THREE.MathUtils.randFloat(1.2, 2.6)),
    }
  }, [targets])

  // Each particle eases from its star position to its target while swirling about the mark's centre.
  useFrame(() => {
    mat.current.opacity = anim.dots
    const g = anim.gather
    if (g === last.current) return
    last.current = g
    const out = ref.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < delay.length; i++) {
      const e = ease(THREE.MathUtils.clamp((g - delay[i] * SPREAD) / (1 - SPREAD), 0, 1))
      const j = i * 3
      const x = start[j] + (targets[j] - start[j]) * e
      const y = start[j + 1] + (targets[j + 1] - start[j + 1]) * e - MARK_CENTER.y
      const a = (1 - e) * spin[i]
      const c = Math.cos(a)
      const s = Math.sin(a)
      out[j] = x * c - y * s
      out[j + 1] = x * s + y * c + MARK_CENTER.y
      out[j + 2] = start[j + 2] + (targets[j + 2] - start[j + 2]) * e
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <Points ref={ref} positions={start.slice()} frustumCulled={false}>
      <PointMaterial
        ref={mat}
        transparent
        size={0.03}
        sizeAttenuation
        depthWrite={false}
        toneMapped={false}
        color={new THREE.Color(2, 1.9, 1.7)}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

export default function Logo() {
  const { mark, letters, targets } = useMemo(build, [])
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

    // letters rise into place as their tracking tightens, flashing warm on the way
    letters.forEach(({ cx }, i) => {
      const p = anim.letters[i].p
      letterMeshes.current[i].position.set((cx - W / 2) * 0.2 * (1 - p), 24 * (1 - p), 0)
      letterMats[i].opacity = p
      letterMats[i].emissiveIntensity = 6 * p * (1 - p)
    })

    // once handed over: a slow float, and a slight tilt toward the light
    const h = anim.handoff
    group.current.position.y = LIFT + Math.sin(clock.elapsedTime * 0.8) * 0.025 * h
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, focus.x * 0.07 * h, 2.5, dt)
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -(focus.y - LIFT) * 0.07 * h, 2.5, dt)
  })

  return (
    <group ref={group} position-y={LIFT}>
      <Star position={MARK_CENTER} />
      <Particles targets={targets} />
      <group position={[(-W / 2) * S, (H / 2) * S, 0]} scale={[S, -S, S]}>
        {mark.map((geometry, i) => (
          // the "over" bone sits a hair in front of the one it crosses
          <mesh key={i} geometry={geometry} material={material} position-z={i === 1 ? 1 : 0} />
        ))}
        {letters.map(({ geometry }, i) => (
          <mesh
            key={`l${i}`}
            ref={(m) => void (m && (letterMeshes.current[i] = m))}
            geometry={geometry}
            material={letterMats[i]}
          />
        ))}
      </group>
    </group>
  )
}
