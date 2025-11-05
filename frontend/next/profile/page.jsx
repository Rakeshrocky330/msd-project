"use client"

import { useProtectedRoute } from "@/app/hooks/useProtectedRoute"
import { Sidebar } from "@/app/components/Sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useAuth } from "@/app/context/AuthContext"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const { user, loading } = useProtectedRoute()
  const { token, logout } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [loading2, setLoading2] = useState(false)

  const handleSaveProfile = async () => {
    setLoading2(true)
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      })

      if (res.ok) {
        setIsEditing(false)
      }
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setLoading2(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        const res = await fetch("/api/auth/profile", {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        })

        if (res.ok) {
          logout()
          router.push("/")
        }
      } catch (error) {
        console.error("Error deleting account:", error)
      }
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
            <h1 className="text-4xl font-bold text-foreground">Profile Settings</h1>
            <p className="text-muted-foreground">Manage your account information</p>
          </div>
          <Button onClick={() => setIsEditing(!isEditing)} size="lg">
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-8">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled />
                  </div>

                  <Button onClick={handleSaveProfile} className="w-full" disabled={loading2}>
                    {loading2 ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                    <p className="text-lg font-semibold">{user?.name}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <p className="text-lg font-semibold">{user?.email}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Account Role</p>
                    <p className="text-lg font-semibold capitalize">{user?.role || "User"}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Member Since</p>
                    <p className="text-lg font-semibold">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5">
              <h3 className="font-bold mb-3">Account Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-semibold text-green-600">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Verified</span>
                  <span className="font-semibold text-green-600">Yes</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-destructive/20 bg-destructive/5">
              <h3 className="font-bold mb-3 text-destructive">Danger Zone</h3>
              <Button variant="destructive" className="w-full" onClick={handleDeleteAccount}>
                Delete Account
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
