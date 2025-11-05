"use client"

import { useState } from "react"
import "../styles/PortfolioEditor.css"

export default function PortfolioEditor({ portfolio, onSave }) {
  const [formData, setFormData] = useState(portfolio || {})
  const [certInput, setCertInput] = useState({ name: "", issuer: "", date: "", url: "" })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleAddCertification = () => {
    if (certInput.name && certInput.issuer) {
      setFormData({
        ...formData,
        certifications: [...(formData.certifications || []), certInput],
      })
      setCertInput({ name: "", issuer: "", date: "", url: "" })
    }
  }

  const handleRemoveCertification = (index) => {
    setFormData({
      ...formData,
      certifications: formData.certifications.filter((_, i) => i !== index),
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form className="portfolio-editor" onSubmit={handleSubmit}>
      <div className="form-section">
        <h3>Portfolio Information</h3>

        <div className="form-group">
          <label>Portfolio Title</label>
          <input type="text" name="title" value={formData.title || ""} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Bio</label>
          <textarea name="bio" value={formData.bio || ""} onChange={handleChange} rows="5"></textarea>
        </div>
      </div>

      <div className="form-section">
        <h3>Certifications</h3>

        <div className="cert-input-group">
          <input
            type="text"
            placeholder="Certification Name"
            value={certInput.name}
            onChange={(e) => setCertInput({ ...certInput, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Issuer"
            value={certInput.issuer}
            onChange={(e) => setCertInput({ ...certInput, issuer: e.target.value })}
          />
          <input
            type="date"
            value={certInput.date}
            onChange={(e) => setCertInput({ ...certInput, date: e.target.value })}
          />
          <input
            type="url"
            placeholder="Certificate URL"
            value={certInput.url}
            onChange={(e) => setCertInput({ ...certInput, url: e.target.value })}
          />
          <button type="button" onClick={handleAddCertification}>
            Add
          </button>
        </div>

        <div className="certifications-list">
          {formData.certifications?.map((cert, idx) => (
            <div key={idx} className="cert-item">
              <div>
                <strong>{cert.name}</strong>
                <p>{cert.issuer}</p>
              </div>
              <button type="button" onClick={() => handleRemoveCertification(idx)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <button type="submit" className="btn-save">
        Save Portfolio
      </button>
    </form>
  )
}
