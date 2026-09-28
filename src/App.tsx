import { Canvas } from '@react-three/fiber'
import markSvg from '../assets/mark.svg?raw'
import wordSvg from '../assets/wordmark.svg?raw'
import Scene from './Scene'
import Overlay from './Overlay'

export default function App() {
  return (
    <>
      <Canvas
        aria-hidden
        dpr={[1, 2]}
        gl={{ antialias: false }}
        camera={{ position: [0, 0, 8], fov: 35 }}
        fallback={<div className="fallback" dangerouslySetInnerHTML={{ __html: markSvg + wordSvg }} />}
      >
        <Scene />
      </Canvas>
      <Overlay />
    </>
  )
}
