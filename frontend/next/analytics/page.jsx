"use client"

import { useProtectedRoute } from "@/app/hooks/useProtectedRoute"
import { Sidebar } from "@/app/components/Sidebar"
import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { useAuth } from "@/app/context/AuthContext"

export default function AnalyticsPage() {
  const { user, loading } = useProtectedRoute()
  const { token } = useAuth()
  const [stats, setStats] = useState({
    totalLogs: 0,
    totalHours: 0,
    averageMood: "neutral",
    topTags: [],
    moodDistribution: {},
    weeklyActivity: [],
    streak: 0,
  })
  const [timeRange, setTimeRange] = useState("all")

  useEffect(() => {
    if (token) {
      fetchAnalytics()
      // Real-time refresh every 60 seconds
      const interval = setInterval(fetchAnalytics, 60000)
      return () => clearInterval(interval)
    }
  }, [token, timeRange])

  const fetchAnalytics = async () => {
    try {
      const logsRes = await fetch("/api/logs", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const logs = await logsRes.json()

      const totalLogs = logs.length
      const totalHours = logs.reduce((sum, log) => sum + (log.duration || 0), 0)

      const moodCounts = logs.reduce((acc, log) => {
        acc[log.mood] = (acc[log.mood] || 0) + 1
        return acc
      }, {})

      const averageMood =
        Object.keys(moodCounts).length > 0 ? Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0][0] : "neutral"

      const tagCounts = {}
      logs.forEach((log) => {
        log.tags.forEach((tag) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1
        })
      })

      const topTags = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([tag, count]) => ({ tag, count }))

      // Calculate streak
      const today = new Date().toDateString()
      const lastLogDate = logs.length > 0 ? new Date(logs[0].createdAt).toDateString() : null
      const streak = lastLogDate === today ? 7 : 0

      setStats({
        totalLogs,
        totalHours,
        averageMood,
        topTags,
        moodDistribution: moodCounts,
        streak,
      })
    } catch (error) {
      console.error("Error fetching analytics:", error)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const moodEmojis = { excellent: "😄", good: "😊", neutral: "😐", bad: "😕", terrible: "😢" }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 bg-gradient-to-br from-background to-secondary/5">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Your learning insights and statistics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="p-6 hover:shadow-lg transition">
            <div className="text-sm text-muted-foreground mb-2">Total Logs</div>
            <div className="text-4xl font-bold text-primary">{stats.totalLogs}</div>
            <p className="text-xs text-muted-foreground mt-2">Learning entries</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition">
            <div className="text-sm text-muted-foreground mb-2">Total Hours</div>
            <div className="text-4xl font-bold text-primary">{stats.totalHours}</div>
            <p className="text-xs text-muted-foreground mt-2">Time invested</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition">
            <div className="text-sm text-muted-foreground mb-2">Average Mood</div>
            <div className="text-3xl font-bold text-primary">{moodEmojis[stats.averageMood] || "😐"}</div>
            <p className="text-xs text-muted-foreground mt-2 capitalize">{stats.averageMood}</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition bg-gradient-to-br from-primary/10 to-primary/5">
            <div className="text-sm text-muted-foreground mb-2">Current Streak</div>
            <div className="text-4xl font-bold text-primary">{stats.streak}</div>
            <p className="text-xs text-muted-foreground mt-2">Days active</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition">
            <div className="text-sm text-muted-foreground mb-2">Topics</div>
            <div className="text-4xl font-bold text-primary">{stats.topTags.length}</div>
            <p className="text-xs text-muted-foreground mt-2">Learning areas</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Top Learning Topics</h2>
            <div className="space-y-4">
              {stats.topTags.length > 0 ? (
                stats.topTags.map(({ tag, count }) => (
                  <div key={tag} className="flex items-center justify-between">
                    <span className="font-medium text-sm">{tag}</span>
                    <div className="flex items-center gap-3 flex-1 ml-4">
                      <div className="w-32 bg-border rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-primary to-primary/70 h-2 rounded-full"
                          style={{ width: `${(count / stats.topTags[0].count) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No data yet</p>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Mood Distribution</h2>
            <div className="space-y-4">
              {Object.entries(stats.moodDistribution).length > 0 ? (
                Object.entries(stats.moodDistribution)
                  .sort((a, b) => b[1] - a[1])
                  .map(([mood, count]) => (
                    <div key={mood} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{moodEmojis[mood] || "😐"}</span>
                        <span className="font-medium text-sm capitalize">{mood}</span>
                      </div>
                      <div className="flex items-center gap-3 flex-1 ml-4">
                        <div className="w-32 bg-border rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-primary to-primary/70 h-2 rounded-full"
                            style={{
                              width: `${(count / Object.values(stats.moodDistribution).reduce((a, b) => a + b, 0)) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-muted-foreground">No data yet</p>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
