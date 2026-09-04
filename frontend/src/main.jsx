import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import router from './app/routes.jsx'
import { RouterProvider } from 'react-router-dom'
import "./App.css"
import { AuthProvider } from './context/AuthContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
