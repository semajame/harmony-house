"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect } from "react"

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for your payment. Your transaction has been completed.
        </p>
        <Button className="w-full">
          <Link href="/dashboard" className="w-full inline-block text-center">
            Go To Dashboard
          </Link>
        </Button>
      </div>
    </div>
  )
}
