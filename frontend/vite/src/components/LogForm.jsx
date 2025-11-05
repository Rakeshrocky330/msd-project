import { useState, useRef } from "react"
import "../styles/LogForm.css"

export default function LogForm({ onSubmit, initialData = null }) {
  const [formData, setFormData] = useState(
    initialData || {
      title: "",
      description: "",
      topic: "",
      duration: 0,
      mood: "neutral",
      tags: [],
      urls: [],
      attachments: [],
    },
  )
  const [timerActive, setTimerActive] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const timerRef = useRef(null)
  const fileInputRef = useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleAddTag = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      const newTag = e.target.value.trim()
      if (newTag && !formData.tags.includes(newTag)) {
        setFormData({ ...formData, tags: [...formData.tags, newTag] })
        e.target.value = ""
      }
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setFormData({ ...formData, tags: formData.tags.filter((tag) => tag !== tagToRemove) })
  }

  const handleAddUrl = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      const newUrl = e.target.value.trim()
      if (newUrl && !formData.urls.includes(newUrl)) {
        setFormData({ ...formData, urls: [...formData.urls, newUrl] })
        e.target.value = ""
      }
    }
  }

  const handleRemoveUrl = (urlToRemove) => {
    setFormData({ ...formData, urls: formData.urls.filter((url) => url !== urlToRemove) })
  }

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        setFormData({
          ...formData,
          attachments: [...formData.attachments, { name: file.name, data: event.target.result }],
        })
      }
      reader.readAsDataURL(file)
    })
  }

  const handleRemoveAttachment = (index) => {
    setFormData({
      ...formData,
      attachments: formData.attachments.filter((_, i) => i !== index),
    })
  }

  const startTimer = () => {
    setTimerActive(true)
    timerRef.current = setInterval(() => {
      setTimerSeconds((prev) => prev + 1)
    }, 1000)
  }

  const stopTimer = () => {
    setTimerActive(false)
    clearInterval(timerRef.current)
    setFormData({ ...formData, duration: Math.floor(timerSeconds / 60) })
  }

  const resetTimer = () => {
    setTimerActive(false)
    clearInterval(timerRef.current)
    setTimerSeconds(0)
  }

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({
      title: "",
      description: "",
      topic: "",
      duration: 0,
      mood: "neutral",
      tags: [],
      urls: [],
      attachments: [],
    })
    resetTimer()
  }

  return (
    <form className="log-form" onSubmit={handleSubmit}>
      <div className="form-section">
        <h3>Basic Information</h3>
        <input
          type="text"
          name="title"
          placeholder="Log Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="What did you learn? (Markdown supported)"
          value={formData.description}
          onChange={handleChange}
          required
          rows="6"
        ></textarea>
        <input type="text" name="topic" placeholder="Topic" value={formData.topic} onChange={handleChange} required />
      </div>

      <div className="form-section">
        <h3>Duration & Mood</h3>
        <div className="timer-section">
          <div className="timer-display">{formatTime(timerSeconds)}</div>
          <div className="timer-buttons">
            <button type="button" onClick={startTimer} disabled={timerActive}>
              Start
            </button>
            <button type="button" onClick={stopTimer} disabled={!timerActive}>
              Stop
            </button>
            <button type="button" onClick={resetTimer}>
              Reset
            </button>
          </div>
        </div>
        <input
          type="number"
          name="duration"
          placeholder="Duration (minutes)"
          value={formData.duration}
          onChange={handleChange}
          required
        />
        <select name="mood" value={formData.mood} onChange={handleChange}>
          <option value="happy">Happy 😊</option>
          <option value="neutral">Neutral 😐</option>
          <option value="sad">Sad 😔</option>
        </select>
      </div>

      <div className="form-section">
        <h3>Tags</h3>
        <input type="text" placeholder="Add tag and press Enter" onKeyDown={handleAddTag} />
        <div className="tags-container">
          {formData.tags.map((tag, idx) => (
            <span key={idx} className="tag">
              {tag}
              <button type="button" onClick={() => handleRemoveTag(tag)}>
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="form-section">
        <h3>Resources & URLs</h3>
        <input type="text" placeholder="Add URL and press Enter" onKeyDown={handleAddUrl} />
        <div className="urls-container">
          {formData.urls.map((url, idx) => (
            <div key={idx} className="url-item">
              <a href={url} target="_blank" rel="noopener noreferrer">
                {url}
              </a>
              <button type="button" onClick={() => handleRemoveUrl(url)}>
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="form-section">
        <h3>Attachments</h3>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          multiple
          accept="image/*,.pdf,.doc,.docx"
          style={{ display: "none" }}
        />
        <button type="button" onClick={() => fileInputRef.current.click()} className="btn-upload">
          Upload Files
        </button>
        <div className="attachments-container">
          {formData.attachments.map((attachment, idx) => (
            <div key={idx} className="attachment-item">
              <span>{attachment.name}</span>
              <button type="button" onClick={() => handleRemoveAttachment(idx)}>
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <button type="submit" className="btn-submit">
        Save Log
      </button>
    </form>
  )
}
