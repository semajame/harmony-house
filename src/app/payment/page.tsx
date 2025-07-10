'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import {
  CreditCard,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  UtensilsCrossed,
  Receipt,
  Shield,
  Clock,
  CheckCircle,
  Loader2,
} from 'lucide-react'

interface Reservation {
  roomId: number
  checkIn: string
  checkOut: string
  totalPrice: number
  food: {
    id: number
    name: string
    quantity: number
    price: number
    total: number
  }[]
}

export default function PaymentPage() {
  const { data: session } = useSession()
  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const pricePerNight = 2000
  const [totalPayment, setTotalPayment] = useState<number | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('reservation')
    if (stored) {
      const res: Reservation = JSON.parse(stored)
      setReservation(res)

      console.log(stored)

      const checkInDate = new Date(res.checkIn)
      const checkOutDate = new Date(res.checkOut)
      const timeDiff = checkOutDate.getTime() - checkInDate.getTime()
      const nights = Math.ceil(timeDiff / (1000 * 3600 * 24))
      setTotalPayment(nights * pricePerNight)
    } else {
      alert('No reservation found. Redirecting back.')
      router.push('/')
    }
  }, [router])

  const handleConfirmPayment = async () => {
    setIsLoading(true)

    try {
      const rawReservation = localStorage.getItem('reservation')
      if (!rawReservation) {
        alert('Reservation data not found')
        setIsLoading(false)
        return
      }

      const parsedReservation = JSON.parse(rawReservation)
      console.log('Parsed Reservation:', parsedReservation)

      const {
        roomId,
        userId,
        totalPrice,
        checkIn,
        checkOut,
        food: foods,
      } = parsedReservation

      const reservationPayload = {
        roomId: Number(roomId),
        userId: Number(userId),
        startTime: checkIn,
        endTime: checkOut,
        amount: totalPrice,
        foods,
      }

      console.log('Sending payload:', reservationPayload)

      const response = await fetch('/api/admin/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationPayload),
      })

      const result = await response.json()

      if (!response.ok) {
        if (response.status === 409) {
          alert(
            result.error ||
              'Time conflict: This room is already reserved during this time.'
          )
        } else {
          alert(result.error || 'Failed to confirm reservation.')
        }
        return
      }

      alert('✅ GCash payment confirmed! (Simulation)')
      router.push('/confirmation')
    } catch (error) {
      console.error('Error confirming payment:', error)
      alert('An unexpected error occurred while confirming the payment.')
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (!reservation || totalPayment === null) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100'>
        <div className='bg-white p-8 rounded-2xl shadow-xl'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600 text-center'>
            Loading reservation details...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8 pt-[7rem]'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-12'>
          <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6 shadow-lg'>
            <CreditCard className='w-10 h-10 text-white' />
          </div>
          <h1 className='text-4xl font-bold text-gray-900 mb-3'>
            Complete Your Payment
          </h1>
          <p className='text-gray-600 text-lg'>
            Secure payment processing via GCash
          </p>
          <div className='flex items-center justify-center mt-3'>
            <Shield className='w-4 h-4 text-green-600 mr-2' />
            <span className='text-sm text-green-600 font-medium'>
              256-bit SSL Encrypted
            </span>
          </div>
        </div>

        <div className='grid lg:grid-cols-3 gap-8'>
          {/* Reservation Summary */}
          <div className='lg:col-span-2'>
            <div className='bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100'>
              {/* Header */}
              <div className='bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 text-white relative overflow-hidden'>
                <div className='absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16'></div>
                <div className='absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12'></div>

                <div className='relative z-10'>
                  <div className='flex items-center justify-center mb-2'>
                    <div className='bg-white/20 backdrop-blur-sm rounded-full p-3 mr-3'>
                      <Receipt className='w-6 h-6' />
                    </div>
                    <h2 className='text-3xl font-bold'>Reservation Summary</h2>
                  </div>
                  <p className='text-center text-blue-100 font-medium'>
                    Review your booking details
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className='p-8'>
                <div className='grid md:grid-cols-2 gap-8'>
                  {/* Guest Information */}
                  <div className='space-y-6'>
                    <div className='flex items-center mb-6'>
                      <div className='bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full p-2 mr-3'>
                        <User className='w-5 h-5 text-white' />
                      </div>
                      <h3 className='text-xl font-semibold text-gray-800'>
                        Guest Information
                      </h3>
                    </div>

                    <div className='space-y-4'>
                      <div className='bg-gray-50 rounded-xl p-4 border-l-4 border-blue-500'>
                        <div className='flex items-center mb-2'>
                          <User className='w-4 h-4 text-gray-600 mr-2' />
                          <span className='text-sm font-medium text-gray-600'>
                            Full Name
                          </span>
                        </div>
                        <p className='text-lg font-semibold text-gray-800'>
                          {session?.user?.name || 'N/A'}
                        </p>
                      </div>

                      <div className='bg-gray-50 rounded-xl p-4 border-l-4 border-indigo-500'>
                        <div className='flex items-center mb-2'>
                          <Mail className='w-4 h-4 text-gray-600 mr-2' />
                          <span className='text-sm font-medium text-gray-600'>
                            Email Address
                          </span>
                        </div>
                        <p className='text-lg font-semibold text-gray-800 break-words'>
                          {session?.user?.email || 'N/A'}
                        </p>
                      </div>

                      <div className='bg-gray-50 rounded-xl p-4 border-l-4 border-purple-500'>
                        <div className='flex items-center mb-2'>
                          <Phone className='w-4 h-4 text-gray-600 mr-2' />
                          <span className='text-sm font-medium text-gray-600'>
                            Phone Number
                          </span>
                        </div>
                        <p className='text-lg font-semibold text-gray-800'>
                          {session?.user?.phone || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className='space-y-6'>
                    <div className='flex items-center mb-6'>
                      <div className='bg-gradient-to-r from-purple-500 to-pink-600 rounded-full p-2 mr-3'>
                        <Calendar className='w-5 h-5 text-white' />
                      </div>
                      <h3 className='text-xl font-semibold text-gray-800'>
                        Booking Details
                      </h3>
                    </div>

                    <div className='space-y-4'>
                      <div className='bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200'>
                        <div className='flex items-center mb-2'>
                          <MapPin className='w-4 h-4 text-indigo-600 mr-2' />
                          <span className='text-sm font-medium text-indigo-700'>
                            Room
                          </span>
                        </div>
                        <p className='text-xl font-bold text-indigo-800'>
                          {reservation.roomId}
                        </p>
                      </div>

                      <div className='space-y-4'>
                        <div className='bg-green-50 rounded-xl p-4 border border-green-200'>
                          <div className='flex items-center mb-2'>
                            <Calendar className='w-4 h-4 text-green-600 mr-2' />
                            <span className='text-sm font-medium text-green-700'>
                              Check-in
                            </span>
                          </div>
                          <p className='text-sm font-semibold text-green-800'>
                            {formatDate(reservation.checkIn)}
                          </p>
                        </div>

                        <div className='bg-red-50 rounded-xl p-4 border border-red-200'>
                          <div className='flex items-center mb-2'>
                            <Calendar className='w-4 h-4 text-red-600 mr-2' />
                            <span className='text-sm font-medium text-red-700'>
                              Check-out
                            </span>
                          </div>
                          <p className='text-sm font-semibold text-red-800'>
                            {formatDate(reservation.checkOut)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Food Orders */}
                {reservation.food && reservation.food.length > 0 && (
                  <div className='mt-8'>
                    <div className='flex items-center mb-6'>
                      <div className='bg-gradient-to-r from-orange-500 to-red-600 rounded-full p-2 mr-3'>
                        <UtensilsCrossed className='w-5 h-5 text-white' />
                      </div>
                      <h3 className='text-xl font-semibold text-gray-800'>
                        Food Orders
                      </h3>
                    </div>

                    <div className='bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200'>
                      <div className='space-y-4'>
                        {reservation.food.map((item, index) => (
                          <div
                            key={index}
                            className='flex items-center justify-between bg-white rounded-lg p-4 shadow-sm border border-orange-100'
                          >
                            <div className='flex items-center'>
                              <div className='bg-orange-100 rounded-full p-2 mr-3'>
                                <UtensilsCrossed className='w-4 h-4 text-orange-600' />
                              </div>
                              <div>
                                <p className='font-semibold text-gray-800'>
                                  {item.name}
                                </p>
                                <p className='text-sm text-gray-600'>
                                  {item.quantity} × ₱
                                  {item.price.toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className='text-right'>
                              <p className='font-bold text-lg text-orange-600'>
                                ₱{item.total.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 sticky top-8'>
              <div className='text-center mb-8'>
                <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mb-4'>
                  <Receipt className='w-8 h-8 text-white' />
                </div>
                <h3 className='text-2xl font-bold text-gray-800 mb-2'>
                  Payment Summary
                </h3>
                <p className='text-gray-600'>Complete your secure payment</p>
              </div>

              {/* Total Payment */}
              <div className='bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-6 text-white text-center mb-8'>
                <div className='flex items-center justify-center mb-2'>
                  <Receipt className='w-6 h-6 mr-2' />
                  <h4 className='text-lg font-semibold'>Total Payment</h4>
                </div>
                <p className='text-4xl font-bold mb-2'>
                  ₱{reservation.totalPrice.toLocaleString()}
                </p>
                <p className='text-emerald-100 text-sm'>
                  All taxes and fees included
                </p>
              </div>

              <div className='bg-white rounded-lg p-4 border border-green-200'>
                <div className='grid place-items-center mb-4'>
                  <Image
                    src='/images/gcash.jpg'
                    alt='gcash image'
                    width={200}
                    height={200}
                    className='max-w-full h-auto'
                  />
                </div>

                <div className='grid grid-cols-1 gap-4 place-items-center'>
                  <div className='flex items-center bg-gray-50 rounded-lg w-full'>
                    <svg
                      className='w-5 h-5 text-green-600 mr-3'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                      />
                    </svg>
                    <div>
                      <p className='text-xs text-gray-500 uppercase tracking-wide'>
                        GCash Number
                      </p>
                      <p className='font-bold text-gray-900'>0917-123-4567</p>
                    </div>
                  </div>

                  <div className='flex items-center bg-gray-50 rounded-lg w-full'>
                    <svg
                      className='w-5 h-5 text-green-600 mr-3'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                      />
                    </svg>
                    <div>
                      <p className='text-xs text-gray-500 uppercase tracking-wide'>
                        Account Name
                      </p>
                      <p className='font-bold text-gray-900'>Mega Mae</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirm Payment Button */}
              <button
                onClick={handleConfirmPayment}
                disabled={isLoading}
                className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold text-lg cursor-pointer flex items-center justify-center mt-5${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className='w-5 h-5 mr-2 animate-spin' />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CheckCircle className='w-5 h-5 mr-2' />
                    Confirm Payment
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
