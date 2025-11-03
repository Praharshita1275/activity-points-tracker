import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(()=>{
    // Ensure axios sends requests to the proper backend
    axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5007'

    const token = localStorage.getItem('token')
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]))
      setUser({ role: payload.role, rollNo: payload.rollNo, username: payload.username })
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
  },[])

  const login = (token) => {
    localStorage.setItem('token', token)
    const payload = JSON.parse(atob(token.split('.')[1]))
    setUser({ role: payload.role, rollNo: payload.rollNo, username: payload.username })
    // ensure Authorization header is set; baseURL already configured in main.jsx/useEffect
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
