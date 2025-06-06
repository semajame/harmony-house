'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

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
  }, [])

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

      const {
        food, // still excluding food
        totalPrice,
        checkIn,
        checkOut,
        ...rest
      } = parsedReservation

      const reservationPayload = {
        ...rest,
        startTime: checkIn,
        endTime: checkOut,
        amount: totalPrice, // Include the totalPrice as amount
      }

      const response = await fetch('/api/customer/reserve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationPayload),
      })

      if (!response.ok) {
        throw new Error('Failed to reserve')
      }

      alert('GCash payment confirmed! (Simulation)')
      router.push('/confirmation')
    } catch (error) {
      console.error('Error confirming payment:', error)
      alert('An error occurred while confirming the payment.')
    } finally {
      setIsLoading(false)
    }
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

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 mt-[5rem]'>
      <div className='max-w-2xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4'>
            <svg
              className='w-8 h-8 text-white'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
              />
            </svg>
          </div>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            Complete Your Payment
          </h1>
          <p className='text-gray-600'>Secure payment via GCash</p>
        </div>

        <div className='bg-white rounded-2xl shadow-xl overflow-hidden'>
          {/* Reservation Summary */}
          <div className='bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white'>
            <h2 className='text-xl font-semibold mb-4 flex items-center'>
              <svg
                className='w-5 h-5 mr-2'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
                />
              </svg>
              Reservation Summary
            </h2>
            <div className=''>
              <div className='flex gap-4 items-center justify-between'>
                <div className='space-y-3'>
                  <div>
                    <p className='text-sm opacity-80'>Guest Name</p>
                    <p className='font-medium'>
                      {session?.user?.username || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm opacity-80'>Email</p>
                    <p className='font-medium'>
                      {session?.user?.email || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm opacity-80'>Phone</p>
                    <p className='font-medium'>
                      {session?.user?.phone || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className='space-y-3'>
                  <div>
                    <p className='text-sm opacity-80'>Check-in</p>
                    <p className='font-medium'>
                      {formatDate(reservation.checkIn)}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm opacity-80'>Check-out</p>
                    <p className='font-medium'>
                      {formatDate(reservation.checkOut)}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm opacity-80'>Foods</p>
                    {reservation.food.map((item: any, index: number) => (
                      <div key={index} className='flex items-center'>
                        <p className='font-medium'>{item.name}</p>
                        <p className='text-sm font-medium'>
                          {item.quantity} × ₱{item.price} = ₱{item.total}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className='text-center mt-5'>
                <p className='text-lg opacity-80'>Total Payment</p>
                <p className='font-medium text-2xl'>
                  ₱{reservation.totalPrice.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Instructions */}
        <div className='p-8'>
          <div className='bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-6'>
            <div className='flex items-center mb-4'>
              <div className='flex-shrink-0 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mr-4'>
                <svg
                  className='w-5 h-5 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z'
                  />
                </svg>
              </div>
              <div>
                <h3 className='text-lg font-semibold text-green-800'>
                  GCash Payment Details
                </h3>
                <p className='text-green-600 text-sm'>
                  Send your payment to the account below
                </p>
              </div>
            </div>

            <div className='bg-white rounded-lg p-4 border border-green-200'>
              <div className='grid md:grid-cols-2 gap-4'>
                <div className='flex items-center p-3 bg-gray-50 rounded-lg'>
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
                <div className='flex items-center p-3 bg-gray-50 rounded-lg'>
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
                    <p className='font-bold text-gray-900'>Harmony House</p>
                  </div>
                </div>
              </div>
            </div>

            <div className='mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
              <div className='flex items-start'>
                <svg
                  className='w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                <p className='text-sm text-blue-700'>
                  After sending the GCash payment, click the "Confirm Payment"
                  button below to complete your reservation.
                </p>
              </div>
            </div>
          </div>

          {/* Confirm Payment Button */}
          <button
            onClick={handleConfirmPayment}
            disabled={isLoading}
            className='w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center cursor-pointer'
          >
            {isLoading ? (
              <>
                <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3'></div>
                Processing Payment...
              </>
            ) : (
              <>
                <svg
                  className='w-5 h-5 mr-2'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                Confirm Payment
              </>
            )}
          </button>

          {/* Security Notice */}
          <div className='mt-6 flex items-center justify-center text-sm text-gray-500'>
            <svg
              className='w-4 h-4 mr-2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
              />
            </svg>
            Your payment information is secure and encrypted
          </div>
        </div>
      </div>
    </div>
  )
}
