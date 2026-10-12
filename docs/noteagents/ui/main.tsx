import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import NoteAgentsChat from './NoteAgentsChat'
import './styles.css'

createRoot(document.getElementById('root')!).render(<StrictMode><NoteAgentsChat /></StrictMode>)
