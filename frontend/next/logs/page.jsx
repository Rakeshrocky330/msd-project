"use client"

import { useProtectedRoute } from "@/app/hooks/useProtectedRoute"
import { Sidebar } from "@/app/components/Sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { useAuth } from "@/app/context/AuthContext"

export default function LogsPage() {
  const { user, loading } = useProtectedRoute()
  const { token } = useAuth()
  const [logs, setLogs] = useState([])
  const [filteredLogs, setFilteredLogs] = useState([])
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState("")
  const [mood, setMood] = useState("neutral")
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMood, setSelectedMood] = useState("all")
  const [loading2, setLoading2] = useState(false)

  useEffect(() => {
    if (token) {
      fetchLogs()
      // Real-time refresh every 20 seconds
      const interval = setInterval(fetchLogs, 20000)
      return () => clearInterval(interval)
    }
  }, [token])

  useEffect(() => {
    let filtered = logs
    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.content.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }
    if (selectedMood !== "all") {
      filtered = filtered.filter((log) => log.mood === selectedMood)
    }
    setFilteredLogs(filtered)
  }, [logs, searchTerm, selectedMood])

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/logs", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setLogs(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
    } catch (error) {
      console.error("Error fetching logs:", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading2(true)

    try {
      const res = await fetch("/api/logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          mood,
        }),
      })

      if (res.ok) {
        setTitle("")
        setContent("")
        setTags("")
        setMood("neutral")
        setShowForm(false)
        fetchLogs()
      }
    } catch (error) {
      console.error("Error creating log:", error)
    } finally {
      setLoading2(false)
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Learning Logs</h1>
            <p className="text-muted-foreground">Document your daily learning journey</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} size="lg">
            {showForm ? "Cancel" : "New Log"}
          </Button>
        </div>

        {showForm && (
          <Card className="p-6 mb-8 border-2 border-primary/20">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  type="text"
                  placeholder="What did you learn today?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                <textarea
                  className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:border-primary focus:outline-none"
                  rows="6"
                  placeholder="Describe your learning experience..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                  <Input
                    type="text"
                    placeholder="react, javascript, web-dev"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Mood</label>
                  <select
                    className="w-full p-2 border border-border rounded-lg bg-background text-foreground focus:border-primary focus:outline-none"
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                  >
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="neutral">Neutral</option>
                    <option value="bad">Bad</option>
                    <option value="terrible">Terrible</option>
                  </select>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading2}>
                {loading2 ? "Saving..." : "Save Log"}
              </Button>
            </form>
          </Card>
        )}

        <div className="mb-6 space-y-4">
          <Input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedMood === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMood("all")}
            >
              All Moods
            </Button>
            {Object.entries(moodEmojis).map(([moodKey, emoji]) => (
              <Button
                key={moodKey}
                variant={selectedMood === moodKey ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedMood(moodKey)}
              >
                {emoji} {moodKey}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => (
              <Card key={log._id} className="p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold">{log.title}</h3>
                  <span className="text-2xl">{moodEmojis[log.mood] || "😐"}</span>
                </div>
                <p className="text-muted-foreground mb-3">{log.content}</p>
                <div className="flex gap-2 flex-wrap mb-3">
                  {log.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-secondary/20 text-secondary-foreground px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">{new Date(log.createdAt).toLocaleString()}</p>
              </Card>
            ))
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                {logs.length === 0 ? "No logs yet. Create your first learning log!" : "No logs match your filters."}
              </p>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
