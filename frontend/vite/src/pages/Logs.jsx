import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import Navbar from "../components/Navbar"
import LogForm from "../components/LogForm"
import LogList from "../components/LogList"
import "../styles/Logs.css"

export default function Logs() {
  const [logs, setLogs] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [filterTopic, setFilterTopic] = useState("")
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("/api/logs", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setLogs(response.data)
    } catch (error) {
      toast.error("Error fetching logs")
    } finally {
      setLoading(false)
    }
  }

  const handleAddLog = async (logData) => {
    try {
      const token = localStorage.getItem("token")
      await axios.post("/api/logs", logData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success("Log added successfully!")
      setShowForm(false)
      fetchLogs()
    } catch (error) {
      toast.error("Error adding log")
    }
  }

  const filteredLogs = logs
    .filter((log) => !filterTopic || log.topic.toLowerCase().includes(filterTopic.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt)
      if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt)
      if (sortBy === "duration") return b.duration - a.duration
      return 0
    })

  return (
    <div className="logs-page">
      <Navbar />
      <div className="logs-content">
        <div className="logs-header">
          <h1>Learning Logs</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? "Cancel" : "+ Add Log"}
          </button>
        </div>

        {showForm && <LogForm onSubmit={handleAddLog} />}

        <div className="logs-controls">
          <input
            type="text"
            placeholder="Filter by topic..."
            value={filterTopic}
            onChange={(e) => setFilterTopic(e.target.value)}
            className="filter-input"
          />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="duration">Longest Duration</option>
          </select>
        </div>

        {loading ? <p>Loading logs...</p> : <LogList logs={filteredLogs} onRefresh={fetchLogs} />}
      </div>
    </div>
  )
}
