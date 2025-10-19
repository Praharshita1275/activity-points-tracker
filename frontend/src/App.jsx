import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import AdminLogin from './components/AdminLogin'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import UploadActivity from './components/UploadActivity'
import ActivitiesList from './components/ActivitiesList'
import AdminDashboard from './components/AdminDashboard'
import { useAuth } from './context/AuthContext'

function App() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAEBEF' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={user ? <Navigate to={user.role === 'admin' ? "/admin" : "/dashboard"} /> : <Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin-login" element={user ? <Navigate to={user.role === 'admin' ? "/admin" : "/dashboard"} /> : <AdminLogin />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
          <Route path="/upload" element={user ? <UploadActivity /> : <Navigate to="/" />} />
          <Route path="/activities" element={user ? <ActivitiesList /> : <Navigate to="/" />} />
          <Route path="/admin" element={user && user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/admin-login" />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
