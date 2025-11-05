"use client"

import { useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import "../styles/LogList.css"

export default function LogList({ logs, onRefresh }) {
  const [editingId, setEditingId] = useState(null)
  const [expandedId, setExpandedId] = useState(null)

  const handleDelete = async (logId) => {
    if (window.confirm("Are you sure you want to delete this log?")) {
      try {
        const token = localStorage.getItem("token")
        await axios.delete(`/api/logs/${logId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        toast.success("Log deleted successfully")
        onRefresh()
      } catch (error) {
        toast.error("Failed to delete log")
      }
    }
  }

  const handleToggleComplete = async (log) => {
    try {
      const token = localStorage.getItem("token")
      await axios.put(
        `/api/logs/${log._id}`,
        { isCompleted: !log.isCompleted },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      onRefresh()
    } catch (error) {
      toast.error("Failed to update log")
    }
  }

  return (
    <div className="log-list">
      {logs.length === 0 ? (
        <p className="empty-state">No logs yet. Start by adding your first learning log!</p>
      ) : (
        logs.map((log) => (
          <div key={log._id} className={`log-item ${log.isCompleted ? "completed" : ""}`}>
            <div className="log-header">
              <div className="log-title-section">
                <input
                  type="checkbox"
                  checked={log.isCompleted}
                  onChange={() => handleToggleComplete(log)}
                  className="log-checkbox"
                />
                <h3 onClick={() => setExpandedId(expandedId === log._id ? null : log._id)}>{log.title}</h3>
              </div>
              <div className="log-actions">
                <button onClick={() => setEditingId(log._id)} className="btn-edit">
                  Edit
                </button>
                <button onClick={() => handleDelete(log._id)} className="btn-delete">
                  Delete
                </button>
              </div>
            </div>

            {expandedId === log._id && (
              <div className="log-details">
                <p className="description">{log.description}</p>
                <div className="log-meta">
                  <span className="topic">{log.topic}</span>
                  <span className="duration">{log.duration} min</span>
                  <span className={`mood mood-${log.mood}`}>{log.mood}</span>
                </div>

                {log.tags.length > 0 && (
                  <div className="log-tags">
                    {log.tags.map((tag, idx) => (
                      <span key={idx} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {log.urls.length > 0 && (
                  <div className="log-urls">
                    <h4>Resources:</h4>
                    {log.urls.map((url, idx) => (
                      <a key={idx} href={url} target="_blank" rel="noopener noreferrer">
                        {url}
                      </a>
                    ))}
                  </div>
                )}

                {log.aiSummary && (
                  <div className="ai-summary">
                    <h4>AI Summary:</h4>
                    <p>{log.aiSummary}</p>
                  </div>
                )}

                <p className="log-date">{new Date(log.createdAt).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}
