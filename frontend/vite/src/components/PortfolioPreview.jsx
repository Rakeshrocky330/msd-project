import { useEffect, useState } from "react"
import axios from "axios"
import "../styles/PortfolioPreview.css"

export default function PortfolioPreview({ portfolio }) {
  const [resumeData, setResumeData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResumeData()
  }, [])

  const fetchResumeData = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("/api/portfolio/resume-data", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setResumeData(response.data)
    } catch (error) {
      console.error("Error fetching resume data")
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <p>Loading portfolio preview...</p>

  return (
    <div id="portfolio-preview" className="portfolio-preview">
      <div className="preview-header">
        <h2>{resumeData?.name}</h2>
        <p className="email">{resumeData?.email}</p>
      </div>

      {resumeData?.bio && (
        <div className="preview-section">
          <h3>About</h3>
          <p>{resumeData.bio}</p>
        </div>
      )}

      <div className="preview-section">
        <h3>Learning Summary</h3>
        <div className="summary-stats">
          <div className="summary-stat">
            <span className="label">Total Learning Hours</span>
            <span className="value">{resumeData?.totalLearningHours}h</span>
          </div>
          <div className="summary-stat">
            <span className="label">Total Logs</span>
            <span className="value">{resumeData?.totalLogs}</span>
          </div>
        </div>
      </div>

      {resumeData?.skills && resumeData.skills.length > 0 && (
        <div className="preview-section">
          <h3>Skills</h3>
          <div className="skills-display">
            {resumeData.skills.map((skill, idx) => (
              <div key={idx} className="skill-badge">
                <span className="skill-name">{skill.name}</span>
                <span className="skill-rating">{"★".repeat(skill.rating)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {Object.keys(resumeData?.topTopics || {}).length > 0 && (
        <div className="preview-section">
          <h3>Top Learning Topics</h3>
          <div className="topics-display">
            {Object.entries(resumeData.topTopics)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 10)
              .map(([topic, count], idx) => (
                <div key={idx} className="topic-badge">
                  {topic} ({count})
                </div>
              ))}
          </div>
        </div>
      )}

      {portfolio?.certifications && portfolio.certifications.length > 0 && (
        <div className="preview-section">
          <h3>Certifications</h3>
          <div className="certifications-display">
            {portfolio.certifications.map((cert, idx) => (
              <div key={idx} className="cert-display">
                <strong>{cert.name}</strong>
                <p>{cert.issuer}</p>
                {cert.date && <p className="date">{new Date(cert.date).toLocaleDateString()}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
