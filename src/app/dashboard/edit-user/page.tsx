"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

import { useRouter } from "next/navigation"

// inside your component

export default function EditUser() {
  const { data: session, status } = useSession()
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    role: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Load session data into form
  useEffect(() => {
    if (session) {
      setFormData((prev) => ({
        ...prev,
        name: session.user.name || "",
        username: session.user.username || "",
        email: session.user.email || "",
        phone: session.user.phone || "",
        role: session.user.role || "",
      }))
    }
  }, [session])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user.id) return

    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      alert("Passwords do not match")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/users/${session.user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error("Failed to update user")

      alert("Profile updated successfully!")
      router.push("/dashboard") // 👈 reroute to dashboard
    } catch (err) {
      console.error(err)
      alert("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") return <p>Loading...</p>
  if (!session) return <p>You must be logged in to edit your profile.</p>

  return (
    <div className="py-[10rem]">
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto p-4 space-y-4 border rounded-lg shadow"
      >
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        {/* Username */}
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        {/* Role (read-only for safety) */}
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Input id="role" name="role" value={formData.role} disabled />
        </div>
        {/* Current Password */}
        <div className="space-y-2">
          <Label htmlFor="currentPassword">Current Password</Label>
          <Input
            id="currentPassword"
            name="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={handleChange}
          />
        </div>
        {/* New Password */}
        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
          />
        </div>
        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  )
}
