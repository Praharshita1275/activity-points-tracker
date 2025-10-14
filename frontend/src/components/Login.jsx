import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Link } from 'react-router-dom'

export default function Login() {
  const [rollNo, setRollNo] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()

  const submit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('/api/auth/login', { rollNo, password })
      login(res.data.token)
      toast.success('Logged in')
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-24 bg-white p-6 rounded shadow">
      <h2 className="text-2xl mb-4">Student Login</h2>
      <form onSubmit={submit}>
        <input name="rollNo" className="w-full p-2 border mb-2" placeholder="Roll No" value={rollNo} onChange={e=>setRollNo(e.target.value)} autoComplete="username" />
        <input name="password" className="w-full p-2 border mb-2" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" />
        <button className="w-full bg-blue-600 text-white p-2 rounded">Login</button>
      </form>
      <div className="mt-4 text-center">
        <span className="text-sm">Don't have an account? </span>
        <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
      </div>
    </div>
  )
}
