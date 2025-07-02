'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import {
  Calendar,
  Clock,
  CreditCard,
  MapPin,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReservations = async () => {
      if (!session?.user?.id) return

      try {
        const res = await fetch(
          `/api/admin/reservations/by-user-id?id=${session.user.id}`
        )
        if (!res.ok) throw new Error('Failed to fetch reservations')

        const data = await res.json()
        setReservations(data)
      } catch (err) {
        console.error('Error fetching reservations:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchReservations()
  }, [session?.user?.id])

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return <CheckCircle className='w-5 h-5 text-green-500' />
      case 'cancelled':
        return <XCircle className='w-5 h-5 text-red-500' />
      case 'pending':
        return <AlertCircle className='w-5 h-5 text-yellow-500' />
      default:
        return <AlertCircle className='w-5 h-5 text-gray-500' />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-24 px-4'>
        <div className='max-w-6xl mx-auto'>
          <div className='animate-pulse'>
            <div className='h-8 bg-gray-300 rounded w-64 mb-8'></div>
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {[...Array(6)].map((_, i) => (
                <div key={i} className='bg-white rounded-xl p-6 shadow-lg'>
                  <div className='h-4 bg-gray-300 rounded w-3/4 mb-4'></div>
                  <div className='h-3 bg-gray-200 rounded w-1/2 mb-2'></div>
                  <div className='h-3 bg-gray-200 rounded w-2/3 mb-2'></div>
                  <div className='h-3 bg-gray-200 rounded w-1/3'></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-28 px-4 pb-10'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex justify-between items-center'>
            <div>
              <h1 className='text-4xl font-bold text-gray-800 mb-2'>
                My Dashboard
              </h1>
              <p className='text-gray-600'>
                Manage and track your room bookings
              </p>
            </div>
            <div className='flex gap-2 items-center'>
              <Link
                href='/dashboard/my-reviews'
                className='bg-gradient-to-r from-indigo-500 to-purple-600 py-2 px-4 text-white rounded-md'
              >
                My Reviews
              </Link>
            </div>
          </div>
          <div className='flex items-center gap-4 mt-4'>
            <div className='bg-white rounded-lg px-4 py-2 shadow-sm'>
              <span className='text-sm text-gray-500'>Total Reservations</span>
              <p className='text-2xl font-bold text-indigo-600'>
                {reservations.length}
              </p>
            </div>
          </div>
        </div>

        {reservations.length === 0 ? (
          <div className='bg-white rounded-xl shadow-lg p-12 text-center'>
            <Calendar className='w-16 h-16 text-gray-300 mx-auto mb-4' />
            <h3 className='text-xl font-semibold text-gray-700 mb-2'>
              No reservations found
            </h3>
            <p className='text-gray-500'>
              You haven't made any reservations yet. Start by booking a room!
            </p>
          </div>
        ) : (
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {reservations.map((reservation: any) => {
              const startDateTime = formatDateTime(reservation.startTime)
              const endDateTime = formatDateTime(reservation.endTime)

              return (
                <div
                  key={reservation.id}
                  className='bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100'
                >
                  {/* Card Header */}
                  <div className='bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <MapPin className='w-5 h-5' />
                        <h3 className='font-semibold text-lg'>
                          {reservation.room.name}
                        </h3>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          reservation.status
                        )}`}
                      >
                        <div className='flex items-center gap-1'>
                          {getStatusIcon(reservation.status)}
                          {reservation.status}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className='p-6 space-y-4'>
                    {/* Capacity */}
                    <div className='flex items-center gap-3'>
                      <Users className='w-4 h-4 text-gray-400' />
                      <span className='text-sm text-gray-600'>Capacity:</span>
                      <span className='font-medium text-gray-800'>
                        {reservation.room.capacity} people
                      </span>
                    </div>

                    {/* Date and Time */}
                    <div className='bg-gray-50 rounded-lg p-4'>
                      <div className='flex items-center gap-2 mb-2'>
                        <Calendar className='w-4 h-4 text-indigo-500' />
                        <span className='text-sm font-medium text-gray-700'>
                          Reservation Period
                        </span>
                      </div>
                      <div className='text-sm text-gray-600 space-y-1'>
                        <div className='flex items-center gap-2'>
                          <Clock className='w-3 h-3' />
                          <span>
                            Start: {startDateTime.date} at {startDateTime.time}
                          </span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Clock className='w-3 h-3' />
                          <span>
                            End: {endDateTime.date} at {endDateTime.time}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Info */}
                    {reservation.payment && (
                      <div className='bg-green-50 rounded-lg p-4'>
                        <div className='flex items-center gap-2 mb-2'>
                          <CreditCard className='w-4 h-4 text-green-600' />
                          <span className='text-sm font-medium text-green-800'>
                            Payment Details
                          </span>
                        </div>
                        <div className='text-sm space-y-1'>
                          <div className='flex justify-between'>
                            <span className='text-gray-600'>Method:</span>
                            <span className='font-medium text-gray-800'>
                              {reservation.payment.method}
                            </span>
                          </div>
                          <div className='flex justify-between'>
                            <span className='text-gray-600'>Amount:</span>
                            <span className='font-bold text-green-600'>
                              ₱{reservation.payment.amount}
                            </span>
                          </div>
                          <div className='flex justify-between'>
                            <span className='text-gray-600'>Paid:</span>
                            <span className='text-sm text-gray-500'>
                              {reservation.payment.paidAt
                                ? formatDateTime(reservation.payment.paidAt)
                                    .date
                                : 'Not Paid'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
