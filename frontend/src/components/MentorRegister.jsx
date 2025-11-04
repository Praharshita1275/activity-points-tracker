import React, { useState } from 'react'
import api from '../api'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

export default function MentorRegister(){
  const [facultyId, setFacultyId] = useState('')
  const [name, setName] = useState('')
  const [department, setDepartment] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()

  const submit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/api/auth/mentor/register', { facultyId, name, department, password })
      login(res.data.token)
      toast.success('Mentor account created')
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Mentor registration failed')
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ backgroundColor: '#FAEBEF' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-extrabold mb-4" style={{ color: '#333D79' }}>
            Activity Points Tracker
          </h1>
          <h2 className="text-2xl font-bold text-gray-900">Mentor Registration</h2>
          <p className="mt-3 text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/mentor-login" className="font-medium text-indigo-600 hover:text-indigo-500">Mentor Login</Link>
          </p>
        </div>

        <div className="bg-white shadow sm:rounded-lg overflow-hidden">
          <form className="p-6 space-y-4" onSubmit={submit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Faculty ID</label>
              <input className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm" value={facultyId} onChange={e=>setFacultyId(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm" value={name} onChange={e=>setName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm" value={department} onChange={e=>setDepartment(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm" value={password} onChange={e=>setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="w-full py-2 px-4 rounded-md text-white" style={{ backgroundColor: '#333D79' }}>Create Mentor</button>
          </form>
        </div>
      </div>
    </div>
  )
}
