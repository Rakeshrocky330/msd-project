"use client"

import { useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import "../styles/SkillList.css"

export default function SkillList({ skills, onRefresh }) {
  const [expandedId, setExpandedId] = useState(null)

  const handleUpdateRating = async (skillId, newRating) => {
    try {
      const token = localStorage.getItem("token")
      await axios.put(
        `/api/skills/${skillId}`,
        { selfRating: newRating },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      onRefresh()
    } catch (error) {
      toast.error("Failed to update rating")
    }
  }

  const handleDelete = async (skillId) => {
    if (window.confirm("Delete this skill?")) {
      try {
        const token = localStorage.getItem("token")
        await axios.delete(`/api/skills/${skillId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        toast.success("Skill deleted")
        onRefresh()
      } catch (error) {
        toast.error("Failed to delete skill")
      }
    }
  }

  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating)
  }

  return (
    <div className="skill-list">
      {skills.length === 0 ? (
        <p className="empty-state">No skills yet. Add your first skill to track your progress!</p>
      ) : (
        <div className="skills-grid">
          {skills.map((skill) => (
            <div
              key={skill._id}
              className="skill-card"
              onClick={() => setExpandedId(expandedId === skill._id ? null : skill._id)}
            >
              <div className="skill-header">
                <h3>{skill.name}</h3>
                <span className="category-badge">{skill.category}</span>
              </div>

              <div className="skill-rating">
                <span className="stars">{renderStars(skill.selfRating)}</span>
                <span className="rating-text">{skill.selfRating}/5</span>
              </div>

              <p className="hours">Hours: {skill.hoursSpent}h</p>

              {expandedId === skill._id && (
                <div className="skill-details">
                  <div className="rating-slider">
                    <label>Update Rating</label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={skill.selfRating}
                      onChange={(e) => handleUpdateRating(skill._id, Number.parseInt(e.target.value))}
                    />
                  </div>

                  {skill.aiRating && (
                    <div className="ai-rating">
                      <p>
                        <strong>AI Rating:</strong> {skill.aiRating}/5
                      </p>
                    </div>
                  )}

                  <p className="last-practiced">Last practiced: {new Date(skill.lastPracticed).toLocaleDateString()}</p>

                  <button onClick={() => handleDelete(skill._id)} className="btn-delete">
                    Delete Skill
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
