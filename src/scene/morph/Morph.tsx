import * as THREE from 'three'
import type { Vector3 } from '@react-three/fiber'
import { fragmentShader, vertexShader } from './shaders'
import { useMorphAnimation } from './useMorphAnimation'

/** The intro's glitchy 2D shape: a circle that spins and morphs into the skull. */
export default function Morph({ position, size }: { position: Vector3; size: number }) {
  const { mesh, material, uniforms } = useMorphAnimation()
  return (
    <mesh ref={mesh} position={position} scale={size}>
      <planeGeometry />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  )
}
