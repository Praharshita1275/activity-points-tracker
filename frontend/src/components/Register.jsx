import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function Register(){
  const [form, setForm] = useState({ rollNo: '', name: '', department: '', email: '', password: '' })
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/auth/register', form)
      toast.success('Registered. Please login')
      navigate('/')
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center p-2" style={{ backgroundColor: '#FAEBEF' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-3">
          <h1 className="text-2xl font-extrabold mb-2" style={{ color: '#333D79' }}>
            Activity Points Tracker
          </h1>
          <h2 className="text-xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="mt-1 text-xs text-gray-600 max-w-sm mx-auto">
            Join our Activity Points Tracker to document your academic achievements and track your progress.
          </p>
          <p className="mt-2 text-xs text-gray-600">
            Already registered?{' '}
            <a href="/" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </a>
          </p>
        </div>

        <div className="bg-white shadow sm:rounded-lg overflow-hidden">
          <form className="p-4" onSubmit={submit}>
            <div className="space-y-3">
              <div>
                <label htmlFor="rollNo" className="block text-xs font-medium text-gray-700 mb-1">
                  Roll Number
                </label>
                <input
                  id="rollNo"
                  name="rollNo"
                  type="text"
                  required
                  className="appearance-none block w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-xs"
                  placeholder="Enter your roll number"
                  value={form.rollNo}
                  onChange={e=>setForm({...form, rollNo: e.target.value})}
                />
              </div>

              <div>
                <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none block w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-xs"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={e=>setForm({...form, name: e.target.value})}
                />
              </div>

              <div>
                <label htmlFor="department" className="block text-xs font-medium text-gray-700 mb-1">
                  Department
                </label>
                <input
                  id="department"
                  name="department"
                  type="text"
                  required
                  className="appearance-none block w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-xs"
                  placeholder="Enter your department"
                  value={form.department}
                  onChange={e=>setForm({...form, department: e.target.value})}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none block w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-xs"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={e=>setForm({...form, email: e.target.value})}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-medium text-[#333D79] mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none block w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#333D79] focus:border-[#333D79] text-xs bg-white"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={e=>setForm({...form, password: e.target.value})}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-custom-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-primary"
                >
                  Create Account
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
