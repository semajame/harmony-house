"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function ResetPassword() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const router = useRouter()

  const [newPassword, setNewPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!token) {
      setError("Invalid or missing reset token")
      return
    }

    setIsLoading(true)
    setError("")
    setMessage("")

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: newPassword }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage(data.message || "Password reset successfully!")
        setTimeout(() => router.push("/login"), 2000) // redirect to login
      } else {
        setError(data.message || "Something went wrong")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Reset Password</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-green-600 text-sm text-center">{message}</p>
        )}
        {error && (
          <p className="mt-4 text-red-600 text-sm text-center">{error}</p>
        )}
      </div>
    </div>
  )
}
