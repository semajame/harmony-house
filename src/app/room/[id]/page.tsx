'use client'

import { useParams } from 'next/navigation'
import { rooms } from '@/lib/rooms'
import Image from 'next/image'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function RoomPage() {
  const params = useParams()
  const roomId = Number(params.id)
  const room = rooms.find((r) => r.id === roomId)

  const [checkInDate, setCheckInDate] = useState('')
  const [checkInTime, setCheckInTime] = useState('7pm')
  const [checkOutTime, setCheckOutTime] = useState('11pm')
  const [persons, setPersons] = useState(5)

  if (!room) {
    return (
      <div className='min-h-screen flex items-center justify-center text-red-600 text-lg font-semibold'>
        Room not found.
      </div>
    )
  }

  return (
    <div className='min-h-screen max-w-6xl mx-auto p-6 grid md:grid-cols-3 gap-8 py-[8rem]'>
      {/* Filter Sidebar */}
      <div className='border p-4 col-span-1'>
        <div className='bg-gray-100 p-4 space-y-4 h-full flex justify-between flex-col'>
          <div>
            <div>
              <p className='font-semibold text-sm mb-1'>
                CHECK IN AVAILABILITY
              </p>

              <label className='block text-sm text-gray-600 mt-10'>
                Check-in
              </label>
              <input
                type='date'
                className='w-full p-2 mt-1 bg-pink-100 rounded'
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
              />
            </div>
            <div>
              <label className='block text-sm text-gray-600'>
                Check-in time
              </label>
              <input
                type='text'
                className='w-full p-2 mt-1 bg-pink-100 rounded'
                value={checkInTime}
                onChange={(e) => setCheckInTime(e.target.value)}
              />
            </div>
            <div>
              <label className='block text-sm text-gray-600'>
                Check-out time
              </label>
              <input
                type='text'
                className='w-full p-2 mt-1 bg-pink-100 rounded'
                value={checkOutTime}
                onChange={(e) => setCheckOutTime(e.target.value)}
              />
            </div>
            <div>
              <label className='block text-sm text-gray-600'>Persons:</label>
              <input
                type='number'
                min={1}
                className='w-full p-2 mt-1 bg-pink-100 rounded'
                value={persons}
                onChange={(e) => setPersons(Number(e.target.value))}
              />
            </div>
          </div>

          <Button>Book Now</Button>
        </div>
      </div>

      {/* Room Details */}
      <div className='col-span-2 space-y-6'>
        <h1 className='text-3xl font-bold text-gray-800 text-center'>
          {room.name}
        </h1>

        <div className='relative w-full h-64 md:h-96 bg-gray-100 rounded-lg overflow-hidden shadow'>
          <Image
            src={room.image}
            alt={room.name}
            fill
            className='object-contain'
            priority
          />
        </div>

        <div className='space-y-3'>
          <p className='text-lg text-gray-700 font-medium'>{room.price}</p>
          <p className='text-gray-600'>{room.description}</p>
        </div>
      </div>
    </div>
  )
}
