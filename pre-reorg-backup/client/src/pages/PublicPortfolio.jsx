"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import "../styles/PublicPortfolio.css"

export default function PublicPortfolio() {
  const { shareToken } = useParams()
  const [portfolioData, setPortfolioData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPublicPortfolio()
  }, [shareToken])

  const fetchPublicPortfolio = async () => {
    try {
      const response = await axios.get(`/api/portfolio/public/${shareToken}`)
      setPortfolioData(response.data)
    } catch (error) {
      console.error("Error fetching portfolio")
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="public-portfolio">Loading...</div>

  if (!portfolioData) return <div className="public-portfolio">Portfolio not found</div>

  const { portfolio, user, skills, totalLearningHours, totalLogs } = portfolioData

  return (
    <div className="public-portfolio">
      <div className="portfolio-container">
        <div className="portfolio-header">
          <h1>{user.name}</h1>
          <p className="subtitle">{portfolio.title}</p>
        </div>

        {portfolio.bio && (
          <div className="portfolio-section">
            <h2>About</h2>
            <p>{portfolio.bio}</p>
          </div>
        )}

        <div className="portfolio-section">
          <h2>Learning Journey</h2>
          <div className="journey-stats">
            <div className="stat">
              <span className="stat-value">{totalLearningHours.toFixed(1)}</span>
              <span className="stat-label">Learning Hours</span>
            </div>
            <div className="stat">
              <span className="stat-value">{totalLogs}</span>
              <span className="stat-label">Learning Logs</span>
            </div>
            <div className="stat">
              <span className="stat-value">{skills.length}</span>
              <span className="stat-label">Skills</span>
            </div>
          </div>
        </div>

        {skills.length > 0 && (
          <div className="portfolio-section">
            <h2>Skills</h2>
            <div className="skills-grid">
              {skills.map((skill) => (
                <div key={skill._id} className="skill-card">
                  <h3>{skill.name}</h3>
                  <p className="category">{skill.category}</p>
                  <div className="rating">{"★".repeat(skill.selfRating)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {portfolio.certifications && portfolio.certifications.length > 0 && (
          <div className="portfolio-section">
            <h2>Certifications</h2>
            <div className="certifications-list">
              {portfolio.certifications.map((cert, idx) => (
                <div key={idx} className="cert-item">
                  <h3>{cert.name}</h3>
                  <p>{cert.issuer}</p>
                  {cert.date && <p className="date">{new Date(cert.date).toLocaleDateString()}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
