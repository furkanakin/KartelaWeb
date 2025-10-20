import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import App from './App.tsx'
import CategoryPalettes from './pages/CategoryPalettes'
import BrandPalettes from './pages/BrandPalettes'
import PaletteDetail from './pages/PaletteDetail'
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import Categories from './pages/admin/Categories'
import Brands from './pages/admin/Brands'
import Palettes from './pages/admin/Palettes'
import WhatsAppSettings from './pages/admin/WhatsAppSettings'
import ProtectedRoute from './components/ProtectedRoute'
import { initializeStorage } from './services/storage'
import './index.css'

// Initialize localStorage with default data
initializeStorage();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/category/:categoryId" element={<CategoryPalettes />} />
          <Route path="/brand/:brandId" element={<BrandPalettes />} />
          <Route path="/palette/:paletteId" element={<PaletteDetail />} />
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute>
                <Categories />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/brands"
            element={
              <ProtectedRoute>
                <Brands />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/palettes"
            element={
              <ProtectedRoute>
                <Palettes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/whatsapp"
            element={
              <ProtectedRoute>
                <WhatsAppSettings />
              </ProtectedRoute>
            }
          />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
