"use client"

import Link from "next/link"
import { useAuth } from "@/app/context/AuthContext"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function Sidebar() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen p-6 flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary">CareerTracker</h2>
        <p className="text-sm text-muted-foreground">AI-Powered Growth</p>
      </div>

      <nav className="flex-1 space-y-2">
        <Link href="/dashboard">
          <div className="px-4 py-2 rounded-lg hover:bg-primary/10 cursor-pointer transition">Dashboard</div>
        </Link>
        <Link href="/logs">
          <div className="px-4 py-2 rounded-lg hover:bg-primary/10 cursor-pointer transition">Learning Logs</div>
        </Link>
        <Link href="/goals">
          <div className="px-4 py-2 rounded-lg hover:bg-primary/10 cursor-pointer transition">Goals</div>
        </Link>
        <Link href="/skills">
          <div className="px-4 py-2 rounded-lg hover:bg-primary/10 cursor-pointer transition">Skills</div>
        </Link>
        <Link href="/analytics">
          <div className="px-4 py-2 rounded-lg hover:bg-primary/10 cursor-pointer transition">Analytics</div>
        </Link>
        <Link href="/portfolio">
          <div className="px-4 py-2 rounded-lg hover:bg-primary/10 cursor-pointer transition">Portfolio</div>
        </Link>
        <Link href="/profile">
          <div className="px-4 py-2 rounded-lg hover:bg-primary/10 cursor-pointer transition">Profile</div>
        </Link>
      </nav>

      <div className="border-t border-border pt-4">
        <div className="mb-4 p-3 bg-primary/10 rounded-lg">
          <p className="text-sm font-medium">{user?.name}</p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
        </div>
        <Button onClick={handleLogout} variant="outline" className="w-full bg-transparent">
          Logout
        </Button>
      </div>
    </aside>
  )
}
