"use client"

import { useProtectedRoute } from "@/app/hooks/useProtectedRoute"
import { Sidebar } from "@/app/components/Sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { useAuth } from "@/app/context/AuthContext"

export default function PortfolioPage() {
  const { user, loading } = useProtectedRoute()
  const { token } = useAuth()
  const [portfolio, setPortfolio] = useState({
    headline: "",
    bio: "",
    socialLinks: {},
  })
  const [isEditing, setIsEditing] = useState(false)
  const [skills, setSkills] = useState([])
  const [goals, setGoals] = useState([])
  const [loading2, setLoading2] = useState(false)

  useEffect(() => {
    if (token) {
      fetchPortfolio()
      fetchSkills()
      fetchGoals()
      // Real-time refresh every 60 seconds
      const interval = setInterval(() => {
        fetchPortfolio()
        fetchSkills()
        fetchGoals()
      }, 60000)
      return () => clearInterval(interval)
    }
  }, [token])

  const fetchPortfolio = async () => {
    try {
      const res = await fetch("/api/portfolio", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setPortfolio(data)
      }
    } catch (error) {
      console.error("Error fetching portfolio:", error)
    }
  }

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

  const fetchGoals = async () => {
    try {
      const res = await fetch("/api/goals", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setGoals(data.filter((g) => g.status === "completed"))
    } catch (error) {
      console.error("Error fetching goals:", error)
    }
  }

  const handleSavePortfolio = async () => {
    setLoading2(true)
    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(portfolio),
      })

      if (res.ok) {
        setIsEditing(false)
        fetchPortfolio()
      }
    } catch (error) {
      console.error("Error saving portfolio:", error)
    } finally {
      setLoading2(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 bg-gradient-to-br from-background to-secondary/5">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Portfolio</h1>
            <p className="text-muted-foreground">Showcase your professional profile</p>
          </div>
          <Button onClick={() => setIsEditing(!isEditing)} size="lg">
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        </div>

        {isEditing ? (
          <Card className="p-6 mb-8 border-2 border-primary/20">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Headline</label>
                <Input
                  type="text"
                  placeholder="e.g., Full Stack Developer | AI Enthusiast"
                  value={portfolio.headline || ""}
                  onChange={(e) => setPortfolio({ ...portfolio, headline: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bio</label>
                <textarea
                  className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:border-primary focus:outline-none"
                  rows="6"
                  placeholder="Tell your professional story..."
                  value={portfolio.bio || ""}
                  onChange={(e) => setPortfolio({ ...portfolio, bio: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">GitHub</label>
                  <Input
                    type="url"
                    placeholder="https://github.com/username"
                    value={portfolio.socialLinks?.github || ""}
                    onChange={(e) =>
                      setPortfolio({
                        ...portfolio,
                        socialLinks: { ...portfolio.socialLinks, github: e.target.value },
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">LinkedIn</label>
                  <Input
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    value={portfolio.socialLinks?.linkedin || ""}
                    onChange={(e) =>
                      setPortfolio({
                        ...portfolio,
                        socialLinks: { ...portfolio.socialLinks, linkedin: e.target.value },
                      })
                    }
                  />
                </div>
              </div>

              <Button onClick={handleSavePortfolio} className="w-full" disabled={loading2}>
                {loading2 ? "Saving..." : "Save Portfolio"}
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="p-8 mb-8 bg-gradient-to-br from-primary/5 to-secondary/5">
            <h2 className="text-3xl font-bold mb-2">{user?.name}</h2>
            <p className="text-lg text-primary mb-4">{portfolio.headline || "Add your professional headline"}</p>
            <p className="text-muted-foreground mb-6">{portfolio.bio || "Add your professional bio"}</p>

            {portfolio.socialLinks && (
              <div className="flex gap-4">
                {portfolio.socialLinks.github && (
                  <a href={portfolio.socialLinks.github} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      GitHub
                    </Button>
                  </a>
                )}
                {portfolio.socialLinks.linkedin && (
                  <a href={portfolio.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      LinkedIn
                    </Button>
                  </a>
                )}
              </div>
            )}
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Top Skills</h2>
            <div className="grid grid-cols-2 gap-4">
              {skills.slice(0, 6).map((skill) => (
                <div key={skill._id} className="p-4 bg-primary/10 rounded-lg text-center hover:shadow-lg transition">
                  <p className="font-semibold text-sm">{skill.name}</p>
                  <div className="flex gap-1 justify-center mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div
                        key={star}
                        className={`w-3 h-3 rounded-full ${star <= skill.proficiency ? "bg-primary" : "bg-border"}`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Achievements</h2>
            <div className="space-y-3">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <p className="text-sm font-semibold">Goals Completed</p>
                <p className="text-2xl font-bold text-green-600">{goals.length}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <p className="text-sm font-semibold">Skills Mastered</p>
                <p className="text-2xl font-bold text-primary">{skills.filter((s) => s.proficiency >= 4).length}</p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
