import { Canvas } from '@react-three/fiber'
import markSvg from './assets/mark.svg?raw'
import wordSvg from './assets/wordmark.svg?raw'
import Overlay from './overlay/Overlay'
import { CAMERA_FOV, CAMERA_Z } from './scene/constants'
import Scene from './scene/Scene'

export default function App() {
  return (
    <>
      <Canvas
        aria-hidden
        dpr={[1, 2]}
        gl={{ antialias: false }}
        camera={{ position: [0, 0, CAMERA_Z], fov: CAMERA_FOV }}
        fallback={<div className="fallback" dangerouslySetInnerHTML={{ __html: markSvg + wordSvg }} />}
      >
        <Scene />
      </Canvas>
      <Overlay />
      <div className="crt" aria-hidden />
    </>
  )
}
