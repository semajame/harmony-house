'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

type Reservation = {
  name: string
  email: string
  phone: string
  checkIn: string
  checkOut: string
  totalPrice?: number
}

export default function ConfirmationPage() {
  const { data: session, status } = useSession()
  const [reservation, setReservation] = useState<Reservation | null>(null)
  const router = useRouter()

  const stored = localStorage.getItem('reservation')

  useEffect(() => {
    if (stored) {
      setReservation(JSON.parse(stored))
      console.log(reservation)
    } else {
      alert('No reservation found. Redirecting...')
      router.push('/')
    }
  }, [])

  const removeReservation = async () => {
    if (stored) {
      setReservation(JSON.parse(stored))
      console.log(reservation)
      localStorage.removeItem('reservation')

      router.push('/')
    }
  }

  if (!reservation) {
    return <div className='p-4'>Loading confirmation...</div>
  }

  return (
    <div className='min-h-screen'>
      <div className='max-w-xl mx-auto p-6  bg-white shadow-lg rounded-xl mt-[10rem] '>
        <h1 className='text-2xl font-bold mb-4 text-green-700'>
          Reservation Confirmed ✅
        </h1>
        <p className='mb-4'>
          Thank you, <strong>{session?.user.username}</strong>! Your reservation
          has been successfully received.
        </p>
        <button
          onClick={removeReservation}
          className='mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded cursor-pointer'
        >
          Back to Home
        </button>
      </div>
    </div>
  )
}
