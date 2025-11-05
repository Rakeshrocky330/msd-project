"use client"

import { useProtectedRoute } from "@/app/hooks/useProtectedRoute"
import { Sidebar } from "@/app/components/Sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { useAuth } from "@/app/context/AuthContext"

export default function GoalsPage() {
  const { user, loading } = useProtectedRoute()
  const { token } = useAuth()
  const [goals, setGoals] = useState([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [priority, setPriority] = useState("medium")
  const [targetDate, setTargetDate] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [loading2, setLoading2] = useState(false)

  useEffect(() => {
    if (token) {
      fetchGoals()
      // Real-time refresh every 30 seconds
      const interval = setInterval(fetchGoals, 30000)
      return () => clearInterval(interval)
    }
  }, [token])

  const fetchGoals = async () => {
    try {
      const res = await fetch("/api/goals", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setGoals(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
    } catch (error) {
      console.error("Error fetching goals:", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading2(true)

    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          category,
          priority,
          targetDate,
        }),
      })

      if (res.ok) {
        setTitle("")
        setDescription("")
        setCategory("")
        setPriority("medium")
        setTargetDate("")
        setShowForm(false)
        fetchGoals()
      }
    } catch (error) {
      console.error("Error creating goal:", error)
    } finally {
      setLoading2(false)
    }
  }

  const updateGoalStatus = async (goalId, newStatus) => {
    try {
      const res = await fetch(`/api/goals/${goalId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (res.ok) {
        fetchGoals()
      }
    } catch (error) {
      console.error("Error updating goal:", error)
    }
  }

  const updateGoalProgress = async (goalId, newProgress) => {
    try {
      const res = await fetch(`/api/goals/${goalId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ progress: newProgress }),
      })

      if (res.ok) {
        fetchGoals()
      }
    } catch (error) {
      console.error("Error updating progress:", error)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const activeGoals = goals.filter((g) => g.status === "active")
  const completedGoals = goals.filter((g) => g.status === "completed")
  const archivedGoals = goals.filter((g) => g.status === "archived")

  const priorityColors = {
    high: "bg-destructive/10 text-destructive",
    medium: "bg-primary/10 text-primary",
    low: "bg-secondary/10 text-secondary-foreground",
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 bg-gradient-to-br from-background to-secondary/5">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Career Goals</h1>
            <p className="text-muted-foreground">Set and track your career objectives</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} size="lg">
            {showForm ? "Cancel" : "New Goal"}
          </Button>
        </div>

        {showForm && (
          <Card className="p-6 mb-8 border-2 border-primary/20">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Goal Title</label>
                <Input
                  type="text"
                  placeholder="e.g., Learn React Advanced Patterns"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:border-primary focus:outline-none"
                  rows="4"
                  placeholder="Describe your goal..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <Input
                    type="text"
                    placeholder="e.g., Technical"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Priority</label>
                  <select
                    className="w-full p-2 border border-border rounded-lg bg-background text-foreground focus:border-primary focus:outline-none"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Target Date</label>
                  <Input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading2}>
                {loading2 ? "Creating..." : "Create Goal"}
              </Button>
            </form>
          </Card>
        )}

        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Active Goals ({activeGoals.length})</h2>
            <div className="space-y-4">
              {activeGoals.length > 0 ? (
                activeGoals.map((goal) => (
                  <Card key={goal._id} className="p-6 hover:shadow-lg transition">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold">{goal.title}</h3>
                        <p className="text-sm text-muted-foreground">{goal.description}</p>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full ${priorityColors[goal.priority]}`}>
                        {goal.priority}
                      </span>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span className="font-semibold">{goal.progress || 0}%</span>
                      </div>
                      <div className="w-full bg-border rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-primary to-primary/70 h-3 rounded-full transition-all"
                          style={{ width: `${goal.progress || 0}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 mb-3">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={goal.progress || 0}
                        onChange={(e) => updateGoalProgress(goal._id, Number.parseInt(e.target.value))}
                        className="flex-1"
                      />
                    </div>

                    {goal.targetDate && (
                      <p className="text-xs text-muted-foreground mb-3">
                        Target: {new Date(goal.targetDate).toLocaleDateString()}
                      </p>
                    )}

                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => updateGoalStatus(goal._id, "completed")}>
                        Mark Complete
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => updateGoalStatus(goal._id, "archived")}>
                        Archive
                      </Button>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No active goals. Create one to get started!</p>
                </Card>
              )}
            </div>
          </div>

          {completedGoals.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Completed Goals ({completedGoals.length})</h2>
              <div className="space-y-4">
                {completedGoals.map((goal) => (
                  <Card key={goal._id} className="p-6 opacity-75 bg-green-500/5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold line-through">{goal.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Completed on {new Date(goal.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-xs bg-green-500/20 text-green-600 px-3 py-1 rounded-full">Completed</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
