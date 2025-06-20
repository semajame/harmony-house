'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { DollarSign, Activity, Utensils, ShoppingCart } from 'lucide-react'

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

export default function Dashboard() {
  const [reservations, setReservations] = useState<ReservationData[]>([])
  const [foods, setFoods] = useState<Food[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReservations = async () => {
    try {
      const res = await fetch('/api/admin/reservations')
      if (!res.ok) throw new Error('Failed to fetch reservations')
      const data = await res.json()
      setReservations(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchFoods = async () => {
    try {
      const res = await fetch('/api/admin/products')
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
      console.error('Failed to fetch products:', error)
    }
  }

  useEffect(() => {
    fetchReservations()
    fetchFoods()
  }, [])

  const totalFoods = useMemo(() => foods.length, [foods])

  // ✅ Total payment revenue (from payments)
  const totalRevenue = useMemo(() => {
    return reservations.reduce((sum, res) => {
      const paymentAmount = res.payment ? parseFloat(res.payment.amount) : 0
      return sum + paymentAmount
    }, 0)
  }, [reservations])

  const stats = [
    {
      title: 'Total Revenue',
      value: `₱${totalRevenue.toLocaleString('en-PH', {
        minimumFractionDigits: 2,
      })}`,
      icon: DollarSign,
      color: 'bg-green-500',
      change: '+5.6%',
    },
    {
      title: 'Total Reservations',
      value: reservations.length.toString(),
      icon: Activity,
      color: 'bg-blue-500',
      change: '+3.2%',
    },
    {
      title: 'Total Foods',
      value: totalFoods.toString(),
      icon: Utensils,
      color: 'bg-yellow-500',
      change: '+0.0%',
    },
  ]

  return (
    <div className='flex h-full bg-gray-100'>
      <main className='flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6'>
          {stats.map((stat, index) => (
            <div key={index} className='bg-white rounded-lg shadow p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>
                    {stat.title}
                  </p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className='h-6 w-6 text-white' />
                </div>
              </div>
              <div className='mt-4 flex items-center'>
                <span className='text-green-600 text-sm font-medium'>
                  {stat.change}
                </span>
                <span className='text-gray-600 text-sm ml-2'>
                  from last month
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Add more dashboard content below... */}
      </main>
    </div>
  )
}
