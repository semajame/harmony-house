"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect } from "react"
import { CheckCircle, Star, Home } from "lucide-react"

export default function SuccessPage() {
  async function checkConflict() {
    try {
      const storedReservation = localStorage.getItem("reservation")
      if (!storedReservation) {
        console.warn("No reservation found in localStorage")
        return
      }

      const payload = JSON.parse(storedReservation)

      console.log("📦 Reservation payload:", payload)

      const response = await fetch("/api/admin/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      console.log("📥 API result:", result)

      if (!response.ok) {
        console.error("❌ API error:", result.error)
        alert(result.error || "Failed to confirm reservation.")
        return
      }

      // ✅ If successful, clear the localStorage reservation
      localStorage.removeItem("reservation")
      console.log("✅ Reservation submitted and localStorage cleared.")
    } catch (error) {
      console.error("⚠️ Error submitting reservation:", error)
      alert("An unexpected error occurred.")
    }
  }

  useEffect(() => {
    checkConflict()
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 px-4 py-[10rem]">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg w-full">
        {/* Success Icon with Animation */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
            <div className="relative bg-green-500 rounded-full p-4">
              <CheckCircle className="w-16 h-16 text-white" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Payment Successful!
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-green-400 to-emerald-500 mx-auto rounded-full"></div>
        </div>

        {/* Message */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <p className="text-gray-700 leading-relaxed">
            Thank you for your payment. Your transaction has been completed
            successfully.
          </p>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-gray-600 text-sm leading-relaxed">
              We hope you had a great experience with us! If you have a moment,
              we'd love if you could share your thoughts. Your feedback helps us
              improve and guides others in their journey.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/dashboard/my-reviews"
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3.5 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <Star className="w-5 h-5" />
            <span>Leave a Review</span>
          </Link>

          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3.5 px-6 rounded-lg transition-all duration-200 border-2 border-gray-200 hover:border-gray-300"
          >
            <Home className="w-5 h-5" />
            <span>Go to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
