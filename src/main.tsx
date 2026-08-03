import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'

export const App = lazy(() => import('./App.tsx'))
export const HealthTestPage = lazy(() => import('./pages/HealthTestPage.tsx'))

const page = window.location.pathname === '/health-test'
  ? <HealthTestPage />
  : <App />

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<main className="page">Loading…</main>}>
      {page}
    </Suspense>
  </StrictMode>,
)
