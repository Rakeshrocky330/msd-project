"use client"

import { useState } from "react"
import "../styles/GoalForm.css"

export default function GoalForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    targetDate: "",
    progress: 0,
    milestones: [],
  })
  const [milestoneInput, setMilestoneInput] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleAddMilestone = () => {
    if (milestoneInput.trim()) {
      setFormData({
        ...formData,
        milestones: [...formData.milestones, { title: milestoneInput, completed: false, date: null }],
      })
      setMilestoneInput("")
    }
  }

  const handleRemoveMilestone = (index) => {
    setFormData({
      ...formData,
      milestones: formData.milestones.filter((_, i) => i !== index),
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      targetDate: "",
      progress: 0,
      milestones: [],
    })
  }

  return (
    <form className="goal-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Goal Title</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} rows="4"></textarea>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Priority</label>
          <select name="priority" value={formData.priority} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="form-group">
          <label>Target Date</label>
          <input type="date" name="targetDate" value={formData.targetDate} onChange={handleChange} required />
        </div>
      </div>

      <div className="form-group">
        <label>Progress (%)</label>
        <input type="range" name="progress" min="0" max="100" value={formData.progress} onChange={handleChange} />
        <span className="progress-value">{formData.progress}%</span>
      </div>

      <div className="form-group">
        <label>Milestones</label>
        <div className="milestone-input">
          <input
            type="text"
            value={milestoneInput}
            onChange={(e) => setMilestoneInput(e.target.value)}
            placeholder="Add milestone"
          />
          <button type="button" onClick={handleAddMilestone}>
            Add
          </button>
        </div>
        <div className="milestones-list">
          {formData.milestones.map((milestone, idx) => (
            <div key={idx} className="milestone-item">
              <span>{milestone.title}</span>
              <button type="button" onClick={() => handleRemoveMilestone(idx)}>
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <button type="submit" className="btn-submit">
        Create Goal
      </button>
    </form>
  )
}
