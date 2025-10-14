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
    <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded shadow">
      <h2 className="text-2xl mb-4">Student Register</h2>
      <form onSubmit={submit}>
        <input className="w-full p-2 border mb-2" placeholder="Roll No" value={form.rollNo} onChange={e=>setForm({...form, rollNo: e.target.value})} />
        <input className="w-full p-2 border mb-2" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} />
        <input className="w-full p-2 border mb-2" placeholder="Department" value={form.department} onChange={e=>setForm({...form, department: e.target.value})} />
        <input className="w-full p-2 border mb-2" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} />
        <input className="w-full p-2 border mb-2" placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form, password: e.target.value})} />
        <button className="w-full bg-green-600 text-white p-2 rounded">Register</button>
      </form>
    </div>
  )
}
