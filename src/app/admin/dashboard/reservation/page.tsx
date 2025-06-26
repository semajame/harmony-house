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
  food: {
    id: number
    name: string
    quantity: number
    price: number
    total: number
  }[]
}

const Reservation = () => {
  const [reservations, setReservations] = useState<ReservationData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMonth, setSelectedMonth] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

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

  useEffect(() => {
    fetchReservations()
  }, [])

  //^ delete the reservation
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this reservation?')) return
    try {
      const res = await fetch(`/api/admin/reservations/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete reservation')
      await fetchReservations()
    } catch (err) {
      console.error(err)
    }
  }

  //^ Edit the status
  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      const url = `/api/admin/reservations/${id}`

      const requestBody = { status: newStatus }

      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })

      if (!res.ok) {
        const errorText = await res.text()

        throw new Error(
          `Failed to update reservation status: ${res.status} ${errorText}`
        )
      }

      // Refresh the reservations list to show updated status
      await fetchReservations()
    } catch (err) {
      console.error('Error updating status:', err)
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

  const getConfirmedReservations = () =>
    reservations.filter((res) => res.status === 'confirmed').length
  const getPendingReservations = () =>
    reservations.filter((res) => res.status === 'pending').length
  const getCancelledReservations = () =>
    reservations.filter((res) => res.status === 'cancelled').length

  // Filter reservations by selected month and status
  const filteredReservations = reservations.filter((res) => {
    // Month filter
    const monthMatch =
      selectedMonth === 'all' ||
      new Date(res.startTime).toISOString().slice(0, 7) === selectedMonth

    // Status filter
    let statusMatch = true
    if (selectedStatus === 'active') {
      statusMatch = res.isActive
    } else if (selectedStatus !== 'all') {
      statusMatch = res.status === selectedStatus
    }

    return monthMatch && statusMatch
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
          <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>Reservations</h1>
              <p className='text-gray-600 mt-1'>
                Manage and track all reservations
              </p>
            </div>

            {/* Filters */}
            <div className='flex flex-col sm:flex-row gap-3'>
              {/* Month Filter */}
              <div className='flex items-center gap-2'>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className='px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-36'
                >
                  <option value='all'>All Months</option>
                  {getAvailableMonths().map((month) => (
                    <option key={month} value={month}>
                      {formatMonthLabel(month)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className='flex items-center gap-2'>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className='px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-32'
                >
                  <option value='all'>All Status</option>
                  <option value='confirmed'>Confirmed</option>
                  <option value='pending'>Pending</option>
                  <option value='cancelled'>Cancelled</option>
                </select>
              </div>
            </div>

            {/* Quick Stats */}
            <div className='flex gap-3 flex-wrap'>
              <div className='bg-blue-50 rounded-lg p-3 text-center min-w-16'>
                <div className='text-xl font-bold text-blue-600'>
                  {reservations.length}
                </div>
                <div className='text-xs text-blue-600'>Total</div>
              </div>
              <div className='bg-green-50 rounded-lg p-3 text-center min-w-16'>
                <div className='text-xl font-bold text-green-600'>
                  {getConfirmedReservations()}
                </div>
                <div className='text-xs text-green-600'>Confirmed</div>
              </div>
              <div className='bg-yellow-50 rounded-lg p-3 text-center min-w-16'>
                <div className='text-xl font-bold text-yellow-600'>
                  {getPendingReservations()}
                </div>
                <div className='text-xs text-yellow-600'>Pending</div>
              </div>
              <div className='bg-red-50 rounded-lg p-3 text-center min-w-16'>
                <div className='text-xl font-bold text-red-600'>
                  {getCancelledReservations()}
                </div>
                <div className='text-xs text-red-600'>Cancelled</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Results Info */}
        {(selectedMonth !== 'all' || selectedStatus !== 'all') && (
          <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Filter className='w-4 h-4 text-blue-600' />
                <span className='text-sm font-medium text-blue-800'>
                  Showing {filteredReservations.length} of {reservations.length}{' '}
                  reservations
                  {selectedMonth !== 'all' &&
                    ` for ${formatMonthLabel(selectedMonth)}`}
                  {selectedStatus !== 'all' && ` with ${selectedStatus} status`}
                </span>
              </div>
              <button
                onClick={() => {
                  setSelectedMonth('all')
                  setSelectedStatus('all')
                }}
                className='text-sm text-blue-600 hover:text-blue-800 font-medium'
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Reservations Grid */}
        {filteredReservations.length === 0 ? (
          <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center'>
            <CalendarDays className='w-16 h-16 text-gray-400 mx-auto mb-4' />
            <h3 className='text-xl font-semibold text-gray-700 mb-2'>
              {reservations.length === 0
                ? 'No reservations found'
                : 'No reservations match your filters'}
            </h3>
            <p className='text-gray-500'>
              {reservations.length === 0
                ? 'Reservations will appear here when customers make bookings.'
                : 'Try adjusting your filters to see more results.'}
            </p>
          </div>
        ) : (
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {filteredReservations.map((res) => (
              <div
                key={res.id}
                className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'
              >
                {/* Header */}
                <div className='bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white'>
                  <div className='flex items-center justify-between mb-2'>
                    <h3 className='font-semibold text-lg truncate'>
                      {res.room.name}
                    </h3>
                    <select
                      className='bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-medium capitalize cursor-pointer border-0 outline-none'
                      value={res.status}
                      onChange={(e) =>
                        handleStatusUpdate(res.id, e.target.value)
                      }
                    >
                      <option value='pending'>🟡 Pending</option>
                      <option value='confirmed'>🟢 Confirmed</option>
                      <option value='cancelled'>🔴 Cancelled</option>
                    </select>
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

                  {/* foods */}
                  {res.food && res.food.length > 0 && (
                    <div>
                      <p className='text-sm opacity-80'>Foods</p>
                      <div className='space-y-1'>
                        {res.food.map((item: any, index: number) => (
                          <div
                            key={index}
                            className='flex items-center justify-between text-sm'
                          >
                            <span className='font-medium'>{item.name}</span>
                            <span>
                              {item.quantity} × ₱{item.price} = ₱{item.total}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Room Details */}
                  <div className='bg-gray-50 rounded-lg p-3 space-y-2'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <Users className='w-4 h-4 text-gray-500' />
                        <span className='text-sm text-gray-600'>
                          Capacity: {res.room.capacity}
                        </span>
                      </div>
                      {/* <div className='font-bold text-green-600'>
                        ₱{parseFloat(res.room.price).toLocaleString()}
                      </div> */}
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
