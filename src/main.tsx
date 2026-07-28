import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import App from './App.tsx'
import HealthTestPage from './pages/HealthTestPage.tsx'

const page = window.location.pathname === '/health-test'
  ? <HealthTestPage />
  : <App />

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {page}
  </StrictMode>,
)
