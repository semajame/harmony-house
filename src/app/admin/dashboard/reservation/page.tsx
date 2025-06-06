'use client'

import { useEffect, useState } from 'react'
import {
  Calendar,
  Clock,
  CreditCard,
  Mail,
  MapPin,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  Users,
  Loader2,
  AlertTriangle,
  CalendarDays,
  Filter,
} from 'lucide-react'

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
}

const Reservation = () => {
  const [reservations, setReservations] = useState<ReservationData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<string>('all')

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await fetch('/api/admin/reservations', {
          method: 'GET',
        })

        if (!res.ok) throw new Error('Failed to fetch reservations')

        const data = await res.json()
        setReservations(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchReservations()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className='w-4 h-4 text-green-600' />
      case 'cancelled':
        return <XCircle className='w-4 h-4 text-red-600' />
      default:
        return <AlertCircle className='w-4 h-4 text-yellow-600' />
    }
  }

  const getStatusBadge = (status: string) => {
    const baseClasses =
      'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium'

    switch (status) {
      case 'confirmed':
        return `${baseClasses} bg-green-100 text-green-800 border border-green-200`
      case 'cancelled':
        return `${baseClasses} bg-red-100 text-red-800 border border-red-200`
      default:
        return `${baseClasses} bg-yellow-100 text-yellow-800 border border-yellow-200`
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const calculateNights = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return nights
  }

  const getActiveReservations = () =>
    reservations.filter((res) => res.isActive).length
  const getConfirmedReservations = () =>
    reservations.filter((res) => res.status === 'confirmed').length

  // Filter reservations by selected month
  const filteredReservations =
    selectedMonth === 'all'
      ? reservations
      : reservations.filter((res) => {
          const reservationMonth = new Date(res.startTime)
            .toISOString()
            .slice(0, 7) // YYYY-MM format
          return reservationMonth === selectedMonth
        })

  // Get available months from reservations
  const getAvailableMonths = () => {
    const months = new Set<string>()
    reservations.forEach((res) => {
      const month = new Date(res.startTime).toISOString().slice(0, 7)
      months.add(month)
    })
    return Array.from(months).sort().reverse() // Most recent first
  }

  const formatMonthLabel = (monthStr: string) => {
    const date = new Date(monthStr + '-01')
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    })
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-64'>
        <div className='flex flex-col items-center gap-3'>
          <Loader2 className='w-8 h-8 animate-spin text-blue-600' />
          <p className='text-gray-600'>Loading reservations...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='p-6'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3'>
          <AlertTriangle className='w-5 h-5 text-red-600 flex-shrink-0' />
          <div>
            <h3 className='font-medium text-red-800'>
              Error loading reservations
            </h3>
            <p className='text-red-600 text-sm mt-1'>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='p-6 bg-gray-50 overflow-y-auto'>
      <div className='max-w-7xl mx-auto space-y-6'>
        {/* Header with Stats */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
          <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>Reservations</h1>
              <p className='text-gray-600 mt-1'>
                Manage and track all reservations
              </p>
            </div>

            <div className='flex flex-col sm:flex-row gap-4 items-end'>
              {/* Month Filter */}
              <div className='flex items-center gap-2'>
                <Filter className='w-4 h-4 text-gray-500' />
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className='px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
                >
                  <option value='all'>All Months</option>
                  {getAvailableMonths().map((month) => (
                    <option key={month} value={month}>
                      {formatMonthLabel(month)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Stats */}
            <div className='flex gap-4'>
              <div className='bg-blue-50 rounded-lg p-3 text-center min-w-20'>
                <div className='text-2xl font-bold text-blue-600'>
                  {reservations.length}
                </div>
                <div className='text-xs text-blue-600'>Total</div>
              </div>
              <div className='bg-green-50 rounded-lg p-3 text-center min-w-20'>
                <div className='text-2xl font-bold text-green-600'>
                  {getConfirmedReservations()}
                </div>
                <div className='text-xs text-green-600'>Confirmed</div>
              </div>
              <div className='bg-orange-50 rounded-lg p-3 text-center min-w-20'>
                <div className='text-2xl font-bold text-orange-600'>
                  {getActiveReservations()}
                </div>
                <div className='text-xs text-orange-600'>Active</div>
              </div>
            </div>
          </div>
        </div>

        {/* Reservations Grid */}
        {reservations.length === 0 ? (
          <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center'>
            <CalendarDays className='w-16 h-16 text-gray-400 mx-auto mb-4' />
            <h3 className='text-xl font-semibold text-gray-700 mb-2'>
              No reservations found
            </h3>
            <p className='text-gray-500'>
              Reservations will appear here when customers make bookings.
            </p>
          </div>
        ) : (
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {reservations.map((res) => (
              <div
                key={res.id}
                className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-1'
              >
                {/* Header */}
                <div className='bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white'>
                  <div className='flex items-center justify-between mb-2'>
                    <h3 className='font-semibold text-lg truncate'>
                      {res.room.name}
                    </h3>
                    <div className={getStatusBadge(res.status)}>
                      {getStatusIcon(res.status)}
                      <span className='capitalize'>{res.status}</span>
                    </div>
                  </div>
                  <div className='flex items-center gap-2 text-blue-100'>
                    <MapPin className='w-4 h-4' />
                    <span className='text-sm'>Reservation #{res.id}</span>
                  </div>
                </div>

                {/* Content */}
                <div className='p-4 space-y-4'>
                  {/* Customer Info */}
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2 text-gray-700'>
                      <User className='w-4 h-4 text-gray-500' />
                      <span className='font-medium'>{res.user.name}</span>
                    </div>
                    <div className='flex items-center gap-2 text-gray-600'>
                      <Mail className='w-4 h-4 text-gray-500' />
                      <span className='text-sm truncate'>{res.user.email}</span>
                    </div>
                    {res.user.phone && (
                      <div className='flex items-center gap-2 text-gray-600'>
                        <Phone className='w-4 h-4 text-gray-500' />
                        <span className='text-sm'>{res.user.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Room Details */}
                  <div className='bg-gray-50 rounded-lg p-3 space-y-2'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <Users className='w-4 h-4 text-gray-500' />
                        <span className='text-sm text-gray-600'>
                          Capacity: {res.room.capacity}
                        </span>
                      </div>
                      <div className='font-bold text-green-600'>
                        ₱{parseFloat(res.room.price).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2 text-gray-700'>
                      <Calendar className='w-4 h-4 text-gray-500' />
                      <div className='text-sm'>
                        <div className='font-medium'>
                          {formatDate(res.startTime)}
                        </div>
                        <div className='text-gray-500'>
                          {formatTime(res.startTime)} -{' '}
                          {formatTime(res.endTime)}
                        </div>
                      </div>
                    </div>
                    <div className='text-xs text-gray-500 ml-6'>
                      {calculateNights(res.startTime, res.endTime)} night
                      {calculateNights(res.startTime, res.endTime) !== 1
                        ? 's'
                        : ''}
                    </div>
                  </div>

                  {/* Payment Info */}
                  {res.payment ? (
                    <div className='bg-green-50 border border-green-200 rounded-lg p-3'>
                      <div className='flex items-center gap-2 text-green-800 mb-2'>
                        <CreditCard className='w-4 h-4' />
                        <span className='font-medium text-sm'>
                          Payment Confirmed
                        </span>
                      </div>
                      <div className='space-y-1 text-xs text-green-700'>
                        <div className='flex justify-between'>
                          <span>Amount:</span>
                          <span className='font-bold'>
                            ₱{parseFloat(res.payment.amount).toLocaleString()}
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span>Method:</span>
                          <span>{res.payment.method}</span>
                        </div>
                        <div className='flex justify-between'>
                          <span>Paid:</span>
                          <span>{formatDate(res.payment.paidAt)}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-3'>
                      <div className='flex items-center gap-2 text-yellow-800'>
                        <AlertCircle className='w-4 h-4' />
                        <span className='font-medium text-sm'>
                          Payment Pending
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Active Indicator */}
                  {res.isActive && (
                    <div className='flex items-center gap-2 text-green-600 bg-green-50 rounded-lg p-2'>
                      <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
                      <span className='text-xs font-medium'>
                        Currently Active
                      </span>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className='px-4 py-3 bg-gray-50 border-t text-xs text-gray-500'>
                  <div className='flex items-center gap-1'>
                    <Clock className='w-3 h-3' />
                    <span>Created {formatDate(res.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Reservation
