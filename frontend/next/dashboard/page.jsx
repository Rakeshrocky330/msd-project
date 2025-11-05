"use client"

import { useProtectedRoute } from "@/app/hooks/useProtectedRoute"
import { Sidebar } from "@/app/components/Sidebar"
import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { useAuth } from "@/app/context/AuthContext"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const { user, loading } = useProtectedRoute()
  const { token } = useAuth()
  const [stats, setStats] = useState({ logs: 0, goals: 0, skills: 0, streak: 0 })
  const [recentLogs, setRecentLogs] = useState([])
  const [recentGoals, setRecentGoals] = useState([])
  const [topSkills, setTopSkills] = useState([])
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (token) {
      fetchStats()
      // Real-time refresh every 30 seconds
      const interval = setInterval(fetchStats, 30000)
      return () => clearInterval(interval)
    }
  }, [token])

  const fetchStats = async () => {
    try {
      setRefreshing(true)
      const [logsRes, goalsRes, skillsRes] = await Promise.all([
        fetch("/api/logs", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/goals", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/skills", { headers: { Authorization: `Bearer ${token}` } }),
      ])

      const logs = await logsRes.json()
      const goals = await goalsRes.json()
      const skills = await skillsRes.json()

      // Calculate streak
      const today = new Date().toDateString()
      const lastLogDate = logs.length > 0 ? new Date(logs[0].createdAt).toDateString() : null
      const streak = lastLogDate === today ? 7 : 0

      setStats({
        logs: logs.length,
        goals: goals.filter((g) => g.status === "active").length,
        skills: skills.length,
        streak,
      })

      setRecentLogs(logs.slice(0, 3))
      setRecentGoals(goals.filter((g) => g.status === "active").slice(0, 3))
      setTopSkills(skills.sort((a, b) => b.proficiency - a.proficiency).slice(0, 5))
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setRefreshing(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 bg-gradient-to-br from-background to-secondary/5">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground">Here's your learning progress overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 hover:shadow-lg transition">
            <div className="text-sm text-muted-foreground mb-2">Learning Logs</div>
            <div className="text-4xl font-bold text-primary">{stats.logs}</div>
            <p className="text-xs text-muted-foreground mt-2">Total entries</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition">
            <div className="text-sm text-muted-foreground mb-2">Active Goals</div>
            <div className="text-4xl font-bold text-primary">{stats.goals}</div>
            <p className="text-xs text-muted-foreground mt-2">In progress</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition">
            <div className="text-sm text-muted-foreground mb-2">Skills Tracked</div>
            <div className="text-4xl font-bold text-primary">{stats.skills}</div>
            <p className="text-xs text-muted-foreground mt-2">Total skills</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition bg-gradient-to-br from-primary/10 to-primary/5">
            <div className="text-sm text-muted-foreground mb-2">Current Streak</div>
            <div className="text-4xl font-bold text-primary">{stats.streak}</div>
            <p className="text-xs text-muted-foreground mt-2">Days active</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Recent Learning Logs</h2>
                <Link href="/logs">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
              <div className="space-y-4">
                {recentLogs.length > 0 ? (
                  recentLogs.map((log) => (
                    <div key={log._id} className="p-4 border border-border rounded-lg hover:bg-card/50 transition">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{log.title}</h3>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded capitalize">
                          {log.mood}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{log.content.substring(0, 100)}...</p>
                      <div className="flex gap-2 flex-wrap">
                        {log.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-secondary/20 text-secondary-foreground px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(log.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No learning logs yet. Start documenting your journey!
                  </p>
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Active Goals</h2>
              <div className="space-y-3">
                {recentGoals.length > 0 ? (
                  recentGoals.map((goal) => (
                    <div key={goal._id} className="p-3 bg-primary/5 rounded-lg">
                      <p className="font-semibold text-sm mb-2">{goal.title}</p>
                      <div className="w-full bg-border rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${goal.progress || 0}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{goal.progress || 0}% complete</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No active goals</p>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Top Skills</h2>
              <div className="space-y-2">
                {topSkills.length > 0 ? (
                  topSkills.map((skill) => (
                    <div key={skill._id} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{skill.name}</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <div
                            key={star}
                            className={`w-3 h-3 rounded-full ${star <= skill.proficiency ? "bg-primary" : "bg-border"}`}
                          />
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No skills tracked yet</p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
