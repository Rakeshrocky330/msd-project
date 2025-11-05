"use client"

import { useState } from "react"
import "../styles/SkillForm.css"

export default function SkillForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "General",
    selfRating: 1,
    hoursSpent: 0,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({
      name: "",
      category: "General",
      selfRating: 1,
      hoursSpent: 0,
    })
  }

  return (
    <form className="skill-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Skill Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Category</label>
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="General">General</option>
            <option value="Programming">Programming</option>
            <option value="Design">Design</option>
            <option value="Data Science">Data Science</option>
            <option value="DevOps">DevOps</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Self Rating (1-5)</label>
          <input type="range" name="selfRating" min="1" max="5" value={formData.selfRating} onChange={handleChange} />
          <span className="rating-value">{formData.selfRating}/5</span>
        </div>
      </div>

      <div className="form-group">
        <label>Hours Spent</label>
        <input type="number" name="hoursSpent" value={formData.hoursSpent} onChange={handleChange} min="0" />
      </div>

      <button type="submit" className="btn-submit">
        Add Skill
      </button>
    </form>
  )
}
