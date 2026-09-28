import Morph from '../morph/Morph'
import { SPAN } from '../morph/constants'
import { H, LIFT, MARK, MARK_DEPTH, S, W } from './constants'
import { useLogoAnimation } from './useLogoAnimation'
import { useLogoParts } from './useLogoParts'

export default function Logo() {
  const parts = useLogoParts()
  const { group, letterMeshes } = useLogoAnimation(parts)
  const { mark, letters, material, letterMaterials } = parts

  return (
    <group ref={group} position-y={LIFT}>
      <Morph position={[0, MARK.cy, (MARK_DEPTH / 2 + 2) * S]} size={SPAN * S} />
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
            material={letterMaterials[i]}
            visible={false}
          />
        ))}
      </group>
    </group>
  )
}
