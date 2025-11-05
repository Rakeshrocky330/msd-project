"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import "../styles/Auth.css"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post("/api/auth/forgot-password", { email })
      setSubmitted(true)
      toast.success("Password reset link sent to your email!")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reset link")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>AI Career Tracker</h1>
        <h2>Forgot Password</h2>

        {submitted ? (
          <div className="success-message">
            <p>Check your email for password reset instructions.</p>
            <Link to="/login" className="link-button">
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <p>
          <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  )
}
