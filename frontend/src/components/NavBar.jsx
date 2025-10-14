import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function NavBar(){
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/') }

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <div className="flex items-center space-x-6">
        <Link to="/" className="font-bold text-xl">APTrack</Link>
        {user && (
          <>
            <Link to="/dashboard" className="text-gray-700 hover:underline">Dashboard</Link>
            <Link to="/upload" className="text-gray-700 hover:underline">Upload</Link>
            <Link to="/activities" className="text-gray-700 hover:underline">My Activities</Link>
            {user.role === 'admin' && <Link to="/admin" className="text-gray-700 hover:underline">Admin</Link>}
          </>
        )}
      </div>
      <div>
        {user ? (
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{user.username || user.rollNo}</span>
            <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
          </div>
        ) : (
          <div className="space-x-4">
            <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
            <Link to="/" className="text-blue-600 hover:underline">Login</Link>
          </div>
        )}
      </div>
    </nav>
  )
}
