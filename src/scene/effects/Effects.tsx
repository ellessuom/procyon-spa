import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Glitch,
  Noise,
  ToneMapping,
  Vignette,
} from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import { useEffectsAnimation } from './useEffectsAnimation'

export default function Effects() {
  const { chromaticAberration, glitch } = useEffectsAnimation()
  return (
    <EffectComposer multisampling={4}>
      <Bloom mipmapBlur intensity={1.2} luminanceThreshold={1} radius={0.75} />
      <ToneMapping mode={ToneMappingMode.AGX} />
      {/* tearing during the A ↔ B jump; driven by anim.glitchFx */}
      <Glitch ref={glitch} active={false} strength={[0.2, 0.5]} ratio={0.6} />
      <ChromaticAberration ref={chromaticAberration} />
      <Vignette offset={0.25} darkness={0.75} />
      <Noise opacity={0.045} />
    </EffectComposer>
  )
}
