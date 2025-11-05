"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Navbar from "../components/Navbar"
import "../styles/Profile.css"

export default function Profile() {
  const [user, setUser] = useState(null)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUser(response.data)
      setFormData(response.data)
    } catch (error) {
      console.error("Error fetching profile:", error)
    }
  }

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token")
      await axios.put("/api/user/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUser(formData)
      setEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
    }
  }

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-content">
        <h1>Profile</h1>
        {user && (
          <div className="profile-card">
            <div className="profile-info">
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Role:</strong> {user.role}
              </p>
              <p>
                <strong>Total Hours:</strong> {user.totalLearningHours}
              </p>
            </div>
            {editing ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Name"
                />
                <button onClick={handleUpdate}>Save</button>
                <button onClick={() => setEditing(false)}>Cancel</button>
              </div>
            ) : (
              <button onClick={() => setEditing(true)}>Edit Profile</button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
