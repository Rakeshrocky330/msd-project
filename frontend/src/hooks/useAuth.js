"use client"

import { useState, useEffect } from "react"
import { authService } from "../services/authService"

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token")
        if (token) {
          const response = await authService.getProfile()
          setUser(response.data)
        }
      } catch (err) {
        console.error("Auth check failed:", err)
        localStorage.removeItem("token")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email, password) => {
    try {
      setLoading(true)
      const response = await authService.login(email, password)
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))
      setUser(response.data.user)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async (email, password) => {
    try {
      setLoading(true)
      const response = await authService.register(email, password)
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))
      setUser(response.data.user)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }
}
