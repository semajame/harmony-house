"use client"

import { useEffect } from "react"

export default function FailedPage() {
  useEffect(() => {
    localStorage.removeItem("reservation")
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl font-bold text-red-600">
        Payment Failed or Canceled
      </h1>
    </div>
  )
}
