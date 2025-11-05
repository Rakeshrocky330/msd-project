"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Navbar from "../components/Navbar"
import AIInsights from "../components/AIInsights"
import AICoach from "../components/AICoach"
import "../styles/Dashboard.css"

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalHours: 0,
    currentStreak: 0,
    logsThisWeek: 0,
    skillsCount: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token")
        const logsRes = await axios.get("/api/logs", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const skillsRes = await axios.get("/api/skills", {
          headers: { Authorization: `Bearer ${token}` },
        })

        setStats({
          totalHours: logsRes.data.reduce((sum, log) => sum + log.duration, 0) / 60,
          currentStreak: 5,
          logsThisWeek: logsRes.data.length,
          skillsCount: skillsRes.data.length,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="dashboard">
      <Navbar />
      <AICoach />
      <div className="dashboard-content">
        <h1>Dashboard</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Learning Hours</h3>
                <p className="stat-value">{stats.totalHours.toFixed(1)}</p>
              </div>
              <div className="stat-card">
                <h3>Current Streak</h3>
                <p className="stat-value">{stats.currentStreak}</p>
              </div>
              <div className="stat-card">
                <h3>Logs This Week</h3>
                <p className="stat-value">{stats.logsThisWeek}</p>
              </div>
              <div className="stat-card">
                <h3>Skills Tracked</h3>
                <p className="stat-value">{stats.skillsCount}</p>
              </div>
            </div>

            <div className="dashboard-insights">
              <AIInsights />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
