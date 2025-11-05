"use client"

import { useProtectedRoute } from "@/app/hooks/useProtectedRoute"
import { Sidebar } from "@/app/components/Sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { useAuth } from "@/app/context/AuthContext"

export default function SkillsPage() {
  const { user, loading } = useProtectedRoute()
  const { token } = useAuth()
  const [skills, setSkills] = useState([])
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [proficiency, setProficiency] = useState(3)
  const [showForm, setShowForm] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (token) {
      fetchSkills()
      // Real-time refresh every 30 seconds
      const interval = setInterval(fetchSkills, 30000)
      return () => clearInterval(interval)
    }
  }, [token])

  const fetchSkills = async () => {
    try {
      const res = await fetch("/api/skills", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setSkills(data.sort((a, b) => b.proficiency - a.proficiency))
    } catch (error) {
      console.error("Error fetching skills:", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading2(true)

    try {
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          category,
          proficiency: Number.parseInt(proficiency),
        }),
      })

      if (res.ok) {
        setName("")
        setCategory("")
        setProficiency(3)
        setShowForm(false)
        fetchSkills()
      }
    } catch (error) {
      console.error("Error creating skill:", error)
    } finally {
      setLoading2(false)
    }
  }

  const deleteSkill = async (skillId) => {
    try {
      const res = await fetch(`/api/skills/${skillId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        fetchSkills()
      }
    } catch (error) {
      console.error("Error deleting skill:", error)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const groupedSkills = skills.reduce((acc, skill) => {
    const cat = skill.category || "Uncategorized"
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(skill)
    return acc
  }, {})

  const filteredGroups = Object.entries(groupedSkills).reduce((acc, [cat, skillList]) => {
    const filtered = skillList.filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
    if (filtered.length > 0) {
      acc[cat] = filtered
    }
    return acc
  }, {})

  const proficiencyLabels = ["", "Beginner", "Elementary", "Intermediate", "Advanced", "Expert"]

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 bg-gradient-to-br from-background to-secondary/5">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Skills Tracker</h1>
            <p className="text-muted-foreground">Track and develop your professional skills</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} size="lg">
            {showForm ? "Cancel" : "Add Skill"}
          </Button>
        </div>

        {showForm && (
          <Card className="p-6 mb-8 border-2 border-primary/20">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Skill Name</label>
                <Input
                  type="text"
                  placeholder="e.g., React, Python, Leadership"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <Input
                    type="text"
                    placeholder="e.g., Technical, Soft Skills"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Proficiency Level</label>
                  <select
                    className="w-full p-2 border border-border rounded-lg bg-background text-foreground focus:border-primary focus:outline-none"
                    value={proficiency}
                    onChange={(e) => setProficiency(e.target.value)}
                  >
                    <option value="1">Beginner</option>
                    <option value="2">Elementary</option>
                    <option value="3">Intermediate</option>
                    <option value="4">Advanced</option>
                    <option value="5">Expert</option>
                  </select>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading2}>
                {loading2 ? "Adding..." : "Add Skill"}
              </Button>
            </form>
          </Card>
        )}

        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="space-y-8">
          {Object.entries(filteredGroups).length > 0 ? (
            Object.entries(filteredGroups).map(([category, categorySkills]) => (
              <div key={category}>
                <h2 className="text-2xl font-bold mb-4">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categorySkills.map((skill) => (
                    <Card key={skill._id} className="p-6 hover:shadow-lg transition">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-bold">{skill.name}</h3>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteSkill(skill._id)}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          ×
                        </Button>
                      </div>
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Proficiency</span>
                          <span className="font-semibold">{proficiencyLabels[skill.proficiency]}</span>
                        </div>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <div
                              key={star}
                              className={`w-6 h-6 rounded-full transition-all ${
                                star <= skill.proficiency ? "bg-primary" : "bg-border"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {skill.hoursSpent > 0 && (
                        <p className="text-sm text-muted-foreground">{skill.hoursSpent} hours practiced</p>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                {skills.length === 0 ? "No skills tracked yet. Add your first skill!" : "No skills match your search."}
              </p>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
