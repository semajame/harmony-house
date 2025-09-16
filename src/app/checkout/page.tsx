"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Download, Home } from "lucide-react"

type Reservation = {
  name: string
  email: string
  phone: string
  checkIn: string
  checkOut: string
  totalPrice?: number
  roomId?: number
  userId?: number
  foods?: any[]
}

export default function ConfirmationPage() {
  const { data: session } = useSession()
  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [loading, setLoading] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem("reservation")
    if (stored) {
      setReservation(JSON.parse(stored))
    } else {
      alert("No reservation found. Redirecting...")
      router.push("/")
    }

    const query = new URLSearchParams(window.location.search)
    const payment = query.get("payment")

    if (payment === "success") router.push("/checkout/success")
    else if (payment === "cancel") router.push("/checkout/failed")
  }, [])

  const removeReservation = () => {
    localStorage.removeItem("reservation")
    router.push("/")
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  const downloadConfirmation = () => {
    if (!reservation) return
    const element = document.createElement("a")
    const file = new Blob(
      [
        `
Reservation Confirmation
========================

Guest: ${session?.user?.name}
Email: ${session?.user?.email}
Phone: ${session?.user?.phone}
Check-in: ${formatDate(reservation.checkIn)}
Check-out: ${formatDate(reservation.checkOut)}
Total: ₱${reservation.totalPrice?.toLocaleString()}

Thank you for your reservation!
      `,
      ],
      { type: "text/plain" }
    )
    element.href = URL.createObjectURL(file)
    element.download = "reservation-confirmation.txt"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  // Step 1: Create PayMongo checkout link
  const handleCheckout = async () => {
    if (!reservation) return

    setLoading(true)
    setMessage("")

    try {
      // 1️⃣ Create PayMongo payment link
      const res = await fetch("/api/paymongo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: reservation.totalPrice || 100,
          email: session?.user?.email,
          description: "Reservation Payment",
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(JSON.stringify(data.error))

      const paymentUrl = data.data.attributes.checkout_url

      // 2️⃣ Open PayMongo in a new window
      const popup = window.open(paymentUrl, "_blank", "width=500,height=700")
      if (!popup) {
        setMessage("Failed to open payment window. Please allow popups.")
        return
      }

      // 3️⃣ Listen for messages from popup (success/failure)
      const listener = (event: MessageEvent) => {
        if (event.data === "payment-success") {
          confirmReservation() // your API call
          popup.close()
          window.removeEventListener("message", listener)
          alert("✅ Payment successful! Reservation confirmed.")
        } else if (event.data === "payment-failed") {
          popup.close()
          window.removeEventListener("message", listener)
          alert("❌ Payment failed or canceled.")
        }
      }

      window.addEventListener("message", listener)
    } catch (err) {
      console.error(err)
      setMessage("Failed to create payment link: " + err)
    } finally {
      setLoading(false)
    }
  }

  // Step 2: After successful payment, confirm reservation on backend
  const confirmReservation = async () => {
    if (!reservation) return

    setIsConfirming(true)

    try {
      const payload = {
        roomId: Number(reservation.roomId),
        userId: Number(reservation.userId),
        startTime: reservation.checkIn,
        endTime: reservation.checkOut,
        amount: reservation.totalPrice,
        foods: reservation.foods || [],
      }

      const response = await fetch("/api/admin/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        if (response.status === 409) {
          alert(
            result.error ||
              "Time conflict: This room is already reserved during this time."
          )
        } else {
          alert(result.error || "Failed to confirm reservation.")
        }
        return
      }

      alert("✅ Payment confirmed and reservation saved!")
      localStorage.removeItem("reservation")
      router.push("/") // Reload page for clean state
    } catch (err) {
      console.error("Error confirming reservation:", err)
      alert(
        "An unexpected error occurred while confirming the reservation. Please contact support."
      )
    } finally {
      setIsConfirming(false)
    }
  }
  if (!reservation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading confirmation...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-8">
      <div className="max-w-2xl mx-auto px-4 py-[6rem]">
        {/* Reservation Details */}
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">Reservation Details</h2>
            <p className="text-green-100">
              Your booking has been successfully confirmed.
            </p>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Guest Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-green-200 pb-2">
                  Guest Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-2xl">👤</span>
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-semibold text-gray-800">
                        {session?.user?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-2xl">✉️</span>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-semibold text-blue-600">
                        {session?.user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-2xl">📞</span>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-semibold text-gray-800">
                        {session?.user?.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-blue-200 pb-2">
                  Booking Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-2xl">📅</span>
                    <div>
                      <p className="text-sm text-gray-500">Check-in</p>
                      <p className="font-semibold text-gray-800">
                        {formatDate(reservation.checkIn)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-2xl">📅</span>
                    <div>
                      <p className="text-sm text-gray-500">Check-out</p>
                      <p className="font-semibold text-gray-800">
                        {formatDate(reservation.checkOut)}
                      </p>
                    </div>
                  </div>
                  {reservation.totalPrice && (
                    <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg border-2 border-green-200">
                      <span className="text-2xl">💰</span>
                      <div>
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="font-bold text-2xl text-green-600">
                          ₱{reservation.totalPrice.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Important Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-blue-800 mb-2">
            Important Information
          </h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Please bring a valid ID for check-in</li>
            <li>
              • Cancellation policy: Free cancellation for 1 day after booking.
            </li>
            <li>• Text or Call Harmony House for cancellations.</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={downloadConfirmation}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center cursor-pointer"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Confirmation
          </button>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center cursor-pointer"
          >
            {loading ? "Redirecting..." : "Pay with GCash"}
          </button>
        </div>
      </div>
    </div>
  )
}
