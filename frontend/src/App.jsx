import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import UploadActivity from './components/UploadActivity'
import ActivitiesList from './components/ActivitiesList'
import AdminDashboard from './components/AdminDashboard'
import { useAuth } from './context/AuthContext'

function App() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
      <Route path="/upload" element={user ? <UploadActivity /> : <Navigate to="/" />} />
      <Route path="/activities" element={user ? <ActivitiesList /> : <Navigate to="/" />} />
      <Route path="/admin" element={user && user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
    </Routes>
  )
}

export default App
