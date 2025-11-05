import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import Navbar from "../components/Navbar"
import GoalForm from "../components/GoalForm"
import GoalList from "../components/GoalList"
import "../styles/Goals.css"

export default function Goals() {
  const [goals, setGoals] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState("active")

  useEffect(() => {
    fetchGoals()
  }, [])

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("/api/goals", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setGoals(response.data)
    } catch (error) {
      toast.error("Error fetching goals")
    } finally {
      setLoading(false)
    }
  }

  const handleAddGoal = async (goalData) => {
    try {
      const token = localStorage.getItem("token")
      await axios.post("/api/goals", goalData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success("Goal created successfully!")
      setShowForm(false)
      fetchGoals()
    } catch (error) {
      toast.error("Error creating goal")
    }
  }

  const filteredGoals = goals.filter((goal) => goal.status === filterStatus)

  return (
    <div className="goals-page">
      <Navbar />
      <div className="goals-content">
        <div className="goals-header">
          <h1>Goals & Milestones</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? "Cancel" : "+ New Goal"}
          </button>
        </div>

        {showForm && <GoalForm onSubmit={handleAddGoal} />}

        <div className="goals-filters">
          <button
            className={`filter-btn ${filterStatus === "active" ? "active" : ""}`}
            onClick={() => setFilterStatus("active")}
          >
            Active
          </button>
          <button
            className={`filter-btn ${filterStatus === "completed" ? "active" : ""}`}
            onClick={() => setFilterStatus("completed")}
          >
            Completed
          </button>
          <button
            className={`filter-btn ${filterStatus === "archived" ? "active" : ""}`}
            onClick={() => setFilterStatus("archived")}
          >
            Archived
          </button>
        </div>

        {loading ? <p>Loading goals...</p> : <GoalList goals={filteredGoals} onRefresh={fetchGoals} />}
      </div>
    </div>
  )
}
