"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import {
  Calendar,
  Clock,
  CreditCard,
  MapPin,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  X,
  Filter,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Food {
  name: string
  quantity: number
  total: number
}

interface Payment {
  method: string
  amount: number
  paidAt?: string
}

interface Room {
  name: string
  capacity: number
}

interface Reservation {
  id: string
  startTime: string
  endTime: string
  status: string
  createdAt: string
  room: Room
  foods?: Food[]
  payment?: Payment
}

type FilterStatus = "all" | "confirmed" | "pending" | "cancelled"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all")

  useEffect(() => {
    const fetchReservations = async () => {
      if (!session?.user?.id) return

      try {
        const res = await fetch(
          `/api/admin/reservations/by-user-id?id=${session.user.id}`
        )
        if (!res.ok) throw new Error("Failed to fetch reservations")

        const data = await res.json()

        console.log(data)
        setReservations(data)
      } catch (err) {
        console.error("Error fetching reservations:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchReservations()
  }, [session?.user?.id])

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "pending":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    }
  }

  // Filter reservations based on selected status
  const filteredReservations = reservations.filter((reservation) => {
    if (filterStatus === "all") return true
    return reservation.status.toLowerCase() === filterStatus.toLowerCase()
  })

  const sortedReservations = [...filteredReservations].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime()
    const dateB = new Date(b.createdAt).getTime()
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA
  })

  const handleViewDetails = (reservation: Reservation) => {
    setSelectedReservation(reservation)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedReservation(null)
  }

  // Count reservations by status
  const getStatusCount = (status: FilterStatus) => {
    if (status === "all") return reservations.length
    return reservations.filter(
      (r) => r.status.toLowerCase() === status.toLowerCase()
    ).length
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-8"></div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-28 px-4 pb-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                My Dashboard
              </h1>
              <p className="text-gray-600">
                Manage and track your room bookings
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <Button
                asChild
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
              >
                <Link href="/dashboard/edit-user" prefetch>
                  Edit User
                </Link>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
              >
                <Link href="/dashboard/my-reviews" prefetch>
                  My Reviews
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <Card className="w-fit">
              <CardContent>
                <div className="text-sm text-gray-500 mb-1">
                  Total Reservations
                </div>
                <div className="text-2xl font-bold text-indigo-600">
                  {reservations.length}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {reservations.length === 0 ? (
          <Card className="text-center">
            <CardContent className="p-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <CardTitle className="text-xl text-gray-700 mb-2">
                No reservations found
              </CardTitle>
              <p className="text-gray-500">
                You haven't made any reservations yet. Start by booking a room!
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="">
              <CardTitle className="text-2xl">Your Reservations</CardTitle>
              <div className="flex items-center gap-4 mb-4 mt-2 flex-wrap">
                {/* Filter by Status */}
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-600" />
                  <label className="text-sm text-gray-600">
                    Filter by Status:
                  </label>
                  <Select
                    value={filterStatus}
                    onValueChange={(value) =>
                      setFilterStatus(value as FilterStatus)
                    }
                  >
                    <SelectTrigger className="cursor-pointer w-40">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="cursor-pointer">
                        All ({getStatusCount("all")})
                      </SelectItem>
                      <SelectItem value="confirmed" className="cursor-pointer">
                        Confirmed ({getStatusCount("confirmed")})
                      </SelectItem>
                      <SelectItem value="pending" className="cursor-pointer">
                        Pending ({getStatusCount("pending")})
                      </SelectItem>
                      <SelectItem value="cancelled" className="cursor-pointer">
                        Cancelled ({getStatusCount("cancelled")})
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort by Date */}
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Sort by Date:</label>
                  <Select
                    value={sortOrder}
                    onValueChange={(value) =>
                      setSortOrder(value as "asc" | "desc")
                    }
                  >
                    <SelectTrigger className="cursor-pointer w-32">
                      <SelectValue placeholder="Select order" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc" className="cursor-pointer">
                        Latest
                      </SelectItem>
                      <SelectItem value="asc" className="cursor-pointer">
                        Oldest
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Show filtered count */}
              {filterStatus !== "all" && (
                <div className="text-sm text-gray-600 mb-4">
                  Showing {sortedReservations.length} {filterStatus} reservation
                  {sortedReservations.length !== 1 ? "s" : ""}
                </div>
              )}
            </CardHeader>
            <CardContent>
              {sortedReservations.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    No {filterStatus !== "all" ? filterStatus : ""} reservations
                    found
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-indigo-500 to-purple-600">
                        <TableHead className="text-white font-semibold">
                          Room
                        </TableHead>
                        <TableHead className="text-white font-semibold">
                          Start Date
                        </TableHead>
                        <TableHead className="text-white font-semibold">
                          End Date
                        </TableHead>
                        <TableHead className="text-white font-semibold">
                          Status
                        </TableHead>
                        <TableHead className="text-white font-semibold">
                          Payment
                        </TableHead>
                        <TableHead className="text-white font-semibold">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedReservations.map((reservation: Reservation) => {
                        const startDateTime = formatDateTime(
                          reservation.startTime
                        )
                        const endDateTime = formatDateTime(reservation.endTime)

                        return (
                          <TableRow
                            key={reservation.id}
                            className="hover:bg-gray-50"
                          >
                            <TableCell className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-indigo-500" />
                                <span className="font-medium text-gray-800 p-2">
                                  {reservation.room.name}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm p-2">
                                <div className="font-medium ">
                                  {startDateTime.date}
                                </div>
                                <div className="text-gray-500">
                                  {startDateTime.time}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text- p-2">
                                <div className="font-medium">
                                  {endDateTime.date}
                                </div>
                                <div className="text-gray-500">
                                  {endDateTime.time}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={`flex items-center gap-1 w-fit ${getStatusVariant(
                                  reservation.status
                                )}`}
                              >
                                {getStatusIcon(reservation.status)}
                                {reservation.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {reservation.payment ? (
                                <div className="text-sm">
                                  <div className="font-medium text-green-600">
                                    ₱{reservation.payment.amount}
                                  </div>
                                  <div className="text-gray-500">
                                    {reservation.payment.method}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-sm text-gray-400">
                                  No payment
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Dialog
                                open={
                                  showModal &&
                                  selectedReservation?.id === reservation.id
                                }
                                onOpenChange={(open) => {
                                  if (!open) closeModal()
                                }}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={() =>
                                      handleViewDetails(reservation)
                                    }
                                    className="flex items-center gap-2 cursor-pointer"
                                  >
                                    <Eye className="w-4 h-4" />
                                    View
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-6xl max-h-[75vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                      <MapPin className="w-5 h-5" />
                                      {reservation.room.name}
                                    </DialogTitle>
                                  </DialogHeader>

                                  <div className="space-y-6">
                                    {/* Status */}
                                    <div>
                                      <Badge
                                        className={`flex items-center gap-1 w-fit ${getStatusVariant(
                                          reservation.status
                                        )}`}
                                      >
                                        {getStatusIcon(reservation.status)}
                                        {reservation.status}
                                      </Badge>
                                    </div>

                                    {/* Room Info */}
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">
                                          Room Information
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="flex items-center gap-2">
                                          <Users className="w-5 h-5 text-gray-400" />
                                          <span className="text-gray-600">
                                            Capacity:
                                          </span>
                                          <span className="font-medium text-gray-800">
                                            {reservation.room.capacity} people
                                          </span>
                                        </div>
                                      </CardContent>
                                    </Card>

                                    {/* Date and Time */}
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                          <Calendar className="w-5 h-5" />
                                          Reservation Period
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <div>
                                            <div className="text-sm text-gray-600 mb-1">
                                              Start Time
                                            </div>
                                            <div className="font-medium text-gray-800">
                                              {
                                                formatDateTime(
                                                  reservation.startTime
                                                ).date
                                              }
                                            </div>
                                            <div className="text-sm text-gray-600">
                                              {
                                                formatDateTime(
                                                  reservation.startTime
                                                ).time
                                              }
                                            </div>
                                          </div>
                                          <div>
                                            <div className="text-sm text-gray-600 mb-1">
                                              End Time
                                            </div>
                                            <div className="font-medium text-gray-800">
                                              {
                                                formatDateTime(
                                                  reservation.endTime
                                                ).date
                                              }
                                            </div>
                                            <div className="text-sm text-gray-600">
                                              {
                                                formatDateTime(
                                                  reservation.endTime
                                                ).time
                                              }
                                            </div>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>

                                    {/* Food Orders */}
                                    {reservation.foods &&
                                      reservation.foods.length > 0 && (
                                        <Card>
                                          <CardHeader>
                                            <CardTitle className="text-lg flex items-center gap-2">
                                              <Calendar className="w-5 h-5" />
                                              Ordered Foods
                                            </CardTitle>
                                          </CardHeader>
                                          <CardContent>
                                            <div className="space-y-2">
                                              {reservation.foods.map(
                                                (food: Food, index: number) => (
                                                  <div
                                                    key={index}
                                                    className="flex justify-between items-center py-2 border-b last:border-b-0"
                                                  >
                                                    <div>
                                                      <span className="font-medium text-gray-800">
                                                        {food.name}
                                                      </span>
                                                      <span className="text-sm text-gray-600 ml-2">
                                                        × {food.quantity}
                                                      </span>
                                                    </div>
                                                    <Badge variant="outline">
                                                      ₱{food.total}
                                                    </Badge>
                                                  </div>
                                                )
                                              )}
                                            </div>
                                          </CardContent>
                                        </Card>
                                      )}

                                    {/* Payment Info */}
                                    {reservation.payment && (
                                      <Card>
                                        <CardHeader>
                                          <CardTitle className="text-lg flex items-center gap-2">
                                            <CreditCard className="w-5 h-5" />
                                            Payment Details
                                          </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* <div>
                                              <div className='text-sm text-gray-600 mb-1'>
                                                Payment Method
                                              </div>
                                              <div className='font-medium text-gray-800'>
                                                {reservation.payment.method}
                                              </div>
                                            </div> */}
                                            <div>
                                              <div className="text-sm text-gray-600 mb-1">
                                                Amount
                                              </div>
                                              <Badge
                                                variant="outline"
                                                className="text-lg font-bold text-green-600"
                                              >
                                                ₱{reservation.payment.amount}
                                              </Badge>
                                            </div>
                                            <div>
                                              <div className="text-sm text-gray-600 mb-1">
                                                Payment Date
                                              </div>
                                              <div className="font-medium text-gray-800">
                                                {reservation.payment.paidAt
                                                  ? formatDateTime(
                                                      reservation.payment.paidAt
                                                    ).date
                                                  : "Not Paid"}
                                              </div>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
