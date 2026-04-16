import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

const WorkGallery = lazy(() => import('./WorkGallery.jsx'))
const LightpaintGallery = lazy(() => import('./LightpaintGallery.jsx'))

function RouteFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      style={{
        minHeight: '40vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif',
        color: '#666',
        fontSize: 14,
      }}
    >
      Loading…
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="/work"
          element={
            <Suspense fallback={<RouteFallback />}>
              <WorkGallery />
            </Suspense>
          }
        />
        <Route
          path="/lightpainting"
          element={
            <Suspense fallback={<RouteFallback />}>
              <LightpaintGallery />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
