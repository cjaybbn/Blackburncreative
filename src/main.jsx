import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import WorkGallery from './WorkGallery'
import LightpaintGallery from './LightpaintGallery'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/work" element={<WorkGallery />} />
        <Route path="/lightpainting" element={<LightpaintGallery />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
