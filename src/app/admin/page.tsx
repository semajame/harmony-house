"use client"

import React, { useEffect, useState, useMemo } from "react"
import {
  DollarSign,
  Activity,
  Utensils,
  TrendingUp,
  Users,
  Star,
  MessageSquare,
  ThumbsUp,
  Award,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"

type ReservationData = {
  id: number
  createdAt: string
  startTime: string
  endTime: string
  status: string
  isActive: boolean
  user: {
    id: number
    name: string
    email: string
    phone: string
    role: string
  }
  room: {
    id: number
    name: string
    capacity: number
    price: string
  }
  payment?: {
    id: number
    amount: string
    method: string
    paidAt: string
  }
  food: {
    id: number
    name: string
    quantity: number
    price: number
    total: number
  }[]
}

type Food = {
  id: number
  name: string
  price: number
  description: string
  available: boolean
}

type Review = {
  id: number
  name: string
  email: string
  room: string
  rating: number
  message: string
  createdAt: string
  user: { id: number; name: string; email: string }
}

import { Calendar } from "@/components/ui/calendar"
import { addDays } from "date-fns"
import { Button } from "@/components/ui/button"
// import TotalRevenue from '@/components/total-revenue'

export default function Dashboard() {
  const [reservations, setReservations] = useState<ReservationData[]>([])
  const [foods, setFoods] = useState<Food[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  const [date, setDate] = React.useState<Date | undefined>(new Date())

  //^
  const today = new Date()
  const selectedDay = addDays(today, -0)
  const [month, setMonth] = useState(selectedDay)
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(
    selectedDay
  )

  const fetchReservations = async () => {
    try {
      const res = await fetch("/api/admin/reservations")
      if (!res.ok) throw new Error("Failed to fetch reservations")
      const data = await res.json()
      setReservations(data)
    } catch (err: any) {
      console.error("Failed to fetch reservations:", err)
    }
  }

  const fetchFoods = async () => {
    try {
      const res = await fetch("/api/admin/products")
      if (!res.ok) throw new Error("Failed to fetch products")
      const data = await res.json()
      const formattedData: Food[] = data.map((product: any) => ({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        description: product.description,
        available: product.is_active,
      }))
      setFoods(formattedData)
    } catch (error) {
      console.error("Failed to fetch products:", error)
    }
  }

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/admin/review")
      if (!res.ok) throw new Error("Failed to fetch reviews")
      const data = await res.json()
      setReviews(data)
    } catch (error) {
      console.error("Failed to fetch reviews:", error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        await Promise.all([fetchReservations(), fetchFoods(), fetchReviews()])
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const totalRevenue = useMemo(() => {
    return reservations.reduce((sum, res) => {
      if (res.status === "confirmed" && res.payment?.amount) {
        const paymentAmount = parseFloat(res.payment.amount)
        return sum + (isNaN(paymentAmount) ? 0 : paymentAmount)
      }
      return sum
    }, 0)
  }, [reservations])

  // Review analytics
  const reviewStats = useMemo(() => {
    const totalReviews = reviews.length
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        : 0
    const excellentReviews = reviews.filter((r) => r.rating >= 4).length
    const satisfactionRate =
      totalReviews > 0 ? (excellentReviews / totalReviews) * 100 : 0

    return {
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      satisfactionRate: Math.round(satisfactionRate),
      excellentReviews,
    }
  }, [reviews])

  // Reviews by room
  const reviewsByRoom = useMemo(() => {
    const roomReviews: {
      [key: string]: { count: number; avgRating: number; ratings: number[] }
    } = {}

    reviews.forEach((review) => {
      if (!roomReviews[review.room]) {
        roomReviews[review.room] = { count: 0, avgRating: 0, ratings: [] }
      }
      roomReviews[review.room].count += 1
      roomReviews[review.room].ratings.push(review.rating)
    })

    return Object.entries(roomReviews)
      .map(([room, data]) => ({
        room,
        count: data.count,
        avgRating:
          Math.round(
            (data.ratings.reduce((sum, r) => sum + r, 0) /
              data.ratings.length) *
              10
          ) / 10,
      }))
      .sort((a, b) => b.count - a.count)
  }, [reviews])

  // Chart data processing
  const revenueByDay = useMemo(() => {
    const dailyRevenue: { [key: string]: number } = {}

    reservations.forEach((res) => {
      if (res.status === "confirmed" && res.payment?.amount) {
        const date = new Date(res.createdAt).toLocaleDateString()
        const amount = parseFloat(res.payment.amount)
        dailyRevenue[date] = (dailyRevenue[date] || 0) + amount
      }
    })

    return Object.entries(dailyRevenue)
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-14) // Last 14 days
  }, [reservations])

  const statusDistribution = useMemo(() => {
    const statusCount: { [key: string]: number } = {}
    reservations.forEach((res) => {
      statusCount[res.status] = (statusCount[res.status] || 0) + 1
    })

    return Object.entries(statusCount).map(([status, count]) => ({
      status: status.charAt(0).toUpperCase() + status.slice(1),
      count,
      percentage: ((count / reservations.length) * 100).toFixed(1),
    }))
  }, [reservations])

  const stats = [
    {
      title: "Total Revenue",
      value: `₱${totalRevenue.toLocaleString("en-PH", {
        minimumFractionDigits: 2,
      })}`,
      icon: DollarSign,
      color: "bg-green-500",
      change: "+5.6%",
    },
    {
      title: "Total Reservations",
      value: reservations.length.toString(),
      icon: Activity,
      color: "bg-blue-500",
      change: "+3.2%",
    },
    {
      title: "Average Rating",
      value: `${reviewStats.averageRating}/5`,
      icon: Star,
      color: "bg-yellow-500",
      change: `${reviewStats.totalReviews} reviews`,
    },
    {
      title: "Satisfaction Rate",
      value: `${reviewStats.satisfactionRate}%`,
      icon: ThumbsUp,
      color: "bg-purple-500",
      change: `${reviewStats.excellentReviews} excellent`,
    },
  ]

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="flex overflow-y-auto bg-gray-50">
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-green-600 text-sm font-medium">
                  {stat.change}
                </span>
                <span className="text-gray-600 text-sm ml-2">
                  {index < 2 ? "from last month" : ""}
                </span>
              </div>
            </div>
          ))}
        </div>
        {/* <TotalRevenue /> */}

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Rating Distribution Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <Calendar
              mode="single"
              selected={calendarDate}
              onSelect={setCalendarDate}
              month={month}
              onMonthChange={setMonth}
              className="w-full"
            />
            <Button
              variant="outline"
              size="sm"
              className="mt-2 mb-1"
              onClick={() => {
                setDate(today)
                setMonth(today)
              }}
            >
              Today
            </Button>
          </div>
          {/* Revenue Trend Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Daily Revenue Trend
              </h3>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  fontSize={12}
                  tick={{ fill: "#6B7280" }}
                />
                <YAxis
                  fontSize={12}
                  tick={{ fill: "#6B7280" }}
                  tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: number) => [
                    `₱${value.toLocaleString()}`,
                    "Revenue",
                  ]}
                  labelStyle={{ color: "#374151" }}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  fill="url(#colorRevenue)"
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Second Row Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Reservation Status Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Reservation Status
              </h3>
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name, props) => [
                    `${value} (${props.payload.percentage}%)`,
                    "Reservations",
                  ]}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {statusDistribution.map((entry, index) => (
                <div key={entry.status} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-sm text-gray-600">{entry.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews by Room */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Reviews by Room
              </h3>
              <MessageSquare className="h-5 w-5 text-purple-500" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reviewsByRoom}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="room"
                  fontSize={12}
                  tick={{ fill: "#6B7280" }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis fontSize={12} tick={{ fill: "#6B7280" }} />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    name === "count"
                      ? `${value} reviews`
                      : `${value}/5 avg rating`,
                    name === "count" ? "Reviews" : "Rating",
                  ]}
                  labelStyle={{ color: "#374151" }}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Reviews Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Reviews
            </h3>
            <Award className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="max-h-86 overflow-y-auto">
            <div className="space-y-4">
              {reviews.slice(0, 5).map((review) => (
                <div
                  key={review.id}
                  className="border-l-4 border-yellow-400 pl-4 py-3 bg-gray-50 rounded-r-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-gray-900">
                          {review.name}
                        </h4>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={`${
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          • {review.room}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 overflow-hidden text-ellipsis whitespace-nowrap max-w-md">
                        {review.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {reviews.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No reviews yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
