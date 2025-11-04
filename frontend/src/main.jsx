import React from 'react'
import axios from 'axios'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import './index.css'
import NavBar from './components/NavBar'

// Ensure axios sends requests to the correct backend
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <NavBar />
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
