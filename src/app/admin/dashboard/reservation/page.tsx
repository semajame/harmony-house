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
  X,
  Eye,
} from 'lucide-react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Label } from 'recharts'

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
  foods?: {
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
  const [selectedReservation, setSelectedReservation] =
    useState<ReservationData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchReservations = async () => {
    try {
      const res = await fetch('/api/admin/reservations', {
        method: 'GET',
      })

      if (!res.ok) throw new Error('Failed to fetch reservations')

      const data = await res.json()

      console.log('Fetched reservations:', data) // ✅ correct log
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
  const handleDelete = async (id: number) => {
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

  const handleViewDetails = (reservation: ReservationData) => {
    setSelectedReservation(reservation)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedReservation(null)
  }


  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
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
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className='min-w-36 cursor-pointer'>
                    <SelectValue
                      placeholder='Select month'
                      className='cursor-pointer'
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all' className='cursor-pointer'>
                      All Months
                    </SelectItem>
                    {getAvailableMonths().map((month) => (
                      <SelectItem
                        key={month}
                        value={month}
                        className='cursor-pointer'
                      >
                        {formatMonthLabel(month)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className='flex items-center gap-2'>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className='min-w-32 cursor-pointer'>
                    <SelectValue
                      placeholder='Select status'
                      className='cursor-pointer'
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all' className='cursor-pointer'>
                      All Status
                    </SelectItem>
                    <SelectItem value='confirmed' className='cursor-pointer'>
                      Confirmed
                    </SelectItem>
                    <SelectItem value='pending' className='cursor-pointer'>
                      Pending
                    </SelectItem>
                    <SelectItem value='cancelled' className='cursor-pointer'>
                      Cancelled
                    </SelectItem>
                  </SelectContent>
                </Select>
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

        {/* Reservations Table */}
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
          <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-gray-50 border-b border-gray-200'>
                  <tr>
                    <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Reservation
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Customer
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Room
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Date & Time
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Status
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Payment
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {filteredReservations.map((reservation: ReservationData) => (
                    <tr key={reservation.id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='flex items-center'>
                          <div>
                            <div className='text-sm font-medium text-gray-900'>
                              #{reservation.id}
                            </div>
                            <div className='text-sm text-gray-500'>
                              {formatDate(reservation.createdAt)}
                            </div>
                            {reservation.isActive && (
                              <div className='flex items-center gap-1 mt-1'>
                                <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
                                <span className='text-xs text-green-600 font-medium'>
                                  Active
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div>
                          <div className='text-sm font-medium text-gray-900'>
                            {reservation.user.name}
                          </div>
                          <div className='text-sm text-gray-500'>
                            {reservation.user.email}
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div>
                          <div className='text-sm font-medium text-gray-900'>
                            {reservation.room.name}
                          </div>
                          <div className='text-sm text-gray-500'>
                            Capacity: {reservation.room.capacity}
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div>
                          <div className='text-sm font-medium text-gray-900'>
                            {formatDate(reservation.startTime)}
                          </div>
                          <div className='text-sm text-gray-500'>
                            {formatTime(reservation.startTime)} -{' '}
                            {formatTime(reservation.endTime)}
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <Select
                          value={reservation.status}
                          onValueChange={(value) =>
                            handleStatusUpdate(reservation.id, value)
                          }
                        >
                          <SelectTrigger
                            className={`px-3 py-1 rounded-full text-sm font-medium border cursor-pointer ${getStatusBadge(
                              reservation.status
                            )}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem
                              value='pending'
                              className='cursor-pointer'
                            >
                              Pending
                            </SelectItem>
                            <SelectItem
                              value='confirmed'
                              className='cursor-pointer'
                            >
                              Confirmed
                            </SelectItem>
                            <SelectItem
                              value='cancelled'
                              className='cursor-pointer'
                            >
                              Cancelled
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        {reservation.payment ? (
                          <div className='flex items-center gap-2'>
                            <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                            <span className='text-sm text-green-600 font-medium'>
                              ₱
                              {parseFloat(
                                reservation.payment.amount
                              ).toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          <div className='flex items-center gap-2'>
                            <div className='w-2 h-2 bg-yellow-500 rounded-full'></div>
                            <span className='text-sm text-yellow-600 font-medium'>
                              Pending
                            </span>
                          </div>
                        )}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='flex gap-2'>
                          <Dialog
                            open={
                              isModalOpen &&
                              selectedReservation?.id === reservation.id
                            }
                            onOpenChange={(open) => {
                              if (!open) closeModal()
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant='outline'
                                size='sm'
                                onClick={() => handleViewDetails(reservation)}
                                className='flex items-center gap-2 cursor-pointer'
                              >
                                <Eye className='w-4 h-4' />
                                View Details
                              </Button>
                            </DialogTrigger>
                            {selectedReservation && (
                              <DialogContent className='max-w-[1000px] max-h-[75vh] overflow-y-auto'>
                                <DialogHeader>
                                  <DialogTitle className='flex items-center justify-between'>
                                    <div>
                                      <h2 className='text-2xl font-bold'>
                                        Reservation Details
                                      </h2>
                                      <p className='text-sm text-muted-foreground'>
                                        #{reservation.id}
                                      </p>
                                    </div>
                                  </DialogTitle>
                                </DialogHeader>

                                <div className='space-y-6'>
                                  {/* Customer Info */}
                                  <Card>
                                    <CardHeader>
                                      <CardTitle>
                                        Customer Information
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className='space-y-4'>
                                      <div className='flex items-center gap-3'>
                                        <User className='w-5 h-5 text-muted-foreground' />
                                        <div>
                                          <p className='font-medium'>
                                            {selectedReservation.user.name}
                                          </p>
                                          <p className='text-sm text-muted-foreground'>
                                            Customer Name
                                          </p>
                                        </div>
                                      </div>
                                      <div className='flex items-center gap-3'>
                                        <Mail className='w-5 h-5 text-muted-foreground' />
                                        <div>
                                          <p className='font-medium'>
                                            {selectedReservation.user.email}
                                          </p>
                                          <p className='text-sm text-muted-foreground'>
                                            Email
                                          </p>
                                        </div>
                                      </div>
                                      {selectedReservation.user.phone && (
                                        <div className='flex items-center gap-3'>
                                          <Phone className='w-5 h-5 text-muted-foreground' />
                                          <div>
                                            <p className='font-medium'>
                                              {selectedReservation.user.phone}
                                            </p>
                                            <p className='text-sm text-muted-foreground'>
                                              Phone
                                            </p>
                                          </div>
                                        </div>
                                      )}
                                    </CardContent>
                                  </Card>

                                  {/* Room Info */}
                                  <Card>
                                    <CardHeader>
                                      <CardTitle>Room Information</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className='flex items-center gap-2'>
                                        <MapPin className='w-5 h-5 text-muted-foreground' />
                                        <span className='font-medium'>
                                          {selectedReservation.room.name}
                                        </span>
                                      </div>
                                      <div className='flex items-center gap-2 text-muted-foreground mt-2'>
                                        <Users className='w-4 h-4' />
                                        <span>
                                          Capacity:{' '}
                                          {selectedReservation.room.capacity}{' '}
                                          people
                                        </span>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  {/* Date & Time */}
                                  <Card>
                                    <CardHeader>
                                      <CardTitle>Date & Time</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                        <div>
                                          <p className='text-sm text-muted-foreground mb-1'>
                                            Start
                                          </p>
                                          <p className='font-medium'>
                                            {formatDate(
                                              selectedReservation.startTime
                                            )}
                                          </p>
                                          <p className='text-sm text-muted-foreground'>
                                            {formatTime(
                                              selectedReservation.startTime
                                            )}
                                          </p>
                                        </div>
                                        <div>
                                          <p className='text-sm text-muted-foreground mb-1'>
                                            End
                                          </p>
                                          <p className='font-medium'>
                                            {formatDate(
                                              selectedReservation.endTime
                                            )}
                                          </p>
                                          <p className='text-sm text-muted-foreground'>
                                            {formatTime(
                                              selectedReservation.endTime
                                            )}
                                          </p>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  {/* Food Orders */}
                                  {reservation.foods &&
                                    reservation.foods.length > 0 && (
                                      <Card>
                                        <CardHeader>
                                          <CardTitle className='text-lg flex items-center gap-2'>
                                            <Calendar className='w-5 h-5' />
                                            Ordered Foods
                                          </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className='space-y-2'>
                                            {reservation.foods.map(
                                              (food, index: number) => (
                                                <div
                                                  key={index}
                                                  className='flex justify-between items-center py-2 border-b last:border-b-0'
                                                >
                                                  <div>
                                                    <span className='font-medium text-gray-800'>
                                                      {food.name}
                                                    </span>
                                                    <span className='text-sm text-gray-600 ml-2'>
                                                      × {food.quantity}
                                                    </span>
                                                  </div>
                                                  <Badge variant='outline'>
                                                    ₱{food.total}
                                                  </Badge>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}

                                  {/* Payment */}
                                  <Card>
                                    <CardHeader>
                                      <CardTitle>Payment Information</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      {selectedReservation.payment ? (
                                        <div className='space-y-2'>
                                          <div className='flex items-center gap-2 text-green-600'>
                                            <CheckCircle className='w-4 h-4' />
                                            <span className='font-medium'>
                                              Payment Confirmed
                                            </span>
                                          </div>
                                          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-2'>
                                            <div>
                                              <p className='text-sm text-muted-foreground'>
                                                Amount
                                              </p>
                                              <p className='font-bold text-green-700'>
                                                ₱
                                                {parseFloat(
                                                  selectedReservation.payment
                                                    .amount
                                                ).toLocaleString()}
                                              </p>
                                            </div>
                                            <div>
                                              <p className='text-sm text-muted-foreground'>
                                                Method
                                              </p>
                                              <p className='font-medium'>
                                                {
                                                  selectedReservation.payment
                                                    .method
                                                }
                                              </p>
                                            </div>
                                            <div className='md:col-span-2'>
                                              <p className='text-sm text-muted-foreground'>
                                                Paid On
                                              </p>
                                              <p>
                                                {formatDate(
                                                  selectedReservation.payment
                                                    .paidAt
                                                )}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className='flex items-center gap-2 text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2'>
                                          <AlertCircle className='w-4 h-4' />
                                          <span className='font-medium'>
                                            Payment Pending
                                          </span>
                                        </div>
                                      )}
                                    </CardContent>
                                  </Card>
                                  {/* Status */}
                                  <div className='space-y-2'>
                                    <Label>Status</Label>
                                    <div className='flex items-center gap-3'>
                                      <Badge
                                        className={`capitalize ${getStatusBadge(
                                          selectedReservation.status
                                        )}`}
                                      >
                                        {selectedReservation.status}
                                      </Badge>
                                      {selectedReservation.isActive && (
                                        <div className='flex items-center gap-2 text-green-600 bg-green-50 rounded-full px-3 py-1'>
                                          <div className='w-2 h-2 bg-green-600 rounded-full animate-pulse' />
                                          <span className='text-sm font-medium'>
                                            Currently Active
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  {/* Created At */}
                                  <div className='border-t pt-4'>
                                    <p className='text-sm text-muted-foreground flex items-center gap-2'>
                                      <Clock className='w-4 h-4' />
                                      Created on{' '}
                                      {formatDate(
                                        selectedReservation.createdAt
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </DialogContent>
                            )}
                          </Dialog>

                          <Button
                            variant='ghost'
                            size='sm'
                            className='text-red-600 hover:text-red-800 text-sm cursor-pointer'
                            onClick={() => handleDelete(reservation.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Reservation
