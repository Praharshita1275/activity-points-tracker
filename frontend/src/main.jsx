import React from 'react'
import axios from 'axios'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import './index.css'
import NavBar from './components/NavBar'

// Ensure axios sends requests to the backend in development
axios.defaults.baseURL = 'http://localhost:5001'

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
