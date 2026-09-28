import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // deep imports / CommonJS deps Vite's dep scan can miss; pre-bundled so the first dev load doesn't 404
  optimizeDeps: {
    include: ['three/addons/loaders/SVGLoader.js', 'gsap/SplitText', 'gsap/EasePack', 'bitmap-sdf', 'react-icons/fi', 'react-icons/si'],
  },
})
