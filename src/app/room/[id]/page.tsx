"use client"

import { useParams, useRouter } from "next/navigation"
import { rooms } from "@/lib/rooms"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Calendar,
  Clock,
  Users,
  Star,
  Music,
  Volume2,
  Wifi,
  Thermometer,
  Camera,
  Shield,
  Heart,
  Share2,
  ArrowLeft,
  CheckCircle,
  Sparkles,
  User,
  Mail,
  Phone,
  Utensils,
  Tag,
} from "lucide-react"

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

import { useSession } from "next-auth/react"
import ReviewsPreview from "@/components/reviewsRoom"
import { Label } from "@/components/ui/label"
import { Reservation } from "@/app/lib/entities/reservation"

type Food = {
  id: number
  name: string
  price: number
  description: string
  available: boolean
}

type Promo = {
  isActive: boolean
  id: number
  code: string
  discount: number
  createdAt?: string
}

export const computeDiscount = (amount: number, discount: number) => {
  return amount - (amount * discount) / 100
}

export default function RoomPage() {
  const { data: session } = useSession()
  const params = useParams()
  const router = useRouter()
  const { id } = useParams() // <-- comes from /room/[id]
  const roomId = Number(id)

  const [isChecked, setIsChecked] = useState(false)

  const [room, setRoom] = useState<any>(null) // already defined

  const [selectedFoods, setSelectedFoods] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [startTimeDate, setStartTimeDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [persons, setPersons] = useState(5)
  const [isLiked, setIsLiked] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const [foodQuantities, setFoodQuantities] = useState<Record<number, number>>(
    {}
  )
  const [foods, setFoods] = useState<Food[]>([])

  const [promos, setPromos] = useState<Promo[]>([])
  const [discountedTotal, setDiscountedTotal] = useState(0)
  const [selectedPromo, setSelectedPromo] = useState<Promo | null>(null)

  // Mock additional images for the room
  const roomImages = [
    room?.image,
    room?.image, // In real app, these would be different images
    room?.image,
    room?.image,
  ]

  const features = [
    {
      icon: Volume2,
      label: "Premium Sound System",
      description: "7.1 Surround Sound",
    },
    { icon: Camera, label: "HD Display", description: '65" 4K Smart TV' },
    {
      icon: Wifi,
      label: "Free High-Speed WiFi",
      description: "Unlimited access",
    },
    {
      icon: Thermometer,
      label: "Climate Control",
      description: "Individual AC control",
    },
    {
      icon: Music,
      label: "50,000+ Songs",
      description: "Multi-language library",
    },
    {
      icon: Shield,
      label: "Private & Secure",
      description: "Soundproof rooms",
    },
  ]

  const timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
  ]

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await fetch(`/api/admin/rooms/${roomId}`)
        if (!res.ok) throw new Error("Failed to fetch room")

        const data = await res.json()
        console.log("Fetched room:", data) // ✅ You saw this already
        setRoom(data) // ✅ Make sure this is called
        setLoading(false)
      } catch (err) {
        console.error("Error fetching room:", err)
      }
    }

    if (roomId) fetchRoom()
  }, [roomId])

  //^ FETCH FOODS
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await fetch("/api/admin/products")
        if (!res.ok) throw new Error("Failed to fetch products")

        const data = await res.json()

        const formattedData: Food[] = data.map((product: any) => ({
          id: product.id,
          name: product.name,
          category: product.category || "Food",
          price: parseFloat(product.price),
          description: product.description || "",
          image: product.image || "",
          available: product.is_active ?? true,
        }))

        setFoods(formattedData)
      } catch (error) {
        console.error("Failed to fetch products:", error)
      }
    }

    fetchFoods()
  }, [])

  //^ FETCH DISCOUNTS
  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const res = await fetch("/api/admin/discount")
        const data = await res.json()
        const activePromos = data.filter((promo: Promo) => promo.isActive)
        setPromos(activePromos)
      } catch (error) {
        console.error("Failed to fetch promos:", error)
      }
    }

    fetchPromos()
  }, [])

  useEffect(() => {
    if (startTime && endTime && room) {
      const startTimeHour = parseInt(startTime.split(":")[0])
      const endTimeHour = parseInt(endTime.split(":")[0])
      let hours = endTimeHour - startTimeHour
      if (hours <= 0) hours = 24 - startTimeHour + endTimeHour

      const roomPrice = parseFloat(room.price.toString().replace(/[^\d.]/g, ""))
      const roomTotal = hours * roomPrice

      const foodTotal = selectedFoods.reduce((sum, id) => {
        const food = foods.find((f) => f.id === id)
        const qty = foodQuantities[id] || 1
        return sum + (food?.price || 0) * qty
      }, 0)

      const total = roomTotal + foodTotal
      setTotalPrice(total)

      const finalWithDiscount = selectedPromo
        ? computeDiscount(total, selectedPromo.discount)
        : total

      setDiscountedTotal(finalWithDiscount)
    }
  }, [
    startTime,
    endTime,
    room,
    selectedPromo,
    selectedFoods,
    foodQuantities,
    foods,
  ])

  // ⏱ Calculate total price when times change
  useEffect(() => {
    if (startTime && endTime && room) {
      const startTimeHour = parseInt(startTime.split(":")[0])
      const endTimeHour = parseInt(endTime.split(":")[0])
      let hours = endTimeHour - startTimeHour

      if (hours <= 0) {
        hours = 24 - startTimeHour + endTimeHour
      }

      const roomPriceNumber = parseInt(
        room.price.toString().replace(/[^\d]/g, "")
      )

      const foodTotal = selectedFoods.reduce((sum, id) => {
        const food = foods.find((f) => f.id === id)
        const qty = foodQuantities[id] || 1
        return sum + (food?.price || 0) * qty
      }, 0)

      setTotalPrice(hours * roomPriceNumber + foodTotal)
    }
  }, [startTime, endTime, room, selectedFoods, foodQuantities, foods])

  //^ Handle reservation button
  const handleReserve = async (event: React.FormEvent) => {
    event.preventDefault()

    // Rename variables if necessary: assuming these are from useState
    if (!startTimeDate || !startTime || !endTime) {
      alert("Please fill in all required fields")
      return
    }

    // Construct JS Date objects
    const start = new Date(`${startTimeDate}T${startTime}:00`)
    let end = new Date(`${startTimeDate}T${endTime}:00`)

    // Adjust end time if it's earlier than or equal to start time
    if (end <= start) {
      end.setDate(end.getDate() + 1)
    }

    // Map selected food items
    const selectedFoodDetails = selectedFoods.map((id) => {
      const food = foods.find((f) => f.id === id)
      const qty = foodQuantities[id] || 1
      return {
        id: food?.id,
        name: food?.name,
        quantity: qty,
        price: food?.price,
        total: (food?.price || 0) * qty,
      }
    })

    // Prepare reservation payload
    const reservationData = {
      userId: session?.user?.id,
      roomId: room?.id,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      totalPrice: discountedTotal,
      amount: discountedTotal,
      foods: selectedFoodDetails,
    }

    try {
      // 1. Create PayMongo checkout session
      const res = await fetch("/api/paymongo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(reservationData.totalPrice * 100),
          email: session?.user?.email,
          description: "Room Reservation Payment",
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Checkout session creation failed")
      }

      // 2. Check for reservation conflicts
      const conflictRes = await fetch(
        "/api/admin/reservations/check-conflict",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reservationData),
        }
      )

      const conflictResult = await conflictRes.json()

      if (!conflictRes.ok) {
        if (conflictRes.status === 409) {
          alert(
            conflictResult.message ||
              "Time conflict: This room is already reserved during this time."
          )
        } else {
          alert(conflictResult.error || "Failed to confirm reservation.")
        }
        return
      }

      // 3. Store reservation data in localStorage
      localStorage.setItem(
        "reservation",
        JSON.stringify({
          userId: session?.user?.id,
          roomId: room?.id,
          startTime: start.toISOString(),
          endTime: end.toISOString(),
          totalPrice: discountedTotal,
          amount: discountedTotal,
          foods: selectedFoodDetails, // now only valid food objects
        })
      )

      window.location.href = data.data.attributes.checkout_url
    } catch (error: any) {
      console.error("Error during reservation:", error)
      alert("An error occurred while creating the payment. Please try again.")
    }
  }

  const handleFoodToggle = (foodId: number) => {
    if (selectedFoods.includes(foodId)) {
      setSelectedFoods((prev) => prev.filter((id) => id !== foodId))
      setFoodQuantities((prev) => {
        const { [foodId]: _, ...rest } = prev
        return rest
      })
    } else {
      setSelectedFoods((prev) => [...prev, Number(foodId)]) // <-- ensure number
      setFoodQuantities((prev) => ({ ...prev, [foodId]: 1 }))
    }
  }

  //^ format time to am and pm
  function formatToAMPM(time24: string): string {
    const [hour, minute] = time24.split(":").map(Number)
    const period = hour >= 12 ? "PM" : "AM"
    const hour12 = hour % 12 === 0 ? 12 : hour % 12
    return `${hour12}:${minute.toString().padStart(2, "0")} ${period}`
  }

  function isPastTime(time24: string, selectedDate: string): boolean {
    if (!selectedDate) return false // if no date selected yet

    const [hour, minute] = time24.split(":").map(Number)
    const now = new Date()

    const date = new Date(selectedDate)
    date.setHours(hour, minute, 0, 0)

    // If selected date is today, disable times that already passed
    if (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    ) {
      return date < now
    }

    // If selected date is in the past, always disable
    if (date < now) {
      return true
    }

    // Otherwise (tomorrow or later), always enable
    return false
  }

  const handleBackToRooms = () => {
    router.push("/rooms") // Adjust this path according to your routing structure
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          {/* Simple spinner */}
          <div className="w-8 h-8 border-3 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-4"></div>

          {/* Loading text */}
          <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">
            Loading room
          </h2>

          <p className="text-gray-500 dark:text-gray-400">
            Please wait a moment...
          </p>
        </div>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <Music className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Room Not Found</h2>
          <p className="text-gray-600">
            The room you're looking for doesn't exist.
          </p>
          <Button
            className="bg-purple-600 hover:bg-purple-700"
            onClick={handleBackToRooms}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Rooms
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-white to-pink-50/50">
      {/* Header with breadcrumb */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-purple-600 hover:bg-purple-50"
                onClick={handleBackToRooms}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Rooms
              </Button>
              <div className="text-sm text-gray-500">
                Rooms /{" "}
                <span className="text-purple-600 font-medium">{room.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLiked(!isLiked)}
                className={`${
                  isLiked ? "text-red-500" : "text-gray-500"
                } hover:bg-red-50`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:bg-gray-50"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto sm:p-6 grid lg:grid-cols-3 gap-8 py-8 px-4 ">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Room Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {room.name}
              </h1>
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                PREMIUM
              </div>
            </div>

            <div className="text-3xl font-bold text-purple-600">
              ₱{room.price}
              <span className="text-lg font-normal text-gray-500">/hour</span>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative w-full h-80 md:h-96 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={roomImages[selectedImageIndex] || "/placeholder-room.jpg"}
                alt={room.name}
                fill
                className="object-cover transition-all duration-500"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              About This Room
            </h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              {room.description}
            </p>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">What's Included:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg"
                  >
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">
                        {feature.label}
                      </div>
                      <div className="text-sm text-gray-600">
                        {feature.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Food  */}

          <ReviewsPreview roomName={room?.name || ""} />
        </div>

        {/* Booking Sidebar */}
        <form onSubmit={handleReserve}>
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5" />
                    <h3 className="text-lg font-bold">Book Your Session</h3>
                  </div>
                  <p className="text-purple-100 text-sm">
                    Reserve your perfect karaoke experience
                  </p>
                </div>

                <div className="p-6 space-y-6">
                  {/* Date Selection */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <Calendar className="w-4 h-4" />
                      Select Date
                    </label>
                    <input
                      type="date"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                      value={startTimeDate}
                      onChange={(e) => setStartTimeDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>

                  {/* Time Selection */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Check-in */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                        <Clock className="w-4 h-4" />
                        Check-in
                      </label>
                      <select
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                      >
                        <option value="">Select time</option>
                        {timeSlots.map((time) => {
                          const isDisabled = !!(
                            isPastTime(time, startTimeDate) ||
                            (endTime && time >= endTime)
                          ) // ✅ Always returns boolean
                          return (
                            <option
                              key={time}
                              value={time}
                              disabled={isDisabled}
                            >
                              {formatToAMPM(time)}
                            </option>
                          )
                        })}
                      </select>
                    </div>

                    {/* Check-out */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                        <Clock className="w-4 h-4" />
                        Check-out
                      </label>
                      <select
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        required
                      >
                        <option value="">Select time</option>
                        {timeSlots.map((time) => {
                          const isDisabled = !!(
                            isPastTime(time, startTimeDate) ||
                            (startTime && time <= startTime)
                          ) // ✅ Always returns boolean
                          return (
                            <option
                              key={time}
                              value={time}
                              disabled={isDisabled}
                            >
                              {formatToAMPM(time)}
                            </option>
                          )
                        })}
                      </select>
                    </div>
                  </div>

                  {/* Guests */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <Users className="w-4 h-4" />
                      Number of Guests
                    </label>
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden opacity-50 pointer-events-none">
                      <span className="flex-1 text-center py-3 border-x border-gray-200">
                        {persons} {persons === 1 ? "guest" : "guests"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="terms-2"
                      checked={isChecked}
                      onCheckedChange={(checked) => setIsChecked(!!checked)}
                    />
                    <div className="grid gap-2 text-sm">
                      {/* ✅ This Label acts as a trigger */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Label
                            htmlFor="terms-2"
                            className="text-sm text-blue-600 hover:underline cursor-pointer"
                          >
                            Accept terms and conditions
                          </Label>
                        </DialogTrigger>

                        <DialogContent className="max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Terms and Conditions</DialogTitle>
                            <DialogDescription>
                              Please read and understand before proceeding.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 text-sm text-gray-700">
                            <div>
                              <strong>1. Reservation Confirmation:</strong>
                              <ul className="list-disc pl-5">
                                <li>
                                  A reservation is only confirmed once payment
                                  (full or partial, as required) has been
                                  received.
                                </li>
                                <li>
                                  Reservations include the selected room package
                                  and any food or drink inclusions stated at the
                                  time of booking.
                                </li>
                              </ul>
                            </div>
                            <div>
                              <strong>2. Cancellation Policy:</strong>
                              <ul className="list-disc pl-5">
                                <li>
                                  Cancellation made less than 24 hours before
                                  the reserved time: Payment will not be
                                  refunded.
                                </li>
                                <li>
                                  Cancellation made 24 hours or more before the
                                  reserved time: 30% of the total payment will
                                  be deducted as a cancellation fee, and the
                                  remaining balance (if any) will be refunded.
                                </li>
                                <li>
                                  No-show (failure to arrive on the reserved
                                  date and time without prior notice) will
                                  result in forfeiture of the full payment.
                                </li>
                              </ul>
                            </div>
                            <div>
                              <strong>3. Food and Beverage Inclusion:</strong>
                              <ul className="list-disc pl-5">
                                <li>
                                  Food and beverage packages included in the
                                  reservation are non-refundable and
                                  non-transferable.
                                </li>
                                <li>
                                  Any special requests or additional orders must
                                  be settled separately on the day of the
                                  reservation.
                                </li>
                                <li>
                                  Customers may only order up to a maximum of
                                  ten (10) food or beverage items per
                                  reservation.
                                </li>
                              </ul>
                            </div>
                            <div>
                              <strong>4. Changes to Reservation:</strong>
                              <ul className="list-disc pl-5">
                                <li>
                                  Rescheduling may be allowed at least 24 hours
                                  before the original booking time, subject to
                                  room availability.
                                </li>
                                <li>
                                  Any changes within 24 hours will be considered
                                  a cancellation and follow the cancellation
                                  policy stated above.
                                </li>
                              </ul>
                            </div>
                            <div>
                              <strong>5. General Conditions:</strong>
                              <ul className="list-disc pl-5">
                                <li>
                                  Guests are expected to follow house rules and
                                  respect the property during their stay.
                                </li>
                                <li>
                                  Management reserves the right to amend these
                                  Terms and Conditions without prior notice.
                                </li>
                              </ul>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <p className="text-muted-foreground text-sm">
                        By clicking this checkbox, you agree to the terms and
                        conditions.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Utensils className="w-4 h-4" />
                      Food Inclusions
                    </h4>
                    <div className="space-x-2 space-y-2 grid grid-cols-2 w-full">
                      {foods.map((food) => (
                        <div
                          key={food.id}
                          className="flex flex-col bg-purple-50 px-3 py-2 rounded-lg"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={selectedFoods.includes(food.id)}
                                onChange={() => handleFoodToggle(food.id)}
                                className="accent-purple-600"
                              />
                              <span className="text-xs text-gray-700">
                                {food.name}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-purple-600">
                              ₱{food.price}
                            </span>
                          </div>

                          {selectedFoods.includes(food.id) && (
                            <div className="mt-2 flex items-center gap-2 text-xs">
                              <label
                                htmlFor={`qty-${food.id}`}
                                className="text-gray-600"
                              >
                                Qty:
                              </label>

                              <div className="flex items-center border border-purple-300 rounded">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setFoodQuantities((prev) => ({
                                      ...prev,
                                      [food.id]: Math.max(
                                        (prev[food.id] || 0) - 1,
                                        0
                                      ),
                                    }))
                                  }
                                  className="px-2 py-1 text-purple-600 hover:bg-purple-100"
                                >
                                  -
                                </button>

                                <input
                                  id={`qty-${food.id}`}
                                  type="number"
                                  readOnly
                                  value={foodQuantities[food.id] || 0}
                                  className="w-12 text-center border-x border-purple-300 bg-gray-50"
                                />

                                <button
                                  type="button"
                                  onClick={() =>
                                    setFoodQuantities((prev) => ({
                                      ...prev,
                                      [food.id]: Math.min(
                                        (prev[food.id] || 0) + 1,
                                        10
                                      ),
                                    }))
                                  }
                                  className="px-2 py-1 text-purple-600 hover:bg-purple-100"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {promos.length > 0 && (
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                        <Tag className="w-4 h-4" />
                        Apply Promo Code
                      </label>
                      <select
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                        value={selectedPromo?.id || ""}
                        onChange={(e) => {
                          const promo = promos.find(
                            (p) => p.id === parseInt(e.target.value)
                          )
                          setSelectedPromo(promo || null)
                        }}
                      >
                        <option value="">Select a promo</option>
                        {promos.map((promo) => (
                          <option key={promo.id} value={promo.id}>
                            {promo.code} - {promo.discount}% off
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Pricing Breakdown */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Hourly rate</span>
                      <span>₱{room.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Promo discount</span>
                      <span className="text-green-600">
                        {selectedPromo
                          ? `-₱${(totalPrice - discountedTotal).toFixed(2)}`
                          : "None"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Service fee</span>
                      <span>Free</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
                      <div className="flex flex-col gap-2">
                        <div>
                          <span>Total: </span>
                          <span className="text-purple-600">
                            ₱{discountedTotal.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Benefits */}

                  {/* Book Button */}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-6 text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl cursor-pointer"
                    disabled={
                      !startTimeDate || !startTime || !endTime || !isChecked
                    }
                  >
                    <Music className="w-5 h-5 mr-2" />
                    Reserve Your Spot
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
