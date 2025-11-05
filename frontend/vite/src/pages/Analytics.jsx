import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import Navbar from "../components/Navbar"
import AnalyticsCharts from "../components/AnalyticsCharts"
import StreakCalendar from "../components/StreakCalendar"
import "../styles/Analytics.css"

export default function Analytics() {
  const [analyticsData, setAnalyticsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("month")

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token")
      const logsRes = await axios.get("/api/logs", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const skillsRes = await axios.get("/api/skills", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const goalsRes = await axios.get("/api/goals", {
        headers: { Authorization: `Bearer ${token}` },
      })

      const logs = logsRes.data
      const skills = skillsRes.data
      const goals = goalsRes.data

      // Calculate analytics
      const totalHours = logs.reduce((sum, log) => sum + log.duration, 0) / 60
      const avgSessionDuration = logs.length > 0 ? totalHours / logs.length : 0

      // Group by topic
      const topicData = {}
      logs.forEach((log) => {
        topicData[log.topic] = (topicData[log.topic] || 0) + log.duration / 60
      })

      // Group by mood
      const moodData = { happy: 0, neutral: 0, sad: 0 }
      logs.forEach((log) => {
        moodData[log.mood]++
      })

      // Daily activity
      const dailyActivity = {}
      logs.forEach((log) => {
        const date = new Date(log.createdAt).toLocaleDateString()
        dailyActivity[date] = (dailyActivity[date] || 0) + 1
      })

      // Completed goals
      const completedGoals = goals.filter((g) => g.status === "completed").length

      setAnalyticsData({
        totalHours: totalHours.toFixed(1),
        avgSessionDuration: avgSessionDuration.toFixed(1),
        totalLogs: logs.length,
        totalSkills: skills.length,
        completedGoals,
        topicData,
        moodData,
        dailyActivity,
        logs,
        skills,
      })
    } catch (error) {
      toast.error("Error fetching analytics")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="analytics-page">
      <Navbar />
      <div className="analytics-content">
        <div className="analytics-header">
          <h1>Analytics & Progress</h1>
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="time-range-select">
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>

        {loading ? (
          <p>Loading analytics...</p>
        ) : analyticsData ? (
          <>
            <div className="stats-overview">
              <div className="overview-card">
                <h3>Total Learning Hours</h3>
                <p className="big-number">{analyticsData.totalHours}</p>
              </div>
              <div className="overview-card">
                <h3>Average Session</h3>
                <p className="big-number">{analyticsData.avgSessionDuration}h</p>
              </div>
              <div className="overview-card">
                <h3>Total Logs</h3>
                <p className="big-number">{analyticsData.totalLogs}</p>
              </div>
              <div className="overview-card">
                <h3>Skills Tracked</h3>
                <p className="big-number">{analyticsData.totalSkills}</p>
              </div>
              <div className="overview-card">
                <h3>Goals Completed</h3>
                <p className="big-number">{analyticsData.completedGoals}</p>
              </div>
            </div>

            <AnalyticsCharts data={analyticsData} />

            <StreakCalendar logs={analyticsData.logs} />
          </>
        ) : (
          <p>No data available</p>
        )}
      </div>
    </div>
  )
}
