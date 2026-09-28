import { Environment, Lightformer } from '@react-three/drei'

/** Background, key light and a small studio environment for the clearcoat reflections. */
export default function Lighting() {
  return (
    <>
      <color attach="background" args={['#07070a']} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[-3, 4, 5]} intensity={1.6} color="#fff1dc" />
      <Environment resolution={256} environmentIntensity={0.9}>
        <Lightformer form="rect" intensity={3} position={[0, 4, 3]} scale={[8, 1.5, 1]} />
        <Lightformer form="rect" intensity={1.5} color="#c8a15a" position={[-5, 0, 2]} scale={[1.5, 6, 1]} />
      </Environment>
    </>
  )
}
