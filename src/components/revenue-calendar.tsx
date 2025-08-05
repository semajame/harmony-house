'use client'

import { useEffect, useMemo, useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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

export default function RevenueCalendar() {
  const [reservations, setReservations] = useState<ReservationData[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

  const filteredReservations = useMemo(() => {
    const target = `${selectedDate.getFullYear()}-${(
      selectedDate.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`

    return reservations.filter((res) => {
      const resDate = new Date(res.startTime)
      const resStr = `${resDate.getFullYear()}-${(resDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${resDate.getDate().toString().padStart(2, '0')}`

      return resStr === target
    })
  }, [reservations, selectedDate])

  const totalRevenue = useMemo(() => {
    return filteredReservations.reduce((sum, res) => {
      if (res.status === 'confirmed' && res.payment?.amount) {
        const paymentAmount = parseFloat(res.payment.amount)
        return sum + (isNaN(paymentAmount) ? 0 : paymentAmount)
      }
      return sum
    }, 0)
  }, [filteredReservations])

  return (
    <div className='w-full flex gap-2'>
      <Calendar
        mode='single'
        selected={selectedDate}
        onSelect={setSelectedDate}
        required
      />

      <div className='bg-white border rounded-xl shadow-sm p-4 inline-block'>
        <div>
          <h1 className='text-sm text-gray-600 font-medium'>
            Revenue for {selectedDate.toDateString()}
          </h1>
        </div>
        <div>
          <p className='text-2xl font-bold text-green-500'>
            ₱
            {totalRevenue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </p>
          <p className='text-sm text-muted-foreground mt-1'>
            ({filteredReservations.length}{' '}
            {filteredReservations.length === 1 ? 'reservation' : 'reservations'}
            )
          </p>
        </div>
      </div>

      {loading && <p className='text-center text-sm'>Loading...</p>}
      {error && <p className='text-center text-red-500'>{error}</p>}
    </div>
  )
}
