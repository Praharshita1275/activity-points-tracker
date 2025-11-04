import React, { useState } from 'react'
import api from '../api'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Link } from 'react-router-dom'

export default function AdminLogin() {
  const [facultyId, setFacultyId] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()

  const submit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/api/auth/mentor/login', { facultyId, password })
      login(res.data.token)
      toast.success('Logged in as mentor')
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Mentor login failed')
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ backgroundColor: '#FAEBEF' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-extrabold mb-4" style={{ color: '#333D79' }}>
            Activity Points Tracker
          </h1>
          <h2 className="text-2xl font-bold text-gray-900">
            Mentor Login
          </h2>
          <p className="mt-2 text-sm text-gray-600 max-w-sm mx-auto">
            Mentor access only. Regular students should use the normal login page.
          </p>
          <p className="mt-3 text-sm text-gray-600">
            Not a mentor?{' '}
            <Link to="/" className="font-medium text-indigo-600 hover:text-indigo-500">
              Student Login
            </Link>
          </p>
          <p className="mt-1 text-sm text-gray-600">
            New mentor?{' '}
            <Link to="/mentor-register" className="font-medium text-indigo-600 hover:text-indigo-500">
              Create account
            </Link>
          </p>
        </div>

        <div className="bg-white shadow sm:rounded-lg overflow-hidden">
          <form className="p-6 space-y-4" onSubmit={submit}>
            <div>
              <label htmlFor="facultyId" className="block text-sm font-medium text-gray-700 mb-1">
                Faculty ID
              </label>
              <input
                id="facultyId"
                name="facultyId"
                type="text"
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="Enter faculty ID"
                value={facultyId}
                onChange={e=>setFacultyId(e.target.value)}
                autoComplete="username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="Enter admin password"
                value={password}
                onChange={e=>setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 mt-2"
              style={{ backgroundColor: '#333D79' }}
            >
              Sign in as Mentor
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
