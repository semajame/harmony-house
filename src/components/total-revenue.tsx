'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useMemo, useState } from 'react'

export default function TotalRevenue() {
  const [reservations, setReservations] = useState<any[]>([])
  const [selectedMonth, setSelectedMonth] = useState('All')

  const monthOptions = [
    'All',
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await fetch('/api/admin/reservations')
        const data = await res.json()
        setReservations(data)
      } catch (error) {
        console.error('Error fetching reservations:', error)
      }
    }

    fetchReservations()
  }, [])

  const totalRevenue = useMemo(() => {
    return reservations.reduce((sum, res) => {
      if (res.status === 'confirmed' && res.payment?.amount) {
        const paymentAmount = parseFloat(res.payment.amount)
        const createdMonth = new Date(res.createdAt).toLocaleString('en-US', {
          month: 'long',
        })

        if (
          selectedMonth.toLowerCase() === 'all' ||
          createdMonth.toLowerCase() === selectedMonth.toLowerCase()
        ) {
          return sum + (isNaN(paymentAmount) ? 0 : paymentAmount)
        }
      }
      return 0 + sum
    }, 0)
  }, [reservations, selectedMonth])

  const filteredCount = useMemo(() => {
    return reservations.filter((res) => {
      const createdMonth = new Date(res.createdAt).toLocaleString('en-US', {
        month: 'long',
      })
      return (
        selectedMonth.toLowerCase() === 'all' ||
        createdMonth.toLowerCase() === selectedMonth.toLowerCase()
      )
    }).length
  }, [reservations, selectedMonth])

  return (
    <div>
      {/* Dropdown filter */}
      <div className='mb-6'>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Filter by Month
        </label>
        <select
          className='border border-gray-300 rounded-md px-3 py-2 text-sm'
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {monthOptions.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <Card>
          <CardHeader>
            <CardTitle>Reservations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{filteredCount}</div>
            <p className='text-sm text-muted-foreground'>
              Number of reservations in {selectedMonth}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>₱{totalRevenue}</div>
            <p className='text-sm text-muted-foreground'>
              Total confirmed revenue in {selectedMonth}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
