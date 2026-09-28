import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, type Vector3 } from '@react-three/fiber'
import { Billboard } from '@react-three/drei'
import { anim } from './timeline'

const SIZE = new THREE.Vector2(12, 3)

// Point core + soft halo + anamorphic horizontal streak, all additive.
const frag = /* glsl */ `
  uniform float uIntensity, uStreak;
  uniform vec2 uSize;
  uniform vec3 uCore, uFlare;
  varying vec2 vUv;
  void main() {
    vec2 p = (vUv - 0.5) * uSize;
    float r = length(p);
    float core = exp(-r * 18.0) * 6.0 + exp(-r * 3.0) * 0.25;
    float streak = exp(-abs(p.y) * 60.0) * exp(-abs(p.x) / max(uStreak * 2.0, 1e-4)) * 1.5;
    vec2 e = abs(vUv - 0.5) * 2.0;
    float edge = (1.0 - smoothstep(0.7, 1.0, e.x)) * (1.0 - smoothstep(0.7, 1.0, e.y));
    gl_FragColor = vec4((uCore * core + uFlare * streak) * uIntensity * edge, 1.0);
  }
`
const vert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`

export default function Star({ position }: { position: Vector3 }) {
  const mat = useRef<THREE.ShaderMaterial>(null!)
  const uniforms = useMemo(
    () => ({
      uIntensity: { value: 0 },
      uStreak: { value: 0 },
      uSize: { value: SIZE },
      uCore: { value: new THREE.Color('#fff4de') },
      uFlare: { value: new THREE.Color('#9fb8ff') },
    }),
    [],
  )
  // Write through the material: R3F clones the uniforms prop, so the memo'd object isn't the live one.
  useFrame(() => {
    mat.current.uniforms.uIntensity.value = anim.star
    mat.current.uniforms.uStreak.value = anim.streak
  })
  return (
    <Billboard position={position}>
      <mesh scale={[SIZE.x, SIZE.y, 1]}>
        <planeGeometry />
        <shaderMaterial
          ref={mat}
          uniforms={uniforms}
          vertexShader={vert}
          fragmentShader={frag}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </Billboard>
  )
}
