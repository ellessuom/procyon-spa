import { createRoot } from 'react-dom/client'
import '@fontsource/anton/400.css'
import '@fontsource/instrument-sans/400.css'
import '@fontsource/instrument-sans/600.css'
import App from './App'
import { reducedMotion } from './animation/motionPrefs'
import './styles/index.css'

// CSS follows the same motion rule as the JS (dev ignores the OS setting; ?reduced forces it)
document.documentElement.classList.toggle('reduced', reducedMotion)

createRoot(document.getElementById('root')!).render(<App />)
