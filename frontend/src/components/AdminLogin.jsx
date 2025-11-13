import React, { useState } from 'react'
import api from '../api'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Link } from 'react-router-dom'

export default function AdminLogin() {
  const [facultyId, setFacultyId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const { login } = useAuth()

  const submit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/api/auth/mentor/login', { facultyId, password })
      login(res.data.token)
      toast.success('Logged in as mentor')
      setErrorMsg('')
    } catch (err) {
      console.error(err)
      const msg = err.response?.data?.message
      if (err.response?.status === 400 && msg) {
        setErrorMsg('Wrong password')
      } else {
        setErrorMsg('Mentor login failed')
      }
      toast.error(msg || 'Mentor login failed')
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
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm pr-10"
                  placeholder="Enter mentor password"
                  value={password}
                  onChange={e=>setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errorMsg && (
                <p className="mt-1 text-sm text-red-600">{errorMsg}</p>
              )}
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
