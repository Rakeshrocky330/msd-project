"use client"

import Link from "next/link"
import { useAuth } from "@/app/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary via-background to-secondary">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="text-2xl font-bold text-primary">CareerTracker AI</div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link href="/register">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </nav>

      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="max-w-2xl text-center">
          <h1 className="text-5xl font-bold mb-6 text-foreground">Track Your Career Growth with AI</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Document your learning journey, set goals, track skills, and get personalized AI insights to accelerate your
            career development.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 bg-card rounded-lg border border-border">
              <div className="text-3xl mb-3">📚</div>
              <h3 className="font-semibold mb-2">Learning Logs</h3>
              <p className="text-sm text-muted-foreground">
                Document daily learning with rich text, mood tracking, and AI summaries
              </p>
            </div>

            <div className="p-6 bg-card rounded-lg border border-border">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-semibold mb-2">Goal Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Set career goals, track progress, and celebrate milestones
              </p>
            </div>

            <div className="p-6 bg-card rounded-lg border border-border">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-semibold mb-2">AI Insights</h3>
              <p className="text-sm text-muted-foreground">
                Get personalized recommendations and analytics on your growth
              </p>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="px-8">
                Get Started Free
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="px-8 bg-transparent">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
