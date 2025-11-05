import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import "../styles/AIInsights.css"

export default function AIInsights() {
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(true)
  const [prompt, setPrompt] = useState("")

  useEffect(() => {
    fetchInsights()
    fetchReflectionPrompt()
  }, [])

  const fetchInsights = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("/api/ai/weekly-report", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setInsights(response.data)
    } catch (error) {
      toast.error("Failed to fetch insights")
    } finally {
      setLoading(false)
    }
  }

  const fetchReflectionPrompt = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("/api/ai/reflection-prompt", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setPrompt(response.data.prompt)
    } catch (error) {
      console.error("Failed to fetch prompt")
    }
  }

  if (loading) return <div className="ai-insights">Loading insights...</div>

  return (
    <div className="ai-insights">
      <h3>AI Insights</h3>

      {insights && (
        <>
          <div className="insight-card">
            <h4>Weekly Summary</h4>
            <div className="insight-stats">
              <div className="stat">
                <span className="label">Total Logs</span>
                <span className="value">{insights.totalLogs}</span>
              </div>
              <div className="stat">
                <span className="label">Learning Hours</span>
                <span className="value">{insights.totalHours}h</span>
              </div>
              <div className="stat">
                <span className="label">Avg Session</span>
                <span className="value">{insights.averageSessionDuration}h</span>
              </div>
            </div>
          </div>

          {insights.topTopics.length > 0 && (
            <div className="insight-card">
              <h4>Top Topics</h4>
              <div className="topics-list">
                {insights.topTopics.map((topic, idx) => (
                  <div key={idx} className="topic-item">
                    <span>{topic.topic}</span>
                    <span className="count">{topic.count} logs</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {insights.topSkills.length > 0 && (
            <div className="insight-card">
              <h4>Top Skills</h4>
              <div className="skills-list">
                {insights.topSkills.map((skill, idx) => (
                  <div key={idx} className="skill-item">
                    <span>{skill.name}</span>
                    <span className="rating">{"★".repeat(skill.rating)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {prompt && (
            <div className="insight-card reflection">
              <h4>Daily Reflection</h4>
              <p className="reflection-prompt">{prompt}</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
