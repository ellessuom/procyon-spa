import { LINE, R_IN, Z } from './constants'
import { useSigilAnimation } from './useSigilAnimation'

/** The huge, slowly spinning ring of glyphs behind the logo, centred on the top edge so only its lower half shows. */
export default function Sigil() {
  const { group, glyphs, lineMaterial, glyphMaterials } = useSigilAnimation()

  return (
    <group ref={group} position-z={Z}>
      {[R_IN, 1].map((r) => (
        <mesh key={r} material={lineMaterial}>
          <ringGeometry args={[r - LINE / 2, r + LINE / 2, 256]} />
        </mesh>
      ))}
      {glyphs.map((geometry, i) => (
        <mesh key={i} geometry={geometry} material={glyphMaterials[i]} />
      ))}
    </group>
  )
}
