import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import Navbar from "../components/Navbar"
import SkillForm from "../components/SkillForm"
import SkillList from "../components/SkillList"
import "../styles/Skills.css"

export default function Skills() {
  const [skills, setSkills] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("rating")

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("/api/skills", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setSkills(response.data)
    } catch (error) {
      toast.error("Error fetching skills")
    } finally {
      setLoading(false)
    }
  }

  const handleAddSkill = async (skillData) => {
    try {
      const token = localStorage.getItem("token")
      await axios.post("/api/skills", skillData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success("Skill added successfully!")
      setShowForm(false)
      fetchSkills()
    } catch (error) {
      toast.error("Error adding skill")
    }
  }

  const sortedSkills = [...skills].sort((a, b) => {
    if (sortBy === "rating") return b.selfRating - a.selfRating
    if (sortBy === "hours") return b.hoursSpent - a.hoursSpent
    if (sortBy === "name") return a.name.localeCompare(b.name)
    return 0
  })

  return (
    <div className="skills-page">
      <Navbar />
      <div className="skills-content">
        <div className="skills-header">
          <h1>Skills Tracker</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? "Cancel" : "+ Add Skill"}
          </button>
        </div>

        {showForm && <SkillForm onSubmit={handleAddSkill} />}

        <div className="skills-controls">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
            <option value="rating">Sort by Rating</option>
            <option value="hours">Sort by Hours</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>

        {loading ? <p>Loading skills...</p> : <SkillList skills={sortedSkills} onRefresh={fetchSkills} />}
      </div>
    </div>
  )
}
