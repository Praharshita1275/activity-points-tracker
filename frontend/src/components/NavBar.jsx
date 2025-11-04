import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function NavBar(){
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/') }

  return (
    <nav className="shadow-md" style={{ backgroundColor: '#333D79' }}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between h-14">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-white hover:text-indigo-100">APTrack</span>
            </Link>
            {user && (
              <div className="ml-6 flex items-center space-x-3">
                {user.role !== 'mentor' && (
                  <Link to="/dashboard" className="px-3 py-1.5 rounded-md text-sm text-white hover:bg-indigo-500 transition-colors duration-200">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Dashboard
                    </span>
                  </Link>
                )}
                {user.role !== 'mentor' && (
                  <Link to="/upload" className="px-3 py-1.5 rounded-md text-sm text-white hover:bg-indigo-500 transition-colors duration-200">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Upload
                    </span>
                  </Link>
                )}
                {user.role !== 'mentor' && (
                  <Link to="/activities" className="px-3 py-1.5 rounded-md text-sm text-white hover:bg-indigo-500 transition-colors duration-200">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Activities
                    </span>
                  </Link>
                )}
                {user.role === 'mentor' && (
                  <>
                    <Link to="/mentor" className="px-3 py-1.5 rounded-md text-sm text-white hover:bg-indigo-500 transition-colors duration-200">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Dashboard
                      </span>
                    </Link>
                    <Link to="/mentor/students" className="px-3 py-1.5 rounded-md text-sm text-white hover:bg-indigo-500 transition-colors duration-200">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                        Students
                      </span>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
                    <span className="text-indigo-700 text-sm font-medium">{(user.username || user.rollNo || "U")[0].toUpperCase()}</span>
                  </div>
                  <span className="text-sm font-medium text-white hidden sm:inline">{user.username || user.rollNo}</span>
                </div>
                <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white py-1.5 px-4 rounded-md text-sm font-medium transition-colors duration-200">
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-x-3">
                <Link to="/register" className="bg-white text-indigo-600 hover:bg-indigo-50 py-1.5 px-4 rounded-md text-sm font-medium transition-colors duration-200">Register</Link>
                <Link to="/" className="bg-indigo-500 hover:bg-indigo-400 text-white py-1.5 px-4 rounded-md text-sm font-medium transition-colors duration-200">Login</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
