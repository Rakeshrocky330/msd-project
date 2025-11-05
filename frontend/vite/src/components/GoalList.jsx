"use client"

import { useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import "../styles/GoalList.css"

export default function GoalList({ goals, onRefresh }) {
  const [expandedId, setExpandedId] = useState(null)

  const handleUpdateProgress = async (goalId, newProgress) => {
    try {
      const token = localStorage.getItem("token")
      await axios.put(
        `/api/goals/${goalId}`,
        { progress: newProgress },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      onRefresh()
    } catch (error) {
      toast.error("Failed to update progress")
    }
  }

  const handleUpdateStatus = async (goalId, newStatus) => {
    try {
      const token = localStorage.getItem("token")
      await axios.put(
        `/api/goals/${goalId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      onRefresh()
    } catch (error) {
      toast.error("Failed to update status")
    }
  }

  const handleDelete = async (goalId) => {
    if (window.confirm("Delete this goal?")) {
      try {
        const token = localStorage.getItem("token")
        await axios.delete(`/api/goals/${goalId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        toast.success("Goal deleted")
        onRefresh()
      } catch (error) {
        toast.error("Failed to delete goal")
      }
    }
  }

  return (
    <div className="goal-list">
      {goals.length === 0 ? (
        <p className="empty-state">No goals yet. Create your first goal to get started!</p>
      ) : (
        goals.map((goal) => (
          <div key={goal._id} className={`goal-card priority-${goal.priority}`}>
            <div className="goal-header" onClick={() => setExpandedId(expandedId === goal._id ? null : goal._id)}>
              <div className="goal-title-section">
                <h3>{goal.title}</h3>
                <span className={`priority-badge priority-${goal.priority}`}>{goal.priority}</span>
              </div>
              <span className="expand-icon">{expandedId === goal._id ? "−" : "+"}</span>
            </div>

            <div className="progress-section">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${goal.progress}%` }}></div>
              </div>
              <span className="progress-text">{goal.progress}%</span>
            </div>

            {expandedId === goal._id && (
              <div className="goal-details">
                <p className="description">{goal.description}</p>

                <div className="goal-meta">
                  <p>
                    <strong>Target Date:</strong> {new Date(goal.targetDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Status:</strong> {goal.status}
                  </p>
                </div>

                {goal.milestones && goal.milestones.length > 0 && (
                  <div className="milestones-section">
                    <h4>Milestones</h4>
                    <div className="milestones">
                      {goal.milestones.map((milestone, idx) => (
                        <div key={idx} className={`milestone ${milestone.completed ? "completed" : ""}`}>
                          <input type="checkbox" checked={milestone.completed} readOnly />
                          <span>{milestone.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="goal-actions">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={goal.progress}
                    onChange={(e) => handleUpdateProgress(goal._id, Number.parseInt(e.target.value))}
                    className="progress-slider"
                  />

                  <select
                    value={goal.status}
                    onChange={(e) => handleUpdateStatus(goal._id, e.target.value)}
                    className="status-select"
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="archived">Archived</option>
                  </select>

                  <button onClick={() => handleDelete(goal._id)} className="btn-delete">
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}
