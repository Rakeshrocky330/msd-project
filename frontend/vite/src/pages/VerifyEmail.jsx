"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import "../styles/Auth.css"

export default function VerifyEmail() {
  const [loading, setLoading] = useState(true)
  const [verified, setVerified] = useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get("token")

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await axios.post("/api/auth/verify-email", { token })
        setVerified(true)
        toast.success("Email verified successfully!")
        setTimeout(() => navigate("/dashboard"), 2000)
      } catch (error) {
        toast.error(error.response?.data?.message || "Email verification failed")
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      verifyEmail()
    }
  }, [token, navigate])

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>AI Career Tracker</h1>
        <h2>Email Verification</h2>
        {loading ? (
          <p>Verifying your email...</p>
        ) : verified ? (
          <p className="success-text">Email verified! Redirecting...</p>
        ) : (
          <p className="error-text">Verification failed. Please try again.</p>
        )}
      </div>
    </div>
  )
}
