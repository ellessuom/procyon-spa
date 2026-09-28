import { createRoot } from 'react-dom/client'
import '@fontsource/anton/400.css'
import '@fontsource/instrument-sans/400.css'
import '@fontsource/instrument-sans/600.css'
import App from './App'
import './styles.css'

createRoot(document.getElementById('root')!).render(<App />)
